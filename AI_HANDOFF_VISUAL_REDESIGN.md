# AI Handoff — Personal Homepage Visual Redesign

> Target repository: `orange-lee-tech/homepages`
>
> Target branch: `main`
>
> Audited content baseline before this handoff: `add3748473bd81891f454f93c80d9578ff7dbce9`
>
> This document is written for the next AI coding conversation. Read it completely before changing code.

---

## 1. Mission

Redesign the personal homepage visual layer while preserving the existing content-first infrastructure.

The new homepage is not a traditional academic CV page, not a generic Bento portfolio, and not a full game HUD. Its finalized identity is:

> **Graphite Archive / 石墨数字档案馆**
>
> A restrained light-science-fiction personal asset console combining current capability status, capability-formation history, and long-term content portals.

The homepage must become a concise three-screen experience:

1. **Current profile and five-dimensional capability radar**
2. **Capability-formation timeline**
3. **Four content portals**

The homepage should answer, in order:

1. Who is this person now?
2. What is the current capability configuration?
3. How were those capabilities formed?
4. Where can the visitor explore the complete personal archive?

This is a visual and information-architecture redesign. Do not rewrite factual content unless required to map it into the new structure.

---

## 2. User-approved implementation workflow

- The user has approved implementation on `main`; no new feature branch is required.
- Use a small number of logical commits, not dozens of tiny commits.
- Never force-push or rewrite `main` history.
- Do not use the commit message `chore: finish approved content refactor`; the current workflow contains one-off migration logic tied to that exact message.
- Before every write, re-fetch the latest target file and use its current SHA.
- Preserve recent factual content work, especially:
  - AAAI 2027 BRFC submission record
  - author order and fourth-author position
  - Yuan Ze University exchange record
  - awards/certificates reorganization
  - separation of Projects from Research

Recommended commit groups:

1. `chore: restore homepage validation baseline`
2. `content: add homepage and capability data models`
3. `feat: build three-screen archive homepage`
4. `feat: add unified capability archive page`
5. `style: unify asset and post page visual shell`
6. `test: complete responsive and accessibility hardening`

Fewer commits are acceptable if each remains coherent and validated.

---

## 3. Current repository architecture

The repository is a static GitHub Pages site served from the repository root. `.nojekyll` is present. There is no custom `CNAME` file.

### 3.1 Main pages

- `index.html` — legacy long-form homepage
- `projects.html` — data-driven project catalog
- `research.html` — data-driven research/publication catalog
- `knowledge.html` — data-driven knowledge catalog
- `posts.html` — post list
- `post.html` — post detail

### 3.2 Content sources

Homepage Markdown sections:

- `contents/zh/home.md`
- `contents/zh/about.md`
- `contents/zh/interests.md`
- `contents/zh/publications.md`
- `contents/zh/experience.md`
- `contents/zh/practice.md`
- `contents/zh/awards.md`

Language configuration:

- `contents/config.zh.yml`
- `contents/config.chinese-traditional.yml`
- `contents/config.en.yml`

Structured catalogs:

- `content/projects.yml`
- `content/research.yml`
- `content/knowledge.yml`

Generated catalogs:

- `content/generated/projects.json`
- `content/generated/research.json`
- `content/generated/knowledge.json`
- `content/generated/content-index.json`

Post sources:

- `posts/zh/`
- `posts/chinese-traditional/`
- `posts/en/`

### 3.3 Build and validation commands

From `package.json`:

```bash
npm install
npm run build
npm run build:check
npm run check
npm run ci
```

Important rules:

- Simplified Chinese is the main source language.
- Traditional Chinese homepage Markdown and posts are generated from Simplified Chinese.
- English is maintained separately where human review is required.
- Do not manually edit generated outputs as if they were source files.
- After source changes, regenerate and commit expected generated files.

### 3.4 Existing renderers

- `static/js/scripts.js` loads legacy homepage YAML/Markdown and image carousels.
- `static/js/featured-projects.js` loads featured projects on the old homepage.
- `static/js/projects.js` renders `projects.json` and filters categories.
- `static/js/asset-page.js` renders research and knowledge catalogs.

The current renderers prove the repository can support the redesign using static HTML, YAML/JSON, and focused vanilla JavaScript. A framework migration is not required for the first implementation.

---

## 4. Critical current-state warnings

### 4.1 CI workflow is not a normal validation workflow

