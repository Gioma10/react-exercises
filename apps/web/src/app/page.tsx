import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { baseUrl } from "@/lib/utils";

export default async function Home() {
  const res = await fetch(`${baseUrl}/articles`);
  if(!res.ok){
    throw new Error(`Richiesta fallita ${res.status}`)
  }
  const articles = await res.json();
  console.log(articles)

  return (
    <main className="mx-auto max-w-7xl p-8 w-full gap-10 flex flex-col">
      <h1 className="text-3xl font-semibold">News</h1>

      {/* List */}
      <div className="grid grid-cols-3 flex-1 gap-5">
        {articles.map((article) => {
          return (
            <Card>
              <CardHeader className="text-2xl">Article</CardHeader>
              <CardContent className="flex flex-col gap-5 items-end">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Ipsum, atque, pariatur illum enim est dolore laudantium
                  ducimus iste dolor distinctio tempore sunt inventore et ipsam.
                  Quis facilis vitae distinctio iste?
                </p>
                <Button variant="outline" className="w-fit">
                  vedi
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
