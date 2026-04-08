export const dynamic = "force-dynamic";

export default async function SSRPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/2", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div>
      <h1>SSR Page</h1>
      <p>{data.title}</p>
    </div>
  );
}