`.github/workflows/content-check.yml` currently contains a one-off workflow named `Finish Approved Content Refactor`, with migration logic and a conditional exact commit message. Do not assume routine pushes are currently validated.

Before major redesign work, restore a conventional validation workflow that runs on pushes and pull requests without rewriting history. The normal job should approximately:

1. Checkout
2. Set up Node 22
3. Install dependencies without committing `node_modules` or accidental lockfile artifacts
4. Run `npm run build`
5. Run `npm run build:check`
6. Run `npm run check`
7. Run `git diff --check`
8. Ensure generated outputs are committed via `git diff --exit-code`

Do not preserve one-off force-push migration behavior in the normal workflow.

### 4.2 Legacy homepage is structurally incompatible with the approved design

`index.html` still contains:

- fixed Bootstrap navigation
- large image cover
- floating portrait
- many vertically stacked résumé sections
- featured projects block
- three separate image carousels
- traditional footer

The new homepage requires real HTML restructuring, not only a color change.

### 4.3 Legacy style coupling

`index.html` loads both `static/css/styles.css` and `static/css/main.css`, while `main.css` itself imports `styles.css`. This duplicates the legacy stylesheet.

`styles.css` is a large Bootstrap-derived legacy layer. Do not build the new homepage by piling more overrides onto it.

Recommended approach:

- keep legacy CSS available temporarily for old pages
- create a clean new visual system for the redesigned pages
- remove legacy homepage dependencies only after the replacement is working

### 4.4 Duplicate MathJax loading

The current homepage loads both `tex-svg.js` and `tex-mml-chtml.js`. The new three-screen homepage has no required mathematical formulas. Remove MathJax from the homepage unless a real content requirement appears. Reading pages may load one output mode only when needed.

### 4.5 Inconsistent public identity data

Known inconsistencies that should be corrected during redesign:

- Current authoritative OpenReview profile in structured data: `https://openreview.net/profile?id=%7EYucheng_Li13`
- Legacy homepage and asset page footers still use the older `~Li_Yucheng1` URL.
- `contents/config.zh.yml` uses the Chinese name `李雨橙`.
- `static/js/asset-page.js` and asset HTML defaults use `李宇成`, which appears inconsistent.

Use **Li Yucheng** as the primary Latin display name. Normalize Chinese chrome to **李雨橙** unless the user later explicitly changes it.

### 4.6 Post pages are visually and structurally legacy

`posts.html` and `post.html` use inline styles and inline scripts and inherit the old `main.css`. A polished homepage linking into these pages will otherwise create a severe visual break.

The first priority is the homepage, but the redesign is not complete until shared page chrome and reading surfaces are visually compatible.

---

## 5. Architecture decision

### 5.1 First implementation: retain the current static architecture

Do **not** begin by migrating to Astro, React, Vue, or another framework.

Reasons:

- the site is small and static
- GitHub Pages deployment is simple
- current YAML/Markdown pipelines already work
- required interactions are limited to a radar, a timeline, filters, dialogs, and micro-animations
- vanilla JavaScript is sufficient
- framework migration would combine content migration risk with visual redesign risk

Astro may be considered later only if repeated page shells and component maintenance genuinely become difficult.

### 5.2 Recommended new files

Suggested structure:

```text
content/
  homepage.yml
  capabilities.yml
  projects.yml
  research.yml
  knowledge.yml
  generated/
    homepage.json
    capabilities.json

scripts/
  build-homepage.mjs       # dedicated schema and localization generation
  build-assets.mjs         # extend to capabilities if practical

static/css/
  archive-tokens.css
  archive-base.css
  archive-components.css
  archive-home.css
  archive-pages.css
  archive-reading.css

static/js/
  language.js              # one shared language resolver
  homepage.js
  capability-page.js
  archive-chrome.js

capabilities.html
```

Exact filenames may differ, but preserve separation between design tokens, shared components, homepage layout, and reading/catalog pages.

### 5.3 Recommended homepage source model

Create one source of truth such as `content/homepage.yml` containing:

- profile identity
- yearly status snapshots
- identity ports
- five-level scale
- yearly capability snapshots
- timeline events
- four portals
- screen chrome labels

The build script should:

- require Simplified Chinese and English user-facing fields
- generate Traditional Chinese from Simplified Chinese with OpenCC
- validate unique IDs
- validate years and dates
- validate capability references
- validate portal targets
- validate URL protocols
- output `content/generated/homepage.json`

