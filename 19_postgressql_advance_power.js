PostgreSQL
│
├── 1. Relational Database
│      └── Tables / Rows / Columns / Relations
│
│
├── 3. Transactions / ACID
│      ├── BEGIN / COMMIT / ROLLBACK
│      ├── Savepoints
│      └── Isolation Levels
│
├── 4. JSON / JSONB
│      └── Document-like data inside relational tables
│
├── 5. Array Data Types
│      └── Store / query arrays natively
│
├── 6. Full-Text Search
│      ├── tsvector
│      ├── tsquery
│      └── Ranking
│
├── 7. Vector Search
│      └── pgvector
│          ├── Embeddings
│          ├── Similarity Search
│          └── Semantic Search
│
├── 8. Graph-like Queries
│      └── Recursive CTE
│          └── Relationship traversal
│
├── 9. Geospatial
│      └── PostGIS
│          ├── Distance
│          ├── Radius
│          ├── Polygon
│          └── GIS operations
│
├── 10. Time-Series
│       ├── Native PostgreSQL
│       ├── Range / timestamp queries
│       └── TimescaleDB extension
│
├── 11. Key-Value
│       └── hstore
│
├── 12. Custom Data Types
│       ├── ENUM
│       ├── Composite Types
│       ├── Domains
│       └── User-defined types
│
├── 13. Partitioning
│       ├── Range
│       ├── List
│       └── Hash
│
├── 14. Advanced Indexing
│       ├── B-Tree
│       ├── Hash
│       ├── GIN
│       ├── GiST
│       ├── BRIN
│       └── Partial / Expression indexes
│
├── 15. Database-level Automation
│       ├── Triggers
│       ├── Functions
│       └── Procedures
│
├── 16. Materialized Views
│       └── Precomputed query results
│
├── 17. Concurrency / Locking
│       ├── Row locks
│       ├── Advisory locks
│       └── MVCC
│
├── 18. Pub/Sub
│       └── LISTEN / NOTIFY
│
└── 19. Extensions
       ├── pgvector
       ├── PostGIS
       ├── TimescaleDB
       ├── pg_trgm
       ├── uuid-ossp / pgcrypto
       └── many others



// > For many features in postgre we may need to use plugins but these are the mostly we use in development.


------------------------------------ok so see we have to start form transaction -------------------------
// 1. transaction folllows acid and alrready done in next Partial

--------------------------------------JSON / JSONB-------------------------
import { jsonb } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  profile: jsonb("profile")
});

// Insert:
await db.insert(users).values({
  profile: {
    age: 25,
    city: "Durgapur",
    skills: ["Node.js", "PostgreSQL"]
  }
});

// Query JSONB:
const result = await db.execute(sql`
  SELECT *
  FROM users
  WHERE profile->>'city' = 'Durgapur';
`);


-----------------------------------------Array Datatype-------------------------------------
import { text } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  skills: text("skills").array()
});

// Insert:
await db.insert(users).values({
  skills: ["Node.js", "React", "PostgreSQL"]
});

// Query:
const result = await db.execute(sql`
  SELECT *
  FROM users
  WHERE 'React' = ANY(skills);
`);

-----------------------------------------------Full-Text Search--------------------------------------
// PostgreSQL can search text without needing a separate search engine for many applications.

const result = await db.execute(sql`
  SELECT
    title,
    ts_rank(
      to_tsvector('english', content),
      plainto_tsquery('english', 'postgres database')
    ) AS rank
  FROM articles
  WHERE
    to_tsvector('english', content)
    @@ plainto_tsquery('english', 'postgres database')
  ORDER BY rank DESC;
`);

// Think:

// Article
//    ↓
// tsvector
//    ↓
// tsquery
//    ↓
// matching + ranking

---------------------------------------------Vector Search — pgvector----------------------------------

// Enable extension:
// 
// CREATE EXTENSION vector;
// 
// Drizzle column:

import { vector } from "drizzle-orm/pg-core";
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),

  embedding: vector("embedding", {
    dimensions: 3
  })
});

// Insert:

await db.insert(documents).values({
  embedding: [0.12, 0.44, 0.91]
});

// Similarity search:
const result = await db.execute(sql`
  SELECT *
  FROM documents
  ORDER BY embedding <-> '[0.10, 0.40, 0.90]'
  LIMIT 5;
`);

// This is the basic idea behind semantic search.

---------------------------------------Graph-like Queries---------------------------------------
// PostgreSQL isn't a graph database, but recursive CTEs can traverse relationships.

// Example:
//  A
//  ↓
//  B
//  ↓
//  C
//  ↓
//  D
const result = await db.execute(sql`
  WITH RECURSIVE hierarchy AS (

    SELECT id, name, manager_id
    FROM employees
    WHERE id = 1

    UNION ALL

    SELECT e.id, e.name, e.manager_id
    FROM employees e
    JOIN hierarchy h
      ON e.manager_id = h.id
  )
  SELECT *
  FROM hierarchy;
`);

-------------------------------------Geospatial — PostGIS---------------------------------------
// Enable:
// 
// CREATE EXTENSION postgis;
// 
// Example location:

CREATE TABLE places (
  id SERIAL PRIMARY KEY,
  name TEXT,
  location GEOGRAPHY(POINT, 4326)
);

// Insert:

await db.execute(sql`
  INSERT INTO places (name, location)
  VALUES (
    'Office',
    ST_MakePoint(87.3200, 23.5200)::geography
  );
`);

// Find places within 5 km:
const result = await db.execute(sql`
  SELECT *
  FROM places
  WHERE ST_DWithin(
    location,
    ST_MakePoint(87.3200, 23.5200)::geography,
    5000
  );
`);

-----------------------------------------Time-Series-------------------------------
// Normal PostgreSQL can already store timestamp data:
// For heavy time-series workloads, you can use TimescaleDB.
export const sensorData = pgTable("sensor_data", {
  id: serial("id").primaryKey(),
  sensorId: text("sensor_id"),
  temperature: integer("temperature"),
  createdAt: timestamp("created_at")
});

// Insert:

await db.insert(sensorData).values({
  sensorId: "sensor-01",
  temperature: 32,
  createdAt: new Date()
});

// Query a time range:

const result = await db.execute(sql`
  SELECT *
  FROM sensor_data
  WHERE created_at
  BETWEEN '2026-09-01'
  AND '2026-09-05';
`);

--------------------------------Key-Value — hstore----------------------------------
// Enable:
// 
// CREATE EXTENSION hstore;
// 
// Example:

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  attributes hstore
);

// Insert:
await db.execute(sql`
  INSERT INTO products (attributes)
  VALUES ('"color"=>"red", "size"=>"large"');
`);

// Query:
const result = await db.execute(sql`
  SELECT *
  FROM products
  WHERE attributes->'color' = 'red';
`);

-----------------------------------------Custom Data Types-------------------------------
// ENUM
import { pgEnum } from "drizzle-orm/pg-core";
const roleEnum = pgEnum("role", [
  "admin",
  "user"
]);

// Use it:
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  role: roleEnum("role")
});