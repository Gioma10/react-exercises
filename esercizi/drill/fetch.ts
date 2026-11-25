const BASEURL = "http://localhost:4000";

// 01
type Category = {
  id: string;
  name: string;
};

const fetchCategories = async () => {
  const response = await fetch(`${BASEURL}/categories`);

  if (!response.ok) {
    throw new Error(`Richiesta fallita ${response.status}`);
  }
  const categories: Category[] = await response.json();

  for (const category of categories) {
    console.log(category.name);
  }
};

// fetchCategories();

// 02
const fetchFirstArticle = async () => {
  const res = await fetch(`${BASEURL}/articles/1`);

  if (!res.ok) {
    throw new Error(`Rchiesta fallita ${res.status} `);
  }

  const article = await res.json();

  console.log(article.title, `(${article.author.name})`);
  //  console.log(article)
};

// fetchFirstArticle()

// 03
const fetchBiggestArticle = async () => {
  const res = await fetch(`${BASEURL}/articles/9999`);

  if (!res.ok) {
    const body: { error: ApiError } = await res.json();

    console.log(body.error.message, body.error.status);
    return;
  }

  const article = await res.json();

  console.log(article);
};

// fetchBiggestArticle();

// 04
class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export const getArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`${BASEURL}/articles/${id}`);

  if (!res.ok) {
    const body = await res.json();

    throw new HttpError(res.status, body.error.message);
  }

  const article: Article = await res.json();

  return article;
};

try {
  //  await getArticle("10");
  // await getArticle("9999");
} catch (error) {
  if (error instanceof HttpError) {
    console.log("Errore Http", error.status);
  } else {
    console.log("Server non raggiungibile");
  }
}

// 05
const fetchPopularArticles = async () => {
  const res = await fetch(
    `${BASEURL}/articles?category=tech&sort=popular&limit=5`,
  );
  if (!res.ok) {
    throw new Error(`Richiesta fallita ${res.status}`);
  }
  const articles = await res.json();

  for (const article of articles.data) {
    console.log(`${article.likes} - ${article.title}`);
  }
};

// fetchPopularArticles()

type Author = {
  id: string;
  name: string;
  avatarUrl: string;
};

type Article = {
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

type ArticlePreview = Omit<Article, "body">;

type ArticlesResponse = {
  data: ArticlePreview[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

// 06
const fetchArticles = async () => {
  const res = await fetch(`${BASEURL}/articles`);

  if (!res.ok) {
    throw new Error(`Richiesta fallita ${res.status}`);
  }

  const articles: ArticlesResponse = await res.json();

  for (const article of articles.data) {
    console.log(article);
  }
};

// fetchArticles();

type Comment = {
  id: string;
  articleId: string;
  author: string;
  text: string;
  createdAt: string;
};

// 07
const fetchAddComment = async (author: string, id: string, comment: string) => {
  const res = await fetch(`${BASEURL}/articles/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text: comment }),
  });

  if (!res.ok) {
    throw new Error(`Richiesta fallita ${res.status}`);
  }

  const commentedArticle: Comment = await res.json();

  console.log(commentedArticle);
};

// fetchAddComment("Gioma", "1", "Bell'articolo");

type ApiError = {
  status: number;
  message: string;
  fields?: Record<string, string>;
};

// 08
const fetchInvalidComment = async (
  author: string,
  id: string,
  comment: string,
) => {
  const res = await fetch(`${BASEURL}/articles/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text: comment }),
  });

  if (!res.ok) {
    const body: { error: ApiError } = await res.json();
    const error = body.error;
    console.log(error.status, error.fields);
    return;
  }

  const commentedArticle: Comment = await res.json();

  console.log(commentedArticle);
};

// fetchInvalidComment("Gioma", "1", "");

// 10
const fetchArticlesV2 = async (id: string) => {
  const res = await fetch(`${BASEURL}/articles/${id}`);

  if (!res.ok) {
    const body= await res.json();
    throw new HttpError(res.status, body.error.message);
  }
  const article: Promise<Article> = res.json();

  return article;
};

const fetchFirstThreeArticles = async () => {
  try {
    const articles = await Promise.all([
      fetchArticlesV2(`1`),
      fetchArticlesV2(`2`),
      fetchArticlesV2(`3`),
    ]);
    for (const article of articles) {
      console.log(article.title);
    }
  } catch (error) {
    if (error instanceof HttpError) {
      console.log("Errore Http", error.status);
    } else {
      console.log("Server non raggiungibile");
    }
  }
};

fetchFirstThreeArticles();