Do not hard-code the yearly capabilities directly into JavaScript.

### 5.4 Unified capability page model

Create `content/capabilities.yml` as a structured catalog containing all capabilities that have appeared in yearly radar snapshots.

Required anchor IDs:

```text
energy-power
ansys
ai-agent
full-stack
reading-notes
latex
solidworks
collaboration
wps
academic-graphic-design
```

The user approved a **single capability page with different anchors**, not ten separate pages.

Example target:

```text
capabilities.html?lang=zh#full-stack
```

Each capability section should be able to contain:

- localized title
- concise definition
- level by year
- evidence standard
- linked projects
- linked timeline events
- linked notes or research records
- tools/methods
- update date

Do not invent evidence. Use existing repository facts and leave optional evidence arrays empty until supported.

---

## 6. Final homepage information architecture

The homepage has three main screens. “Screen” means a desktop visual chapter, not rigid fixed-height clipping.

Use:

```css
min-height: 100svh;
```

Do not force all content into an exact `100vh` box.

Scrolling:

- natural document scrolling
- subtle optional scroll snap
- never hijack the mouse wheel to force full-screen transitions
- preserve browser accessibility and user control

No traditional top navigation bar.

Persistent or semi-persistent lightweight chrome is allowed:

```text
01 PROFILE
02 TIMELINE
03 ARCHIVE

简 / 繁 / EN
appearance toggle (optional)
primary external identity shortcut (optional)
```

The right-side section indicator must make it obvious that more content exists below.

---

## 7. Screen 01 — Current profile console

### 7.1 Purpose

This screen communicates **current state and overall capability configuration**.

It is not primarily a growth-comparison screen. Historical growth is Screen 02.

### 7.2 Desktop and tablet layout

- two large cards
- approximately 50% / 50%
- desktop content max width: about `1280px`
- main card gap: `24px`
- tablet keeps the same left/right structure as long as labels remain readable

```text
┌──────────────────────────────┬──────────────────────────────┐
│ Identity / current status    │ Five-dimensional radar       │
│ concise introduction         │ yearly status snapshot       │
│ identity ports               │ year slider                  │
└──────────────────────────────┴──────────────────────────────┘
```

### 7.3 Mobile layout

- identity card above
- radar card below
- allow the first chapter to exceed one viewport
- no horizontal overflow
- preserve a large readable radar

### 7.4 Left card content

The left card is an identity dossier, not a long biography.

Include:

- `Li Yucheng`
- concise role line, such as `Engineer · Researcher · Builder`
- a short personal thesis
- current status fields
- current focus
- build/snapshot date
- active status
- identity ports

Current factual source material can be adapted from `contents/zh/home.md` and `contents/zh/about.md`.

Suggested current thesis direction:

> 连接能源工程、工程仿真、AI 系统与数字资产建设，把学习过程转化为可复用、可验证、可长期维护的成果。

Do not make the introduction academically inflated. Keep it concise and evidence-oriented.

### 7.5 Identity ports

Approved ports:

1. GitHub
2. OpenReview
3. 微信公众号
4. 脉脉
5. Email

Known values:

- GitHub: `https://github.com/orange-lee-tech`
- OpenReview: `https://openreview.net/profile?id=%7EYucheng_Li13`
- Email: `1010969261@qq.com`

Do not invent the WeChat QR asset, WeChat account name, or Maimai URL. Search the repository first. If absent, request those values once or make the entries explicitly data-pending without fake links.

No résumé/CV download button.

Do not pre-create empty ORCID, Google Scholar, or LinkedIn buttons. The data model should permit adding them later.

Interaction rules:

- external sites open safely with `rel="noopener noreferrer"`
- email supports `mailto:` and a copy action where appropriate
- WeChat opens a QR/name dialog
- if the number of ports later exceeds capacity, use paged groups, not a continuously scrolling marquee
- first page always contains the highest-priority identities
- hover/focus pauses any future automatic paging

### 7.6 Right card radar

The radar must be the visual center of the right card.

Final correction from prototype review:

- desktop radar should be large, approximately `410px` effective diameter or larger when the card permits
- ability labels must be placed directly on/inside the radar area near axis ends
- do not reserve excessive external label margins
- use readable label plates with restrained translucent backgrounds
- avoid label overlap in Simplified Chinese, Traditional Chinese, and English

