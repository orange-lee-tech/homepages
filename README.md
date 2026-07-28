# Li Yucheng Homepage

Personal academic and engineering portfolio.

This repository contains my personal website, including research experience, engineering projects, publications, technical notes and personal updates.

## Architecture

- Static website deployed with GitHub Pages
- Markdown based content management
- YAML configuration
- Automated multilingual content pipeline

## Content workflow

Chinese is the primary content source.

```text
posts/zh
   |
   +--> Traditional Chinese generation
   |
   +--> Website index generation
```

## Update content

Install dependencies:

```bash
npm install
```

Create a new post:

```bash
npm run new-post -- "My New Project"
```

Generate managed content:

```bash
npm run build
```

Validate content:

```bash
npm run check
```

## Directory

```text
contents/       Homepage sections
posts/          Blog posts
static/         Website assets
scripts/        Maintenance tools
content/        Content pipeline configuration
```

## Maintenance principle

Do not manually edit generated language files. Modify the source content and regenerate outputs.

See `MAINTAIN.md` for detailed maintenance rules.
