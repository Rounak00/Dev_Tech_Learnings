export default async function ISRPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/4", {
    next: { revalidate: 10 },
  });

  const data = await res.json();

  return (
    <div>
      <h1>ISR Page</h1>
      <p>{data.title}</p>
      <p>Revalidates every 10 seconds</p>
    </div>
  );
}