import { defineConfig } from "drizzle-kit";

// deno run --env -A --node-modules-dir npm:drizzle-kit generate
// deno run --env -A --node-modules-dir npm:drizzle-kit push 
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
