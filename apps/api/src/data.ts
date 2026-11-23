export type Category = {
  id: string;
  name: string;
};

export type Author = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  categoryId: string;
  author: Author;
  imageUrl: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  likes: number;
};

export type Comment = {
  id: string;
  articleId: string;
  author: string;
  text: string;
  createdAt: string;
};

export const categories: Category[] = [
  { id: "world", name: "World" },
  { id: "tech", name: "Tech" },
  { id: "sport", name: "Sport" },
  { id: "economy", name: "Economy" },
  { id: "culture", name: "Arts & Culture" },
  { id: "science", name: "Science" },
];

const authors: Author[] = [
  "Giulia Rossi",
  "Marco Bianchi",
  "Sara Conti",
  "Luca Ferrari",
  "Elena Greco",
  "Davide Romano",
].map((name, i) => ({
  id: `a${i + 1}`,
  name,
  avatarUrl: `https://i.pravatar.cc/120?img=${i + 10}`,
}));

const subjects: Record<string, string[]> = {
  world: ["Summit leaders", "Climate negotiators", "Coastal cities", "Border towns", "Island nations"],
  tech: ["Open-source maintainers", "Chip makers", "A new phone", "Battery startups", "Mobile developers"],
  sport: ["The national team", "A rookie sprinter", "Cycling fans", "The league leaders", "Marathon runners"],
  economy: ["Small businesses", "Central banks", "Housing markets", "Energy prices", "Freelancers"],
  culture: ["An indie film", "Street artists", "A forgotten novel", "Local museums", "Jazz festivals"],
  science: ["Ocean researchers", "A Mars probe", "Gene therapists", "Bird watchers", "Physicists"],
};

const verbs = [
  "rethink",
  "surprise everyone with",
  "push back against",
  "quietly reshape",
  "bet big on",
  "struggle with",
  "celebrate",
];

const objects = [
  "the rules of the game",
  "a decade-old promise",
  "an unexpected comeback",
  "the next five years",
  "a record-breaking season",
  "a risky experiment",
  "the way we commute",
];

const paragraphs = [
  "The story started months ago, far from the headlines, when a small group decided that the usual approach was no longer enough.",
  "People close to the project describe long nights, many false starts and one decision that changed everything.",
  "Critics argue that the results are still too early to judge, and that the hardest part has not begun yet.",
  "Supporters point to the numbers: growth is steady, costs are falling and the community keeps getting bigger.",
  "What happens next depends on choices that will be made in the coming weeks, and nobody wants to predict them.",
  "For now, the mood is cautiously optimistic, with a clear sense that something important is moving.",
];

const tagPool = ["analysis", "breaking", "interview", "opinion", "explainer", "data", "live", "longread"];

// Deterministic pseudo-random generator so data is the same on every restart.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function pick<T>(arr: T[], r: () => number): T {
  return arr[Math.floor(r() * arr.length)];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateArticles(count: number): Article[] {
  const r = rng(42);
  const now = Date.parse("2026-11-23T08:00:00Z");
  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length];
    const title = `${pick(subjects[category.id], r)} ${pick(verbs, r)} ${pick(objects, r)}`;
    const id = String(i + 1);
    const body = Array.from({ length: 4 + Math.floor(r() * 4) }, () => pick(paragraphs, r)).join("\n\n");
    const tags = [...new Set([pick(tagPool, r), pick(tagPool, r)])];
    return {
      id,
      slug: `${slugify(title)}-${id}`,
      title,
      excerpt: pick(paragraphs, r),
      body,
      categoryId: category.id,
      author: pick(authors, r),
      imageUrl: `https://picsum.photos/seed/news${id}/800/450`,
      publishedAt: new Date(now - i * 1000 * 60 * 47).toISOString(),
      readingMinutes: 2 + Math.floor(r() * 9),
      tags,
      likes: Math.floor(r() * 500),
    };
  });
}

export const articles: Article[] = generateArticles(120);

export const comments: Comment[] = articles.slice(0, 20).flatMap((a, i) =>
  Array.from({ length: (i % 4) + 1 }, (_, j) => ({
    id: `${a.id}-c${j + 1}`,
    articleId: a.id,
    author: authors[(i + j) % authors.length].name,
    text: paragraphs[(i + j) % paragraphs.length],
    createdAt: new Date(Date.parse(a.publishedAt) + (j + 1) * 1000 * 60 * 15).toISOString(),
  })),
);
