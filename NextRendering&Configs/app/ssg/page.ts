export default async function SSGPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/3", {
    cache: "force-cache",
  });
  const data = await res.json();

  return (
    <div>
      <h1>SSG Page</h1>
      <p>{data.title}</p>
    </div>
  );
}