Radar design:

- five polygon grid levels
- five axes
- `2–2.5px` capability outline
- glacier-cyan translucent fill
- clickable/keyboard-focusable capability labels
- primary axis highlighted in brass
- no rotating instrument rings
- no decorative gauge shell

Clicking a dimension opens the unified capability page at the corresponding anchor.

### 7.7 Five-level scale

Final approved scale:

```text
LEVEL 1 · 接触了解
LEVEL 2 · 系统学习
LEVEL 3 · 独立实践
LEVEL 4 · 完整成果
LEVEL 5 · 生产运用
```

Definitions:

- **1 接触了解** — understands basic concepts and has made an initial attempt
- **2 系统学习** — has completed structured study or training and can follow guided practice
- **3 独立实践** — can independently solve a real problem without relying on a complete tutorial
- **4 完整成果** — has produced a runnable, presentable, reproducible, or verifiable complete result
- **5 生产运用** — uses the capability continuously in real projects, research, work, or public services and bears maintenance responsibility

### 7.8 Yearly radar snapshots

The default is 2026.

The year control is a discrete year slider:

```text
2024 ───── 2025 ───── 2026
```

The slider displays historical status snapshots. It is not intended as a strict shape comparison tool.

Therefore:

- axes may change position between years
- ability names may change
- the primary axis may change
- no previous-year polygon overlay
- no percentage comparison labels
- switching animation should fade old labels, rearrange axes, and expand the new polygon
- do not spin the entire radar

Approved data:

#### 2024

- 团队协作 — 3 — **primary/top axis**
- WPS 三件套 — 4
- 平面设计 — 4
- LaTeX 排版 — 3
- SolidWorks 仿真 — 1

#### 2025

- 团队协作 — 4 — **primary/top axis**
- 全栈开发 — 2
- 平面设计 — 5
- LaTeX 排版 — 4
- SolidWorks 仿真 — 4

#### 2026

- 能源与动力 — 4 — **primary/top axis**
- ANSYS 仿真 — 4
- AI Agent 工程 — 3
- 全栈开发 — 5
- 读书笔记 — 4

The top dimension is the main line and must receive a clear but restrained `PRIMARY ◆` marker.

When a past year is selected, distinguish:

- `SELECTED 2024`
- `CURRENT 2026`

Do not imply that a historical selection is the current state.

The left profile card may update a small set of historical status fields when the slider moves, but platform ports remain current.

---

## 8. Screen 02 — Capability-formation timeline

### 8.1 Purpose

This screen explains how capabilities formed.

It owns the growth narrative. Do not duplicate a full growth-analysis narrative in Screen 01.

### 8.2 Desktop layout

Use a yearly serpentine / boustrophedon timeline:

```text
2024  → events →
                  ↓
2025  ← events ←
↓
2026  → events → NOW
```

Rules:

- one row per year
- year labels are visually strong
- path turns use clear arrows
- each year has a subtle visual region
- fit 2024–2026 within one main desktop chapter where possible
- if future years exceed capacity, use a draggable timeline canvas or a recent-year window before adding endless vertical rows

### 8.3 Event types

#### Milestone / major tick

- larger brass node
- specific icon
- visible title and date
- short result summary
- clickable target
- may show an image/cover in a detail drawer

#### Progress event / minor tick

- smaller glacier-cyan node
- short icon or month marker
- desktop hover/focus shows summary
- mobile tap opens summary
- click may navigate to the relevant content or anchor

### 8.4 Timeline and radar linkage

Clicking a timeline event may:

- set the associated radar year
- identify related capability IDs
- show a local message such as `Linked snapshot: 2025 · Full-stack development`

Do not forcibly scroll the user back to Screen 01 after every timeline click.

### 8.5 Mobile layout

Replace the serpentine path with a standard vertical timeline.

Do not force a miniature left-right snake into a phone viewport.

### 8.6 Content sourcing rule

The event text in the interactive prototype was illustrative, not a fully approved factual timeline.

Build the real timeline from repository facts, including where appropriate:

- graphic design internship
- student office work
- team and volunteering work
- research projects
- mathematical modeling and competition milestones
- software projects
- Yuan Ze exchange
- BRFC submission record
- patents
- knowledge and reading system milestones

Do not invent exact dates. Use the existing date ranges or omit day-level precision when unsupported.

