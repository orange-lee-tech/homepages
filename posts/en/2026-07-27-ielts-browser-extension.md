---
title: "I Built My First Browser Extension with AI in About Two Human Hours"
date: 2026-07-27
---

<p class="post-lede">This is not a “two-hour AI miracle” story. It is a record of capability transfer: after delivering a corporate website, I reused the same AI collaboration and engineering-management habits on a smaller, lighter, more product-like problem.</p>

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-27-ielts-browser-extension/cover.webp" alt="I built my first browser extension with AI in about two human hours" width="1600" height="900" loading="eager" decoding="async">
  <figcaption>Personal capability record · AI product practice · July 2026</figcaption>
</figure>

## Project at a glance

| Measure | Result |
| --- | --- |
| Human effort | About two hours of judgment, trade-offs, and verification |
| Deliverable | My first complete browser extension |
| Platforms | Chrome, Edge, and Firefox |
| IELTS catalog | Cambridge IELTS 21 through 4 |
| Remote dependencies | None: no server, VPN, or remote AI service |

In late July 2026, while preparing for the September 23 IELTS computer-based test, I completed the first version of **IELTS Learning Assistant**.

It is not another testing platform. It is a browser side-panel layer that works on existing websites and turns temporary study traces into personal vocabulary, source sentences, error causes, tags, and review material.

## 01｜The product began with a recurring friction

After using an IELTS practice platform for several days, I noticed a repeated problem in intensive listening: missed words, weak forms, connected speech, and confusing sentences could not be recorded at the moment they occurred.

Other platforms could show which question was wrong, but not build a long-term answer to:

- Why did I make this mistake?
- Where else has this expression appeared?
- How should I review it later?
- Can I preserve the original sentence and source page?

The question changed from “which platform has better notes?” to:

> Can I add my own knowledge-management layer above every learning website?

That shift—from choosing a tool to defining a product—made the extension possible.

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-27-ielts-browser-extension/capture-panel.webp" alt="IELTS Learning Assistant capturing selected text in a browser side panel" width="1440" height="738" loading="lazy" decoding="async">
  <figcaption>The website handles practice; the side panel captures and structures what should be retained.</figcaption>
</figure>

## 02｜What the first version does

The product boundary is intentionally narrow: **local-first, browser side panel, capture and review**.

| Capability | Behavior |
| --- | --- |
| Capture | Save selected English text from ordinary web pages |
| Structured notes | Store vocabulary, context sentence, note, error cause, and tags |
| Cambridge IELTS grouping | Organize records from Book 21 through Book 4 |
| Source linkage | Preserve the original sentence and page URL |
| Editing | Edit, save, copy, or delete a record |
| Backup | Copy all records or export UTF-8 Markdown |
| Multi-browser builds | Build Chrome, Edge, and Firefox from one codebase |
| Data compatibility | Continue reading legacy `ieltsNotes` records |

The extension does not call an AI service or remote server. All learning records remain in browser extension storage. That keeps the first version inexpensive, private, and easy to install.

> Small projects often fail not because they have too few features, but because Version 1 rushes into accounts, cloud sync, AI, subscriptions, and dashboards before the core workflow is stable.

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-27-ielts-browser-extension/learning-loop.webp" alt="IELTS Learning Assistant learning loop" width="1440" height="450" loading="lazy" decoding="async">
  <figcaption>Select on a page → Capture → structured note → Library → export and backup.</figcaption>
</figure>

## 03｜A polished toy, but not an empty prototype

The extension has no cloud database, user system, AI tutor, or large user base. It solves one narrow problem: preserving useful material during listening and reading.

Yet it already has a real software loop:

- it installs in a real browser;
- records survive page closure;
- legacy notes remain readable;
- build outputs can be shared;
- the repository documents maintenance and risk boundaries;
- the product can later grow into search, review algorithms, AI analysis, or sync.

Product quality does not always come from feature count. It often comes from clear boundaries, reliable data, safe upgrades, distributable builds, and maintainability.

## 04｜From a 60-hour website to a two-hour extension

