# Homepage Maintenance Guide

## Design principle

This repository uses a content-first workflow.

- Chinese content is the primary source.
- Traditional Chinese is generated automatically.
- English content is maintained separately when translation needs human review.

## Add a new post

Create a Markdown file under:

```
posts/zh/
```

Use front matter:

```yaml
---
title: "Title"
date: YYYY-MM-DD
---
```

The future build script will automatically update indexes and validate files.

## Do not edit generated files manually

Generated language files should be treated as build output.

## Planned pipeline

Phase 1: Documentation and structure
Phase 2: Content generation
Phase 3: Validation and CI
Phase 4: New content modules
