"use client";

import { useEffect, useState } from "react";

export default function CSRPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>CSR Page</h1>
      {!data ? <p>Loading...</p> : <p>{data.title}</p>}
    </div>
  );
}