Suggested event schema:

```yaml
- id: unique-event-id
  year: 2026
  date: 2026-07
  type: milestone # or progress
  title:
    zh: ...
    en: ...
  summary:
    zh: ...
    en: ...
  capabilityIds: [full-stack, ai-agent]
  target: projects.html?lang=zh#...
  icon: code
```

---

## 9. Screen 03 — Four content portals

### 9.1 Purpose

This screen is a map into the complete personal content world. It is not another résumé section.

Approved portals:

1. **协作网络 / Collaboration**
2. **兴趣图谱 / Interests**
3. **知识系统 / Knowledge**
4. **荣誉档案 / Honors**

Desktop uses a full-screen 2 × 2 grid. Mobile stacks cards vertically.

Each card contains:

- portal name
- manually composed semantic word cloud
- small content count or archive description
- last updated date
- full-card navigation target

### 9.2 Word cloud rules

Do not use a random word-cloud library.

Use manually curated placement and three primary hierarchy sizes:

- core term: `26–32px`
- main term: `17–20px`
- supporting term: `13–15px`

Approved later correction:

- the cloud may be denser than the first prototype
- existing keywords may repeat
- repeated terms are semantic texture, not additional categories
- repeated terms should use lower opacity and/or smaller size
- a core term may appear about 2–3 times total when useful
- no rotated text
- no continuous drifting animation
- no illegible overlap

Suggested density:

- 7–11 unique terms
- several low-opacity echo terms
- maintain breathing room and a clear core term

### 9.3 Distinct visual grammar per portal

- **协作网络** — nodes and restrained connection lines
- **兴趣图谱** — constellation/orbit arrangement
- **知识系统** — hierarchy, directory lines, or knowledge-node structure
- **荣誉档案** — years, archive IDs, stamp outlines, and restrained brass use

The four cards share a design system but must not be four identical boxes with different words.

---

## 10. Visual system — finalized

### 10.1 Design character

```text
70% information and typographic order
20% digital archive material
10% light science-fiction identity
```

Science-fiction intensity: **2 / 5**.

The page should feel like a real research/engineering console, not a game menu concept image.

### 10.2 Core colors

#### Dark console surfaces

```text
Graphite background       #090D12
Base panel                #0F1620
Raised panel              #151F2B
Structural border         #263342
Primary dark text         #F3F6F8
Secondary dark text       #AAB5C2
Interactive glacier cyan  #78D6E8
Primary/history brass     #C5A166
Active state green        #79C99E
```

#### Light archive surfaces

```text
Archive paper background  #F4F1EA
Archive card              #FBF9F4
Secondary paper surface   #ECE7DE
Archive border            #D7D0C5
Primary light text        #16202A
Secondary light text      #5D6873
Light interactive accent  #1D5F7A
Dark brass accent         #8B5E2D
```

Color roles:

- cyan — current data, interaction, radar, minor events
- brass — primary axis, milestones, honors, archive markers
- green — genuine active/current state only
- red — real error/warning only

Meet WCAG AA contrast for normal text.

### 10.3 Fonts

Approved family:

- `IBM Plex Sans SC` — Chinese/Latin body, headings, cards, labels
- `IBM Plex Mono` — dates, years, IDs, levels, system labels, screen numbers

Use robust fallback stacks.

Rules:

- no novelty science-fiction font for Chinese
- no weight 200/300 body text on dark backgrounds
- Mono should remain a minority of total page text
- all caps only for short labels such as `CURRENT`, `PRIMARY`, `PROFILE BUILD`

### 10.4 Type scale guidance

Desktop:

```text
Name                  48–56px / 700
Identity description  18–20px
Screen heading        30–36px / 600
Card heading          22–26px / 600
Body                  17px
Secondary text        14–15px
System label          12–13px Mono
Year display          52–72px / 700
```

Mobile:

```text
Name                  34–40px
Screen heading        26–30px
Body                  16–17px
Radar axis label      13–15px
System label          12px
```

Chinese body line height: approximately `1.7–1.8`.

### 10.5 Card materials

#### Screen 01

Matte instrument panels:

```text
background: #0F1620
border: 1px solid rgba(255,255,255,.09)
border-radius: 18px
subtle top inner highlight
subtle dark shadow
```

Do not use heavy glassmorphism for the two main cards.

