import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { articles, categories, comments, type Comment } from "./data.ts";

const PORT = Number(process.env.PORT ?? 4000);
// Probability (0..1) that any request fails with a 500. Example: FAIL_RATE=0.2 pnpm dev
const FAIL_RATE = Number(process.env.FAIL_RATE ?? 0);
const MIN_DELAY = Number(process.env.MIN_DELAY ?? 200);
const MAX_DELAY = Number(process.env.MAX_DELAY ?? 700);

type Handler = (ctx: {
  req: IncomingMessage;
  url: URL;
  params: Record<string, string>;
  body: unknown;
}) => { status: number; json: unknown };

type Route = { method: string; pattern: RegExp; keys: string[]; handler: Handler };

const routes: Route[] = [];

function route(method: string, path: string, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp(
    "^" + path.replace(/:(\w+)/g, (_, k) => (keys.push(k), "([^/]+)")) + "/?$",
  );
  routes.push({ method, pattern, keys, handler });
}

const ok = (json: unknown, status = 200) => ({ status, json });
const fail = (status: number, message: string) => ({ status, json: { error: { status, message } } });

route("GET", "/health", () => ok({ status: "ok" }));

route("GET", "/categories", () => ok(categories));

// GET /articles?category=tech&q=phone&page=1&limit=10&sort=latest|popular
route("GET", "/articles", ({ url }) => {
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q")?.trim().toLowerCase();
  const sort = url.searchParams.get("sort") ?? "latest";
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 10);

  if (!Number.isInteger(page) || page < 1) return fail(400, "page must be an integer >= 1");
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) return fail(400, "limit must be between 1 and 50");
  if (category && !categories.some((c) => c.id === category)) return fail(400, `unknown category "${category}"`);
  if (sort !== "latest" && sort !== "popular") return fail(400, 'sort must be "latest" or "popular"');

  let result = articles;
  if (category) result = result.filter((a) => a.categoryId === category);
  if (q) result = result.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  if (sort === "popular") result = [...result].sort((a, b) => b.likes - a.likes);

  const total = result.length;
  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit).map(({ body: _body, ...summary }) => summary);
  return ok({ data, page, limit, total, hasMore: start + limit < total });
});

route("GET", "/articles/:id", ({ params }) => {
  const article = articles.find((a) => a.id === params.id || a.slug === params.id);
  return article ? ok(article) : fail(404, "article not found");
});

route("POST", "/articles/:id/like", ({ params }) => {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return fail(404, "article not found");
  article.likes += 1;
  return ok({ id: article.id, likes: article.likes });
});

route("DELETE", "/articles/:id/like", ({ params }) => {
  const article = articles.find((a) => a.id === params.id);
  if (!article) return fail(404, "article not found");
  article.likes = Math.max(0, article.likes - 1);
  return ok({ id: article.id, likes: article.likes });
});

route("GET", "/articles/:id/comments", ({ params }) => {
  if (!articles.some((a) => a.id === params.id)) return fail(404, "article not found");
  return ok(comments.filter((c) => c.articleId === params.id));
});

// POST /articles/:id/comments  body: { "author": string, "text": string }
route("POST", "/articles/:id/comments", ({ params, body }) => {
  if (!articles.some((a) => a.id === params.id)) return fail(404, "article not found");
  const { author, text } = (body ?? {}) as Partial<Comment>;
  const errors: Record<string, string> = {};
  if (typeof author !== "string" || author.trim().length < 2) errors.author = "author must be at least 2 characters";
  if (typeof text !== "string" || text.trim().length < 3) errors.text = "text must be at least 3 characters";
  if (typeof text === "string" && text.length > 500) errors.text = "text must be at most 500 characters";
  if (Object.keys(errors).length) return { status: 422, json: { error: { status: 422, message: "validation failed", fields: errors } } };

  const comment: Comment = {
    id: `${params.id}-c${Date.now()}`,
    articleId: params.id,
    author: (author as string).trim(),
    text: (text as string).trim(),
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  return ok(comment, 201);
});

function send(res: ServerResponse, status: number, json: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(json === undefined ? undefined : JSON.stringify(json));
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (!chunks.length) return undefined;
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return send(res, 204, undefined);

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const started = Date.now();

  // Per-request simulation: ?__delay=2000 forces latency, ?__fail=500 forces an error status.
  const forcedDelay = url.searchParams.get("__delay");
  const forcedFail = url.searchParams.get("__fail");
  await sleep(forcedDelay ? Number(forcedDelay) : MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));

  let status: number;
  let json: unknown;
  try {
    if (forcedFail) {
      ({ status, json } = fail(Number(forcedFail), "forced failure (__fail)"));
    } else if (url.pathname !== "/health" && Math.random() < FAIL_RATE) {
      ({ status, json } = fail(500, "random server error (FAIL_RATE)"));
    } else {
      const match = routes
        .map((r) => ({ r, m: r.method === req.method ? url.pathname.match(r.pattern) : null }))
        .find((x) => x.m);
      if (!match) {
        ({ status, json } = fail(404, `no route for ${req.method} ${url.pathname}`));
      } else {
        const params = Object.fromEntries(match.r.keys.map((k, i) => [k, decodeURIComponent(match.m![i + 1])]));
        const body = req.method === "GET" ? undefined : await readBody(req);
        ({ status, json } = match.r.handler({ req, url, params, body }));
      }
    }
  } catch (e) {
    ({ status, json } = e instanceof SyntaxError ? fail(400, "invalid JSON body") : fail(500, "internal error"));
  }

  send(res, status, json);
  console.log(`${req.method} ${url.pathname}${url.search} -> ${status} (${Date.now() - started}ms)`);
});

server.listen(PORT, () => {
  console.log(`News API on http://localhost:${PORT}  (FAIL_RATE=${FAIL_RATE}, delay ${MIN_DELAY}-${MAX_DELAY}ms)`);
});
