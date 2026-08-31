---
title: "I Spent About 60 Human Hours Building a Corporate Website with AI"
date: 2026-07-24
---

<p class="post-lede">This is not a “three-minute AI website” tutorial. It is a capability record: how I gradually turned AI from a chat tool into a productive collaborator in a real corporate delivery.</p>

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-24-ai-enterprise-website/cover.webp" alt="I spent about 60 human hours building a corporate website with AI" width="1600" height="920" loading="eager" decoding="async">
  <figcaption>Personal capability record · enterprise-grade AI project practice · July 2026</figcaption>
</figure>

## Project at a glance

| Measure | Result |
| --- | --- |
| Human effort | About 60 hours of judgment, coordination, execution, and acceptance testing |
| Site scale | 31 static pages |
| Service structure | Six core service directions |
| Content governance | 15 mentor profiles and 36 case materials structured and reviewed |
| Delivery | Custom domain, HTTPS, ICP filing, public-security filing, cloud server, and Nginx |

In July 2026, Jiuchen Education Website V1.0 went live. It includes service pages, cases, mentor profiles, FAQs, consultation channels, and basic search-engine configuration.

The finished product looks like a stable corporate portal. For me, however, its deeper meaning is this:

> A non-computer-science student with no prior end-to-end corporate website experience can use AI, engineering management, and modern tooling to deliver a real, maintainable, and transferable digital system.

The “60 hours” refers to my own time spent on requirements, content structure, decisions, correction, risk control, deployment, and verification—not the amount of time AI spent generating text or code.

## 01｜What we delivered

The project grew far beyond a single promotional homepage:

- brand and homepage presentation;
- six service directions and detail pages;
- case catalogs and category pages;
- mentor profiles;
- FAQs and compliance statements;
- consultation links for forms, phone, WeChat, video channels, and Douyin;
- sitemap, crawler rules, and verification files;
- ICP and public-security filing information.

The site uses Next.js, React, TypeScript, and Tailwind CSS, is exported statically, and is served by Nginx. It is not a large web platform, but it contains the essential elements of a formal corporate portal: brand expression, content delivery, trust, consultation conversion, discoverability, compliance, and maintainability.

> “Code complete” was never the acceptance criterion. Completion meant that people could visit, navigate, understand, submit inquiries, verify filings, and maintain the source code.

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-24-ai-enterprise-website/homepage.webp" alt="Finished homepage of the Jiuchen Education website" width="1440" height="666" loading="lazy" decoding="async">
  <figcaption>The homepage connects brand expression, service discovery, and consultation conversion.</figcaption>
</figure>

## 02｜The project did not begin with code

The initial input was a collection of scattered business materials: Word documents, case records, mentor profiles, contact channels, QR codes, and company information.

Before coding, we had to answer harder questions:

- What could be public, and what needed anonymization?
- How should services be categorized?
- Where did overseas PhD applications belong?
- Should cases emphasize the process or the outcome?
- How could mentor pages remain credible, professional, and compliant?

These were information-architecture and content-governance questions, not merely programming tasks.

Over time, cases became Markdown data sources; navigation, filing data, mentors, services, and FAQs moved into dedicated data files; page components focused on presentation. The architecture became increasingly clear: **data owns content, components own structure**.

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-24-ai-enterprise-website/services.webp" alt="Six service directions on the Jiuchen Education website" width="1440" height="666" loading="lazy" decoding="async">
  <figcaption>Structuring the business information was more important than generating more pages.</figcaption>
</figure>

## 03｜A non-linear delivery timeline

| Stage | Main work |
| --- | --- |
| Early stage | Organize business materials, establish page structure, and convert documents into usable data |
| Early July | Improve visual hierarchy, mobile navigation, paths, and public-facing copy |
| July 24 | Add public-security filing, build on the cloud server, repair Nginx, and complete acceptance testing |

Early AI-assisted development involved frequent correction: forgotten rules, broad changes that damaged unrelated pages, invented paths, internal notes leaking into public pages, and incorrect assumptions about deployment.

Later, GitHub connectivity made the repository itself the source of truth. I then completed the server-side steps: pull, dependency installation, static build, permissions, and Nginx reload.