Glass/backdrop blur is allowed only for small overlays, dialogs, and tooltips.

#### Screen 02

The path should sit on one coherent engineering-board surface. Do not wrap each event in a large card.

#### Screen 03

Warm archive cards:

```text
background: #FBF9F4
border: 1px solid #D7D0C5
border-radius: 18px
subtle shadow
hover lift: no more than 2px
```

### 10.6 Radius system

```text
6px   small badges
12px  controls, small cards, overlays
18px  primary cards
```

Avoid oversized consumer-app pill shapes everywhere.

### 10.7 Line system

```text
0.5–1px  background grid and helper ticks
1px      card borders and ordinary structure
1.5px    selected/interactive borders
2px      radar outline and timeline path
3px      current node only when necessary
```

Meaning:

- solid — confirmed structure
- short dashed — helper or historical relation
- dotted — weak/clickable relation
- glow — temporary hover/current feedback only

Do not use decorative double borders or widespread luminous outlines.

### 10.8 Animation timing

```text
hover/control feedback      140–180ms
card state change           220–300ms
overlay entrance            240–320ms
radar label rearrangement   320–420ms
radar polygon expansion     550–650ms
timeline auto-position      450–600ms
subtle screen snap          400–550ms
```

Respect `prefers-reduced-motion`.

Only one continuous animation is acceptable: an extremely subtle active-state pulse approximately every 3 seconds.

### 10.9 Prohibited visual effects

Do not add:

- continuous scan lines
- full-screen particles
- glowing every border
- excessive hexagons
- fake code or meaningless technical strings
- rotating radar rings
- glitch flickering
- background video
- floating word clouds
- large blue-purple gradient washes
- cyberpunk city/space backgrounds

Validation rule:

> The page must still work visually with all animation disabled and all decorative lines removed.

---

## 11. Responsive requirements

### Desktop

- target reference width: 1440px
- content max width around 1280px
- Screen 01 split 50/50
- radar approximately 410px effective diameter or larger
- Screen 03 2 × 2

### Tablet

- preserve Screen 01 side-by-side layout where practical
- reduce padding and port grid columns before stacking the two cards
- verify labels in all three languages

### Mobile around 390px

- Screen 01 identity above radar
- large radar; do not shrink into an unreadable decoration
- Screen 02 vertical timeline
- Screen 03 one card per row
- no horizontal overflow
- touch targets at least about 44px
- hover-only content must have tap/focus alternatives

Test at minimum:

- 1440 × 900
- 1280 × 720
- 1024 × 768
- 768 × 1024
- 390 × 844
- browser text zoom / 200% where feasible

---

## 12. Shared page visual strategy

The homepage is the strongest expression of the theme, but subpages must feel like the same site.

Recommended visual distribution:

- Screen 01 — dark graphite console
- Screen 02 — dark/mid-tone timeline board
- transition band — archive threshold with one brass line
- Screen 03 — warm archive paper
- project/research/knowledge/capability pages — predominantly light archive reading/catalog surfaces
- posts — light reading surface with restrained dark chrome

Use one shared language resolver and one shared page shell where possible.

Preserve `?lang=zh|chinese-traditional|en` across page navigation.

The existing site defaults to Traditional Chinese when no saved/requested language exists in several renderers. Do not change the default language silently during visual work unless the user explicitly requests it.

---

## 13. Content migration map

Do not delete the seven legacy Markdown sources before their content has a destination.

Suggested mapping:

- `home.md` → Screen 01 status/profile data
- `about.md` → profile summary, capability evidence, capability page
- `interests.md` → Interests portal and knowledge/research links
- `publications.md` → Research page, capability evidence, timeline milestones
- `experience.md` → timeline and Collaboration portal
- `practice.md` → timeline and Collaboration portal
- `awards.md` → Honors portal and honors archive page
- image galleries → portal/subpage media, not three large homepage carousels

The old image carousels should not remain as standalone homepage sections. Their source directories can remain intact until a new gallery/archive destination exists.

---

## 14. Accessibility and interaction requirements

- semantic sections and headings
- keyboard-operable radar labels
- visible focus styles
- native buttons for controls
- native range input or accessible custom equivalent for year selection
- dialogs with focus management and Escape close
- descriptive `aria-label`/`aria-describedby`
- radar must have a textual alternative listing all five values
- timeline events must be reachable without hover
- do not use color as the only indicator of primary/current/milestone status
- external-link labels must remain understandable without icons
- support reduced motion
- preserve readable contrast

