/*
* File-based routing: URL directly maps to a page/file.
* Cosmetic routing: URL can look a certain way, but internally Next.js renders a different route/component.
*/

async rewrites() {
  return [
    {
      source: "/admin",
      destination: "/dashboard",
    },
  ];
}