The build succeeded, but the website returned 403. The final loop—commit log, configuration analysis, index rule, redeploy, verification—brought the homepage, FAQ, mentor, service, and case pages to `200 OK`.

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-24-ai-enterprise-website/cases.webp" alt="Case catalog of the Jiuchen Education website" width="1440" height="666" loading="lazy" decoding="async">
  <figcaption>Case presentation also required categorization, privacy handling, and compliant public language.</figcaption>
</figure>

## 04｜This was not a one-prompt website

The real workflow was:

> Define the goal → inspect the current state → split the work → constrain the change → execute → return logs → correct errors → verify → continue

I acted as product owner, project manager, content editor, tester, publisher, risk owner, and final acceptor. AI contributed analysis, copy restructuring, data conversion, front-end work, styling, command generation, troubleshooting, documentation, and visual assets.

AI behaved less like an autonomous replacement and more like a very fast technical team that still required management and accountability.

## 05｜Tool connectivity changed the collaboration

At first, everything depended on copying, pasting, and uploading partial files. Later, GitHub access changed the process from “describe what the repository probably looks like” to “work from the actual repository state.”

Document parsing, document generation, image generation, project context, and GitHub connectivity reduced low-value transport work. They did not remove human responsibility; they moved human attention toward judgment, trade-offs, and verification.

## 06｜Engineering management was the real core

The key practices were simple but decisive:

1. define V1 scope;
2. separate data, components, pages, and assets;
3. keep each change narrow;
4. accept only with build results, status codes, mobile checks, and live URLs;
5. manage privacy, claims, sensitive files, and third-party dependencies;
6. preserve traceability through branches, commits, pull requests, and build artifacts.

> The scarce capability in the AI era is not only coding. It is defining problems, structuring systems, managing dependencies, verifying outcomes, and taking responsibility.

## 07｜Why fast generation can backfire

A button can depend on routing, environment variables, `basePath`, build mode, Nginx, mobile navigation, search links, and the production domain. A single case paragraph can depend on Markdown fields, image paths, anonymization, layout, sitemap, and advertising compliance.

Without systems thinking, AI accelerates local edits while multiplying global inconsistency.

## 08｜AI improved, but verification remained essential

Model reliability improved during the project, especially after repository access. Yet verbal claims of completion were never enough. One documentation task demonstrated this clearly: AI claimed several files had been added, while the Git diff showed only one actual change.

> Completion must be proven by the repository, the diff, the build, and the live result—not by the assistant saying “done.”

## 09｜Why 60 human hours matters

Traditional delivery might involve product planning, UI design, front-end engineering, content editing, testing, operations, SEO configuration, and handover.

AI absorbed a large amount of execution. Human effort remained concentrated in goals, business understanding, trade-offs, public-content review, real materials, observation, server commands, diagnosis, and final acceptance.

Those 60 hours were not a replacement metric. They were the management cost of organizing a much larger amount of digital production.

## 10｜Absorb, redesign, and respect the learning curve

Using modern tools does not mean copying architectures, pages, deployment commands, or security settings without understanding them.

A productive learning loop is: encounter new knowledge, understand it, decompose it, apply it to a real problem, fail, correct, and turn it into one’s own capability.

> Absorb rather than copy; redesign rather than imitate; respect capability growth rather than expecting a single leap.

## 11｜The website was only the visible launch

What truly went live was a new ability:

- turning vague ideas into projects;
- turning business material into structure;
- coordinating AI over long tasks;
- identifying and containing AI errors;
- managing code, servers, content, and risk;
- bringing a project into real-world operation.

<figure class="post-figure post-figure--portrait">
  <img src="static/assets/posts/2026-07-24-ai-enterprise-website/milestone-poster.webp" alt="Jiuchen Education Website V1.0 milestone poster" width="637" height="900" loading="lazy" decoding="async">
  <figcaption>Jiuchen Education Website V1.0 milestone poster.</figcaption>
</figure>

<figure class="post-figure">
  <img src="static/assets/posts/2026-07-24-ai-enterprise-website/contact-and-compliance.webp" alt="Consultation channels and compliance information" width="1440" height="666" loading="lazy" decoding="async">
  <figcaption>Delivery included consultation channels, public filing information, and a maintainable operating path.</figcaption>
</figure>

> AI did not complete the project for me. I began learning how to manage AI to complete a project.