The radar may use SVG. Labels should be actual accessible text or paired with equivalent DOM controls, not an inaccessible canvas-only rendering.

---

## 15. Testing and validation checklist

Before each major commit:

```bash
npm run build
npm run build:check
npm run check
git diff --check
```

Also verify:

### Content integrity

- BRFC title, venue, author order, and status remain factual
- Yuan Ze exchange details remain intact
- awards are not silently dropped
- all three language outputs load
- generated files are current
- no fake platform URLs

### Homepage

- exactly three main visual chapters on desktop
- no traditional full navigation bar
- section indicator is discoverable
- identity ports are operable
- current 2026 radar loads by default
- 2024/2025/2026 snapshots display exact approved values
- axes can rearrange without broken animation
- labels sit inside/over the radar and remain readable
- radar is visually large
- capability links land on correct anchors
- selected/current year distinction is clear

### Timeline

- desktop snake direction is unambiguous
- milestone vs progress event distinction is clear without relying only on color
- hover/focus/tap details work
- mobile becomes vertical
- event-to-radar linkage does not cause disruptive page jumping

### Portals

- four portals use distinct internal visual grammar
- word clouds are manually arranged
- repeated echo terms use lower visual emphasis
- no random overlap
- entire card is navigable

### Responsive

- no horizontal overflow at 390px
- no clipping caused by fixed `100vh`
- keyboard and touch both work
- language labels do not overflow

### Performance

- no unnecessary Bootstrap or MathJax on the new homepage
- do not load both legacy and new style systems unnecessarily
- no heavy 3D/WebGL dependency
- no large animation library unless demonstrably necessary

---

## 16. Recommended implementation order

### Phase 0 — Safeguard

- re-read latest `main`
- restore ordinary CI validation
- document current build commands
- fix no content yet

### Phase 1 — Data foundations

- add `homepage.yml`
- add `capabilities.yml`
- add dedicated build/validation
- generate JSON
- add language helpers
- preserve existing outputs

### Phase 2 — Screen 01

- replace legacy homepage shell
- build identity card
- build identity ports
- build large accessible SVG radar
- implement year snapshots
- implement unified capability anchor links

### Phase 3 — Screen 02

- build desktop serpentine timeline
- build mobile vertical timeline
- implement milestone/progress detail interactions
- implement non-disruptive linkage to radar state

### Phase 4 — Screen 03

- build four portal cards
- implement manually positioned semantic clouds
- add low-opacity repeated terms
- connect cards to real destinations

### Phase 5 — Unified capability page and shared shell

- add capability page with anchors
- move/associate evidence
- unify project/research/knowledge chrome
- modernize posts list/detail shell

### Phase 6 — Cleanup

Only after replacement functionality is verified:

- remove obsolete homepage Bootstrap dependency
- remove duplicate stylesheet loading
- remove unused homepage carousel code
- remove duplicate MathJax loading
- clean inline styles/scripts from post pages
- update `README.md` and `MAINTAIN.md`
- keep legacy source content until migration is complete and reviewed

---

## 17. Definition of done

The redesign is complete when:

1. The homepage communicates current identity and five-dimensional capability status within the first chapter.
2. The 2024, 2025, and 2026 radar snapshots exactly match approved data.
3. The radar is large, uses labels directly within its visual area, and links to unified capability anchors.
4. The second chapter tells a factual capability-formation story with year-based timeline events.
5. The third chapter provides four visually distinct content portals with dense, curated semantic word clouds and permitted low-opacity repetitions.
6. Desktop, tablet, and mobile layouts are coherent.
7. The visual system matches Graphite Archive: graphite, glacier cyan, brass, warm archive paper, IBM Plex.
8. The site remains static, maintainable, multilingual, and GitHub Pages compatible.
9. All current factual content remains accessible somewhere appropriate.
10. Build, validation, generated outputs, and ordinary CI pass.
11. No fake public-profile links or unsupported personal claims are introduced.
12. Subpages no longer feel like an unrelated legacy website.

---

## 18. Final design principle

> Use current capabilities to define identity, use factual events to explain formation, and use the archive portals to expose the complete personal world.

The redesign must prioritize information clarity over spectacle. The science-fiction layer should be noticed second, after visitors understand the person and the work.
