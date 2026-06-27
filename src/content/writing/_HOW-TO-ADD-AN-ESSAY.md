# How to add an essay

This file is **not published** (it has no valid frontmatter, so it's ignored —
keep it here as a reference, or delete it).

To publish a new essay, create a file like `src/content/writing/my-essay.md`:

```markdown
---
title: The title of the essay
category: school        # "school" or "outside"
date: 2026-05-01        # YYYY-MM-DD
summary: One sentence shown on the writing index.
draft: false            # set true to hide it while you work
---

Your essay body goes here, in Markdown.

## A subheading

A paragraph. **Bold**, *italic*, and [links](https://example.com) all work.

> A blockquote for a pulled-out line.
```

- The **file name** becomes the URL: `my-essay.md` → `/writing/my-essay`.
- `category` puts it under the **School** or **Outside** filter automatically.
- Essays are sorted **newest first** by `date`.
- Set `draft: true` to keep something unpublished.
