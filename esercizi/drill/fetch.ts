const BASEURL = "http://localhost:4000";

const fetchCategories = async () => {
  const response = await fetch(`${BASEURL}/categories`);

  if (!response.ok) {
    throw new Error(`Richiesta fallita ${response.status}`);
  }
  const categories = await response.json();

  for (const category of categories) {
    console.log(category.name);
  }
};

// fetchCategories();

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

const fetchBiggestArticle = async () => {
  const res = await fetch(`${BASEURL}/articles/9999`);

  if (!res.ok) {
    const body = await res.json();

    console.log(body.error.message, body.error.status);
    return;
  }

  const article = await res.json();

  console.log(article);
};

// fetchBiggestArticle();

export const getArticle = async (id: string) => {
  const res = await fetch(`${BASEURL}/articles/${id}`);

  if (!res.ok) {
    const body = await res.json();

    throw new Error(body.error.message)
  }

  const article = await res.json();

  return article;
};

try {
    //  await getArticle("10");
//    await getArticle("9999");
} catch (error) {
  console.log(error);
}





