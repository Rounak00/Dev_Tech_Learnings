import Link from "next/link";

export default function Home() {
  return (
    <html>
      <body>
    <div style={{ padding: 20 }}>
      <h1>Next.js Rendering Demo</h1>

      <ul>
        <li><Link href="/csr">CSR Page</Link></li>
        <li><Link href="/ssr">SSR Page</Link></li>
        <li><Link href="/ssg">SSG Page</Link></li>
        <li><Link href="/isr">ISR Page</Link></li>
      </ul>
    </div>
    </body>
    </html>
  );
}