The corporate website and this extension are not comparable by code volume. Their meaningful relationship is capability reuse.

| Dimension | Corporate website | IELTS Learning Assistant |
| --- | --- | --- |
| Problem | Brand, content, consultation, and compliance | Personal listening notes and review |
| Human effort | About 60 hours | About two hours |
| Scale | 31 static pages, server, and filing workflow | Side panel, local storage, and three browser builds |
| Main difficulty | Information architecture, public boundaries, deployment | Product boundary, data model, compatibility |
| Shared method | Decomposition, GitHub, build, verification, handover | Decomposition, GitHub, build, verification, handover |
| Capability meaning | First real corporate AI-assisted delivery | First transfer of that capability into a personal product |

> The 60 hours were not replaced by two hours. The judgment and engineering language developed during those 60 hours are why the two-hour project was possible.

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-27-ielts-browser-extension/capability-transfer.webp" alt="Capability transfer from a 60-hour corporate website to a two-hour browser extension" width="1440" height="486" loading="lazy" decoding="async">
  <figcaption>The first project built the capability; the second project tested whether it could transfer.</figcaption>
</figure>

## 05｜AI collaboration became project execution

Before starting implementation, I prepared a handover containing the problem, constraints, product blueprint, technical direction, and delivery stages. That administrative-looking step prevented a long engineering conversation from losing its boundaries.

The actual workflow was:

> Define the goal → inspect the current state → choose a template → constrain changes → build → load in browser → report issues → fix → commit → document handover

The project used WXT, React, and TypeScript. “Starting from zero” did not mean refusing frameworks or templates. It meant that I had never completed this type of product before, and this was the first time I carried the whole chain from problem to delivery.

## 06｜Engineering management still mattered in two hours

The boundaries were explicit:

1. Version 1 solves capture, notes, grouping, review, and export—not an AI tutor.
2. Data stays local and has a Markdown exit.
3. Legacy `ieltsNotes` remain compatible.
4. One codebase targets Chrome, Edge, and Firefox.
5. Main, commits, and diffs remain the source of truth.
6. TypeScript checks, three builds, browser loading, and real operation define completion.

The repository also documented commands not to use casually: `git push --force`, `git reset --hard`, `git clean -fd`, and `npm audit fix --force`.

> AI speed becomes progress only when a human establishes structure, dependencies, and acceptance criteria.

## 07｜What improved between the first website and the first extension

The two works look unrelated, but the capability chain is continuous:

- from expressing requests to defining a problem;
- from generating code to organizing delivery;
- from solving a task to abstracting a product;
- from one project to reusable methods;
- from copying templates to redesigning around a real need;
- from “a finished work” to “a maintainable digital asset.”

## 08｜A first look at commercialization

The current local-first version is suitable as a free core product. The more plausible paid value would live in layers that are genuinely expensive to provide:

| Layer | Potential value | Current position |
| --- | --- | --- |
| Free core | Capture, notes, tags, Library, Markdown export | Keep it simple, private, and distributable |
| Professional | AI listening analysis, review scheduling, sync, Anki export | Explore later without damaging the local experience |
| Service layer | Teacher dashboard, class materials, team use | Requires real users and long-term validation |

Commercial potential is not a price tag on a toy. It depends on whether the product repeatedly solves a real problem, can be distributed, maintained, and improved through user feedback.

## 09｜The extension is small, but the transfer is real

This project does not solve all IELTS learning problems, nor does it make me a professional extension engineer. It does show that I can notice a recurring friction, abstract it into a product boundary, and use AI, templates, GitHub, and engineering habits to build something installable and maintainable.

> AI did not build a browser extension for me in two hours. I used judgment trained by the previous project to organize AI into a smaller, faster, more product-like delivery.

**Project facts**

- Name: IELTS Learning Assistant
- Version: v0.1.0
- Repository: `orange-lee-tech/ielts-learning-assistant`
- Stack: WXT, React, TypeScript, local storage
- Platforms: Chrome, Edge, Firefox
- Remote services: none
- Human effort: about two hours
