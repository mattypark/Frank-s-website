import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// The writing portfolio. To add an essay, drop a new .md file into
// src/content/writing/ with the frontmatter fields below — that's it.
const writing = defineCollection({
  loader: glob({ pattern: ["**/*.md", "!_*.md"], base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    // "school" = essays written for class; "outside" = writing published
    // elsewhere (e.g. Axiom Pathways); "college" = college application essays.
    category: z.enum(["school", "outside", "college"]),
    date: z.coerce.date(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
