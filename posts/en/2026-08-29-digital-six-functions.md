---
title: "The Enterprise’s “Six Digital Functions”: Websites, Apps, Mini Programs, Private-Domain Workspaces, Data Platforms, and Agents — Production Relations and a Ten-Year Strategy"
date: 2026-08-29
---

<p class="post-lede">This is a stage research note on the organizational form of enterprise digitalization. I place websites, apps, Mini Programs, private-domain workspaces, data platforms, and Agents within one system of production relations, then ask how they become digital capital, organizational capability, and long-term competitive advantage.</p>

## Executive Summary

**The six digital functions are not six separate IT systems. They are six kinds of enterprise power: the website governs public identity, the app governs long-term customer relationships, the Mini Program governs platform transactions, the private-domain workspace governs human–machine collaboration, the data platform governs unified facts and decision support, and the Agent governs intent and execution. Over the next decade, the real competition will not be about who owns the most software, but who can make all six share the same data, rules, customer relationships, and permissions—turning every interaction into repeatable, auditable, and scalable cash flow.**

This judgment extends two earlier frameworks: the “digital body,” “One Core, Multiple Interfaces,” and the “machine-callable enterprise.” Functions previously treated as back-office infrastructure—especially the **enterprise private-domain workspace** and the **data platform**—deserve to be elevated to first-class digital functions alongside websites, apps, Mini Programs, and Agents.

Macro trends support this shift. WIPO’s latest statistics show that across 29 economies representing roughly 57% of global GDP, intangible investment exceeded **US$10 trillion** for the first time in 2025. Real compound growth from 2008 to 2025 was about 3.5%, roughly 3.6 times the growth rate of tangible investment. Software, data, brands, and organizational capital are increasingly moving from “supporting expenses” toward productive capital.

## What Does Each of the Six Functions Actually Control?

The easiest way to understand the six is not to ask, “What software is this?” but:

> **What kind of power has the enterprise delegated to it?**

Once framed this way, the boundaries become much clearer.

| Digital function | One-line essence | Enterprise power it controls | Board-level KPIs | Typical technologies / interfaces | Strategic priority |
|---|---|---|---|---|---|
| **Website** | The enterprise’s “digital national gate and public gazette” on the open internet | Identity, public explanation, open discovery | Qualified organic/AI traffic, lead conversion, brand search, machine-readable coverage, direct revenue | Domain, DNS, HTTPS, CMS, structured data, search crawling, public APIs | **P0: almost every enterprise should have one** |
| **App** | A “private service hall” for high-value customers | Presence, long-term relationship, deep service | 30/90/180-day retention, LTV/CAC, transaction frequency, verified active users, gross profit per user | iOS/Android, push, payments, biometrics, camera/location/Bluetooth, deep links | **P1: prioritize when frequency and LTV are high** |
| **Mini Program** | High-efficiency commercial territory leased inside a super-platform | Platform distribution, contextual reach, low-friction transactions | Open-to-completion rate, GMV, membership binding, repeat purchase, cost per completed service, platform dependence | WeChat login, payment, QR, sharing, search, platform APIs, CRM binding | **P0/P1: highly important in Chinese consumer and service markets** |
| **Private-domain workspace** | The enterprise’s own “general office and customer reception hall” | Organizational coordination, customer ownership, human–machine joint work | Process cycle time, first-response time, first-contact resolution, handoff loss, customer ownership rate, tasks completed per employee | WeCom/collaboration suites, CRM, SSO/IAM, IM, contact center, workflow, knowledge base | **P0: any organization needs one** |
| **Data platform** | The “general staff and operating fact center” | Measurement, memory, analytics, decision evidence | Data quality, freshness, metric consistency, reconciliation gaps, analytical latency, data reuse | Warehouse/lakehouse, ETL/CDC, master data, catalog, lineage, semantic layer, BI | **P0: common foundation for all six** |
| **Agent** | A policy-constrained “senior governor” | Intent understanding, orchestration, limited execution | Task success rate, human takeover rate, tool-call success, cost per task, cycle-time reduction, error loss, contribution margin | Models, RAG, memory, APIs/tools, MCP, skills, evals, tracing, policy/approval | **P1: accelerate after the foundation is connected** |

“P0/P1” here means **investment order, not importance ranking**. An app can be strategically valuable, but a business that interacts with a customer only twice per year should not force installation merely to appear digitally complete. A website, corporate identity, unified data, and an internal workspace generally do not have the same frequency constraint.

**Website — not the warehouse itself, but the authoritative public directory of the warehouse.**  
The earlier idea that “the website is becoming the headquarters warehouse of digital capital” was close to the core, but needs one important boundary: customer privacy, orders, inventory, and accounting should not literally be piled into a public website. A more precise description is that the website becomes the enterprise’s **authoritative public projection and master directory**. With AI search, it increasingly serves both people and machines. OpenAI currently explains that public websites can appear in ChatGPT Search, and that allowing OAI-SearchBot can help content be discovered, summarized, and cited. Machine comprehensibility is therefore becoming a new kind of enterprise asset.

Future `company.com` should answer two kinds of visitors:

> A human asks: “Who are you, what do you sell, and can I trust you?”  
> A machine asks: “Who are you, what capabilities do you have, what are your prices and rules, and how should I interact with you?”

**App — not “the software with the most features,” but the enterprise’s long-term outpost in a customer’s daily life.**  
Apple’s published research indicates that the global App Store ecosystem facilitated more than **US$1.4 trillion** in developer billings and sales in 2025, reaching over 850 million users weekly across 175 countries and regions. More than 40 of the top 100 apps already had consumer-facing AI capabilities. This is better read as evidence for **APP × AI**, not “Agents replacing apps.”

Apps are therefore especially suitable for banking, securities, mobility, retail membership, production sites, healthcare, and long-term equipment management—situations where customers are valuable, usage is frequent, and push notifications, identity, device hardware, or persistent personalization matter. **What the app sells is not pages, but the feeling that “this enterprise knows me.”**

**Mini Program — not a smaller app, but high-efficiency commercial land leased from a platform.**  
By the first quarter of 2026, Weixin and WeChat together had more than 1.4 billion monthly active users. Tencent reported that WeChat Mini Programs facilitated roughly **RMB 8 trillion** in transaction value in 2024. By 2025, the Mini Program ecosystem covered 100 countries and regions and 108 industry verticals, with cross-border transaction value growing by more than 70% year over year.

It excels at one problem:

> “I need to do this right now, but I do not want to install an app just for it.”

Uber offering overseas ride-hailing to Chinese users through a WeChat Mini Program is a representative globalization case. Rather than asking Chinese travelers to learn a new digital entry point, the enterprise enters the environment they already know.

Its economic role is therefore **reducing distribution friction**. Its weakness is equally clear: the land belongs to the platform. Enterprises should operate on that land, but customer identity, order facts, and business logic should not exist only on the landlord’s property.

**Private-domain workspace — the fifth function most deserving of promotion from the older four-function framework.**

It is neither merely OA nor merely CRM.

It answers a deeper question:

> **Where do employees, customer-service staff, salespeople, managers, and future Agents actually “go to work”?**

WeCom already reflects this direction: it supports internal office work, exposes more than 200 APIs for enterprise applications, and connects WeChat messaging, Mini Programs, and payments. Tencent also emphasizes that customer relationships can remain with the enterprise rather than disappearing when an employee leaves.

Tencent Cloud Contact Center points in the same direction. “Customer reception” is moving from a telephone seat into a unified workspace where calls, online messaging, audio/video, customer information, service history, and CRM can collaborate in one environment, with SDKs/APIs embedding these capabilities into enterprise systems.

It is therefore the enterprise’s **Human Control Plane**.

Websites, apps, and Mini Programs answer “where are customers?” The private-domain workspace answers:

> **Once the customer arrives, where does the enterprise itself catch and serve them?**

**Data platform — think “general staff + operating ledger,” but do not confuse it with the statutory financial ledger.**

Its job is to unify the enterprise’s understanding of reality:

How much did we sell today?

Which channel is profitable?

Who owns this customer?

How much inventory is really left?

What is the canonical name of this product?

How is customer lifetime value calculated?

Does “sales revenue” mean the same thing to finance, operations, e-commerce, and the board?

China’s Ministry of Industry and Information Technology has reported that by 2025 the country had issued 37 national standards in the big-data field and that more than 5,700 enterprises had obtained DCMM data-management capability maturity certification. Policy documents emphasize the full lifecycle of data—collection, storage, computation, governance, and use—along with enterprise data governance and mechanisms such as chief data officers.

But the board needs a hard boundary:

> **A data platform can become the unified source of operating truth, but it must not casually replace the statutory ledger in ERP or financial systems.**

Systems that legally change money, contracts, inventory, or order states should remain controlled systems of record. The data platform aggregates, governs, explains, analyzes, forecasts, and reconciles.

**Agent — not a fourth, fifth, or sixth page, but the first genuinely action-oriented digital function.**

China’s 2026 policy on standardized application and innovative development of intelligent agents defines an Agent as an intelligent system capable of **autonomous perception, memory, decision-making, interaction, and execution**, and places task understanding, planning, tool use, multi-agent collaboration, standard protocols, and security governance within the industrial agenda.

OpenAI’s Agent tooling reflects the same architecture: models can search, read enterprise materials, call tools, and even operate computers, while the Agents SDK can orchestrate single- or multi-Agent workflows.

So the real value of an Agent is not “chatting.”

It compresses a chain such as:

> Customer speaks → employee interprets → finds a system → checks data → fills a form → transfers departments → waits → re-enters data → executes

toward:

> **Intent → plan → call capability → execute → verify → request human confirmation when necessary.**

But it must be a **senior governor with a constitution, permission boundaries, and oversight**. Chinese regulators have explicitly noted that high autonomy and high privileges increase risks such as privacy leakage, unauthorized operations, and loss of behavioral control.

## How the Six Form One Company

The most important relationship among the six is not technical. It is a set of **production relations**.

An enterprise can be understood through four kinds of power:

**External entry power:** website, app, Mini Program.  
**Internal operating power:** private-domain workspace.  
**Knowledge and measurement power:** data platform.  
**Understanding, orchestration, and execution power:** Agent.

They are therefore not six parallel “software projects,” but:

> **Three market front doors + one human general office + one general staff + one intelligent governor.**

The true enterprise core remains customer relationships, products, orders, contracts, inventory, capital, business rules, and physical productive capacity. ERP, CRM, OMS, MES, WMS, payment systems, and other underlying machinery do not disappear. This report simply treats the six as first-class digital functions rather than promoting every production system into a seventh or eighth “ministry.”

The earlier “digital body” metaphor can now be made more precise:

| Enterprise digital body | Role |
|---|---|
| Website | Face, identity card, public gazette |
| App | The hand continuously held by important customers |
| Mini Program | A hand extended into platform ecosystems |
| Private-domain workspace | The torso where enterprise people work together |
| Data platform | Memory, senses, and staff intelligence |
| Agent | Higher-level cognition and action orchestration |
| Core business systems | Bones, blood, and organs |
| Physical enterprise | The body that ultimately produces goods and services |

The same relationship can be reduced to a simple flow:

~~~mermaid
flowchart TB
    W[Website] --> C((Enterprise Operating Core))
    A[App] --> C
    M[Mini Program] --> C
    P[Private-domain Workspace] <--> C
    C <--> D[Data Platform]
    D --> G[Agent]
    G <--> P
    G --> C
~~~

Four principles matter especially.

**First, external entry points may be many, but facts must be one.**

If the same product is RMB 199 on the website, RMB 189 in the app, RMB 209 in a Mini Program, and an Agent retrieves RMB 179 from an old knowledge base, that is not “omnichannel.” It is an enterprise with four contradictory brains.

The website, app, Mini Program, workspace, and Agent should therefore read the same product, price, inventory, customer, order, and permission facts. The more mature data governance and shared capabilities become, the lower the marginal cost of adding another channel. China’s push toward product master data, high-quality datasets, and data-governance standards reflects this direction.

**Second, an Agent may decide what to call, but it must not invent facts.**

An Agent can say:

> “According to the inventory system, the Changsha warehouse currently has 18 units.”

It cannot say:

> “I think there should be 18, so I will write 18 into the inventory system.”

Mature enterprises must preserve:

> **Agent ≠ System of Record.**  
> **Agent = Policy-Bounded System of Action.**

OpenAI’s tool-calling model follows this pattern: the model chooses a tool, the application executes real code, and the result is returned. Chinese Agent governance frameworks likewise emphasize permissions, behavioral controls, and lifecycle security.

**Third, the private-domain workspace will become a joint cockpit where humans supervise machines and machines assist humans.**

Agents should not float outside the company.

They should gradually enter sales, service, procurement, and management workspaces:

> Human sees customer → Agent enriches context → data platform supplies facts → Agent prepares a plan → human approves critical actions → systems execute → results flow back automatically.

This matters far more than building a standalone “AI chat window.” Tencent’s 2026 global positioning of WorkBuddy as an enterprise AI workspace also suggests that collaboration workspaces and Agents are beginning to converge.

**Fourth, Agents will not simply eliminate the first three entry points. They will first eliminate “operating software for the sake of operating software.”**

Alibaba’s 2026 product path is especially worth watching. The Qwen app has combined existing services such as Taobao, Alipay, Fliggy, and Amap behind a natural-language entry point, then connected more than four billion Taobao/Tmall product listings together with ordering, logistics, and after-sales capabilities so users can complete complex shopping tasks through dialogue.

This is an important real-world validation:

> The Agent did not “eat” Taobao’s product catalog, order system, payment, or fulfillment systems.

Instead, **because those digital assets already exist, the Agent has something to orchestrate.**

The likely future is therefore not:

> Website → App → Mini Program → Agent

but:

> **Website × App × Mini Program × Workspace × Data × Agent**

operating as one system.

## How Digital Capital Becomes Profit and Organizational Capability

Executives should not ultimately judge these six investments by whether they look advanced. They should ask:

> **Did they change the company’s cash-flow equation?**

A rough economic expression is:

[
Profit
approx
Reach
	imes Conversion
	imes AverageOrderValue
	imes Frequency
	imes Retention
	imes GrossMargin
-
AcquisitionCost
-
ServiceCost
-
CoordinationCost
-
TechnologyCost
-
RiskCost
]

The six functions act on different terms.

**The website mainly solves “being discovered continuously at low cost.”**  
A strong website accumulates search authority, brand trust, content, and AI discoverability, reducing marginal acquisition cost over time. OpenAI already allows public websites to participate in ChatGPT Search and provides ways to attribute referral traffic from ChatGPT, which means AI traffic can enter marketing attribution.

**The app mainly solves “how long a good customer stays.”**  
It should focus on lifetime value, transaction frequency, retention, and the depth of high-value services rather than installation count. The scale of the global App Store economy and the direct integration of AI into apps suggest that the app’s economic niche remains durable.

**The Mini Program mainly solves “can this transaction take fewer steps?”**  
QR codes, WeChat identity, payments, social sharing, and no-install access make it naturally suited to occasional services, offline scenarios, and instant transactions. The scale and cross-border expansion of WeChat Mini Programs also show that this interface is evolving from a domestic Chinese product into a way to serve Chinese users globally.

**The private-domain workspace mainly solves “can the enterprise keep relationships and organizational efficiency under its own control?”**  
If one salesperson leaves and 3,000 customers disappear with them, the company never truly formed a customer asset. When relationships, communication history, orders, tasks, and service records are preserved in an enterprise-controlled workspace, personal relationships begin to become enterprise capital.

**The data platform mainly solves “is the world the boss sees actually real?”**

Its contribution is often less visible but more fundamental:

reduce pricing errors;  
reduce excess inventory;  
identify unprofitable customers;  
identify high-margin SKUs;  
reduce duplicate development;  
shorten operating-analysis time;  
improve budgeting and forecasting;  
make every digital entry point use the same facts.

The board should therefore ask not only, “How much direct sales did the data platform generate?” but:

> **How much did we previously lose through inconsistent information, duplicate development, and incorrect operating judgments?**

**The Agent mainly solves “how much cognition, labor, and time does it take to complete one job?”**

Real-world research has shown meaningful productivity gains from generative AI in specific work settings. One study of 5,179 customer-support agents found that AI assistance increased issues resolved per hour by about 14% on average, with larger benefits for less-experienced and lower-skilled workers. But that is a specific study and should not be mechanically generalized to every enterprise.

The more important historical lesson is that a general-purpose technology such as AI does not produce total-factor productivity simply because it is purchased. NBER research on the “productivity J-curve” argues that realizing such value requires complementary investment in processes, software, organization, human capital, and business models—many of which are themselves forms of intangible capital.

So digital profit is unlikely to be:

> “Buy AI → cut staff → profit rises.”

A more realistic path is:

> **Standardize the digital foundation → let one employee command more enterprise capabilities → let Agents absorb repetitive coordination → widen management span → reduce cost per completed job → let the same workforce serve more customers and assets.**

This changes the talent structure.

Enterprise headcount may indeed fall in some areas, but the enterprise as a productive unit does not disappear. More likely:

> **Fewer people own one step; more people own an outcome.**

Traditional roles might separately manage web operations, app operations, Mini Program operations, customer support, data analysis, and AI engineering.

Future roles are more likely to become:

> **customer-journey owner, business-capability owner, data owner, Agent-process owner.**

One person owns a complete operating result and orchestrates software, data, and multiple Agents underneath.

This is where digital capital truly changes organization: not merely by increasing keyboard speed, but by expanding **one person’s management radius and production radius**. NBER research on digital capital similarly suggests that IT becomes a predictive enterprise asset only when combined with firm-specific software, processes, organizational knowledge, and talent.

Accounting requires a strict distinction between two balance sheets.

| Statutory accounting balance sheet | Entrepreneurial economic balance sheet |
|---|---|
| Answers “what may be recognized under accounting standards?” | Answers “what determines future cash flow?” |
| Emphasizes control, identifiability, recognition, measurement | Emphasizes customer relationships, reuse, replacement cost, profit contribution, strategic options |
| Strictly constrained by accounting standards | Internal board-management tool |
| Many internally created brands and customer relationships cannot be booked directly | They may still be among the enterprise’s most valuable assets |
| SaaS expense is not automatically an intangible asset | Processes, knowledge, and organizational capability formed around SaaS may still have major economic value |

IFRS IAS 38 requires intangible assets to meet conditions such as identifiability, control, and expected future economic benefits. Internally generated brands and customer lists cannot simply be recognized because they are economically valuable.

Websites are similar. IFRS SIC-32 states that website development expenditure may qualify as an intangible asset only when IAS 38 conditions are met and future economic benefits can be demonstrated. If a website mainly serves advertising and promotion, related expenditure is generally expensed.

Cloud software creates another common misunderstanding. IFRS analysis of SaaS configuration and customization notes that where the vendor controls the software and the enterprise merely receives access as a service, many configuration costs do not automatically become the enterprise’s own intangible asset simply because they were expensive.

China’s Ministry of Finance began implementing interim rules on accounting treatment for enterprise data resources in 2024, but “data has value” still does not mean “data is automatically recognized as an asset.” Recognition remains governed by enterprise accounting standards, and internal R&D must distinguish research from qualifying development stages.

I therefore suggest that boards maintain two registers:

> **One for accountants: Accounting Asset Register.**  
> **One for entrepreneurs: Strategic Digital Capital Register.**

The second should track:

Do we still own the domain?  
Are customer relationships actually ours?  
Is the data clean?  
Can interfaces migrate?  
How many channels reuse one capability?  
If we replace WeChat, Apple, or a model provider, how much value remains?

That is the key distinction between **digital assets** and **digital rent**.

## Verifiable Hypotheses and the Next Ten Years

The following does not package trends as certainty. It follows a Mendelian-style approach: **state a hypothesis → describe the mechanism → identify evidence that could falsify it**. The underlying reality includes rapid intangible-investment growth, China’s inclusion of Agent protocols/toolchains/multi-Agent collaboration/intelligent internet in policy, and emerging cross-system orchestration from Alibaba, Tencent, OpenAI, and others.

| Verifiable hypothesis | Why it may hold | How to validate/falsify it around 2030 |
|---|---|---|
| **Interface depreciation accelerates while capability assets appreciate** | AI reduces page-building cost, while high-quality customer data, rules, APIs, and processes remain hard to copy | Time to launch a new channel keeps falling while shared API/data reuse and replacement cost rise; if proprietary front-end code remains the main moat, the hypothesis weakens |
| **Agents will not eliminate apps/websites/Mini Programs, but will eliminate many operational steps inside them** | Agents excel at intent understanding and cross-tool orchestration, while confirmation, brand, visual comparison, payment, and identity still need controlled interfaces | Agent-assisted journeys rise while payment/signing/complex browsing still return to controlled UI; if mainstream commerce becomes fully UI-free, the hypothesis is falsified |
| **The private-domain workspace becomes the shared human–machine control console** | Employees and Agents need the same customer context, permissions, knowledge, and task queues | Customers/tasks handled per employee rise and Agents perform more preparation/execution inside workspaces; if AI remains a standalone chat box, the hypothesis fails |
| **The data platform shifts from “report viewing” to real-time operating staff intelligence** | Agent action requires fresh, unified, machine-readable data, while monthly BI is too slow | Metric freshness moves from days/months toward minutes/events and automated decisions rise; if AI still depends mainly on static documents, evolution is slower than predicted |
| **Agent discoverability becomes a new acquisition right** | AI is moving from returning links toward understanding enterprises, products, capabilities, and tools | AI referrals, Agent calls, and machine-mediated contribution margin become separately attributable channels; if users continue doing all discovery manually, strategic importance declines |

The fifth hypothesis is especially worth monitoring.

I define **Agent Discoverability** as:

> **When a customer asks an AI to solve a need, can the AI discover your enterprise, understand your products and capabilities, trust that the information is current, choose you, and safely complete a call or transaction?**

This is not yet a mature industry standard. It is an **internal strategic management metric**.

OpenAI already allows public websites to participate in ChatGPT Search. Chinese policy discussions around intelligent agents also address digital identity, retrieval and discovery, capability declarations, interconnection protocols, and related infrastructure. These trends approach the same question from different directions:

> **How does a machine find another trustworthy economic actor and understand what it can do?**

The classic SEO question:

> “Can a person find me on Google, Baidu, or WeChat?”

expands into:

> “Can AI find me?”  
> “Can AI understand me?”  
> “Can AI call me?”  
> “Why would AI choose me rather than a competitor?”  
> “After calling me, can AI verify that I actually delivered?”

This suggests three broad stages over the next decade.

**Now to around 2028: unify the six functions and repay foundational digital debt.**

Enterprises will deploy many Agents, but the main performance gap will come from who has cleaner data, more complete customer identity, more stable workspaces, and better system interfaces. Agents first become employee copilots for preparing information, querying data, summarizing, quoting, service triage, and operating analysis. Current Chinese Agent policy places strong emphasis on security, permissions, and classified governance, suggesting that humans will retain confirmation authority for key actions.

**Around 2028–2031: software shifts from “collections of pages” toward “collections of capabilities.”**

Enterprises will ask less:

> “Does our app have an inventory page?”

and more:

> “Do we have a reliable `CheckInventory` capability that the website, app, Mini Program, workspace, and Agent can all call?”

Open protocols such as MCP are already pushing AI toward external tools and data sources, and OpenAI supports remote MCP servers. The point is not that one AI protocol replaces every API, but that enterprise capabilities increasingly need to be **discoverable and callable by machines**.

**Around 2031–2036: enterprises begin serving both Human Customers and Machine Customers.**

A traveler may tell a personal Agent:

> “Arrange a three-day business trip from Beijing to Osaka next week. No red-eye flights, stay within company policy, and keep the hotel within two kilometers of the client.”

Their Agent may coordinate directly with airline, hotel, payment, reimbursement, and corporate-travel Agents.

Alibaba in 2026 already used Qwen to orchestrate existing capabilities from Taobao, Alipay, Fliggy, Amap, and others behind a natural-language interface, and began opening similar orchestration to external partners such as China Eastern Airlines for search, booking, seat selection, and check-in. This is not yet a fully autonomous machine economy, but it is a clear early path.

Commercial relationships may therefore expand beyond B2C and B2B toward:

> **B2A2C: Business → Agent → Consumer**

and further:

> **B2A2A2B: Business → Agent → Agent → Business**

This is strategic extrapolation, not certainty. But China is already looking ahead to multi-Agent coordination, interconnection protocols, intelligent internet, digital identity, discovery, and compliant payment, so enterprises should at least preserve architectural options for this future.

## Board-Level Construction Order and Governance

The most dangerous construction pattern is for a chairperson to order:

> Build a website project.  
> Build an app project.  
> Build a WeChat project.  
> Buy another office system.  
> Build another data platform.  
> Let the AI department build an Agent.

All six projects may succeed and the company can still end up with **six digital countries**.

The correct order is:

> **Unify the enterprise first, then build the six functions.**

A practical investment sequence:

| Stage | What the board should complete | Why first |
|---|---|---|
| **Foundation inventory** | Identify owners of domains, customer identity, products/services, orders, finance, data sources, workspaces, APIs, platform accounts, and Agents | Know who owns the assets |
| **Unify facts** | Define authoritative sources for customers, products, orders, pricing, inventory, and financial metrics; unify definitions through the data platform | Without shared facts, six-function collaboration fails |
| **Unify internal work surface** | Connect employee identity, CRM, service, sales, tasks, and knowledge into a private-domain workspace | Let the enterprise’s people share the same company first |
| **Rationalize the three external entry points** | Let the website own open discovery, the app own high-frequency relationships, and Mini Programs own low-friction scenarios; remove meaningless feature duplication | Each interface should do what it does best |
| **Capability APIs/tools** | Turn product lookup, quotes, inventory, reservations, orders, logistics, after-sales, and other key actions into shared APIs/tools | Agents and future channels need reusable capabilities |
| **Agentization** | Read first, then prepare, then execute with approval, and only later allow limited autonomy | Release risk gradually as maturity rises |
| **Machine transaction readiness** | Establish machine discovery, machine identity, capability catalogs, permissions, audit, and outward Agent interfaces | Preserve strategic options for the post-2030 period |

The principle is simple:

> **Turn the enterprise into one system before giving AI the power to act.**

Otherwise, a smarter Agent merely discovers faster that the company has seven customer IDs, five definitions of revenue, and three inventory numbers.

Boards should also use unified KPIs rather than allowing six teams to report unrelated successes.

Five board-level metrics are enough:

| Board metric | What it really answers |
|---|---|
| **Digital Contribution Profit** | How much incremental gross profit and cost saving did the digital system actually contribute? |
| **Cost per Completed Job** | Did the full cost of a customer or employee completing one real task fall? |
| **Shared Capability Reuse Rate** | How many interfaces, employees, and Agents reuse the same capability? |
| **Owned Relationship Ratio** | How much customer identity, relationship, and transaction truth does the enterprise genuinely control? |
| **Risk-adjusted Agent ROI** | After model cost, governance, errors, rework, and risk losses, how much value remains from Agents? |

This avoids a familiar digitalization joke:

> Website team: PV +30%.  
> App team: MAU +20%.  
> Mini Program team: GMV +40%.  
> OA team: 90% daily active rate.  
> Data team: 500 tables built.  
> AI team: 100 million tokens called.  
>
> **CFO: profit did not increase.**

The six functions do not exist to maximize six isolated KPIs.

They jointly serve **enterprise economic profit**.

Agent governance should also follow a simple principle: privileges should shrink as risk rises.

| Agent privilege | What it may do | Recommendation |
|---|---|---|
| **Read-only** | Query public information, knowledge, and customer-authorized information | Deploy broadly |
| **Prepare** | Prepare quotes, orders, emails, refund requests, contract drafts | Deploy broadly |
| **Restricted execution** | Execute within limits on amount, target, time, and business rules | Deploy after sufficient evaluation |
| **High-risk autonomous execution** | Large payments, legal commitments, critical production control | Very limited; normally retain human or deterministic control |

This is not technological conservatism. It is economics.

If an Agent saves RMB 3 million in annual labor but has a 1% chance of causing one RMB 50 million loss, a board cannot call it excellent automation simply because it is “99% correct.”

Chinese regulators already identify high privileges, unauthorized action, and loss of behavioral control as Agent risks. Tencent’s Zhuque security research also notes that once an Agent can execute code and access enterprise knowledge and tools, prompt injection can escalate from a wrong sentence to data leakage, business tampering, or even system control.

Therefore:

> **Least privilege + short-lived authorization + read/write separation + secondary confirmation for high-risk actions + end-to-end logs + rollback + continuous evaluation.**

Global operation adds another layer: **jurisdiction routing**.

A Chinese enterprise going global should not simply copy a domestic Agent into Europe. Multiple provisions of the EU AI Act became applicable and enforceable on **August 2, 2026**. Certain interactive AI systems require users to be informed that they are interacting with AI, while specific AI-generated or manipulated content carries transparency obligations.

Global six-function architecture should therefore follow:

> **One enterprise core, multiple market interfaces; one set of business facts, multiple jurisdictional policies.**

China sites, Europe sites, Southeast Asian Mini Programs, and global apps may differ in language, payment, privacy UI, and rules, but customer identity mapping, product facts, capability definitions, and audit principles should not fracture into different companies.

Finally, enterprises should begin building **Agent Discoverability** now.

There is no need to chase “AI SEO” mysticism. Five very ordinary things matter:

**Let machines find you.** Your website should be crawlable, identity should be clear, and public facts complete.

**Let machines understand you.** Products, services, locations, prices, policies, and FAQs should use structured data and stable semantics rather than being buried entirely inside images, PDFs, and slogans.

**Let machines call you.** Quoting, checking, booking, ordering, and after-sales should exist as controlled APIs/tools. MCP and similar protocols can become Agent-facing adaptation layers, but should not replace stable enterprise business APIs.

**Give machines reasons to trust you.** Keep data fresh, sources authoritative, outputs verifiable, identities trustworthy, and failures reversible.

**Only then let machines act for customers.** Identity, authorization, amounts, validity periods, and audit must be explicit.

A board can maintain a simple internal metric:

[
ADI
=
DiscoveryRate
	imes UnderstandingAccuracy
	imes CallSuccessRate
	imes TrustPassRate
	imes TransactionCompletionRate
]

**ADI (Agent Discoverability Index) is not an existing industry standard. It is a strategic metric proposed in this report for internal enterprise use.**

It answers a very practical question:

> **When a hundred million future customers stop searching manually and ask their AI to choose suppliers, will our company still enter the candidate set?**

## Conclusion and Main Source Families

A recurring mistake in the history of digitalization is to confuse the order in which technologies were discovered with a species-replacement sequence.

We discovered websites first and assumed the internet was webpages.

Then apps arrived and people predicted the mobile internet would eliminate the web.

Then Mini Programs arrived and people predicted no-install interfaces would eliminate apps.

Now Agents have arrived and some assume natural language will eliminate all software.

A better interpretation is:

> **Over more than thirty years, humanity has gradually discovered the different organs a digital enterprise needs.**

The website tells the world:

> **“This is who I am.”**

The app tells an important customer:

> **“I know you.”**

The Mini Program tells a platform customer:

> **“You can complete this right now.”**

The private-domain workspace tells employees:

> **“This is our customer, this is our work, and this is where we serve them together.”**

The data platform tells managers:

> **“This is what the facts actually are.”**

The Agent tells the enterprise:

> **“I understand what you want to accomplish, and I know which resources to orchestrate.”**

The enterprise’s governance must then tell the Agent:

> **“This is what you may do, what you may not do, and who is accountable.”**

The deepest strategic relationship among the six can therefore be compressed into one sentence:

> **The website acquires the right to be discovered by the world; the app acquires the right to a long-term customer relationship; the Mini Program acquires the right to instant transactions inside platforms; the private-domain workspace acquires the right to internal human–machine collaboration; the data platform acquires the right to measure operating facts; and the Agent acquires policy-bounded orchestration and execution power.**

When these six powers are unified, the enterprise becomes a true **digital production unit**.

The best enterprises of the future may not have the largest IT departments or train the largest models themselves.

They may instead look like this:

> **Fewer employees managing more customers; fewer interfaces delivering more services; less duplicated code but more reusable capabilities; more unified data and faster decisions; more Agents but clearer permissions; many platforms, while the enterprise still owns its customers, state, rules, and brand.**

This is what it really means for digital capital and physical capital to become comparable.

Software does not replace the factory.

Rather:

> **Physical capital determines what the enterprise can produce; digital capital determines whether that productive capacity can be discovered, organized, traded, replicated, orchestrated, and globalized.**

A strategic formula is:

[
EnterpriseLongTermCompetitiveness
=
PhysicalProductivity
	imes
DigitalOrganizationalPower
	imes
IntelligentExecutionPower
	imes
GovernanceTrustworthiness
]

The digital-organizational term is the complete body formed by these **six digital functions**.

Four board principles are worth preserving over the long run:

> **Own your enterprise state.**  
> **Market traffic may be rented.**  
> **Business capabilities must be standardized.**  
> **Intelligent execution must be governed.**

This is the central upgrade from the earlier “four organs” to today’s “six digital functions”: **the end state of enterprise digitalization is not six software systems, but one enterprise that can be understood, accessed, called, and safely transacted with by customers, employees, platforms, and machines.**

The principal factual and theoretical source families behind this report include WIPO’s *World Intangible Investment Highlights 2026* for global intangible-capital trends; China’s 2026 Agent policy from the Cyberspace Administration, NDRC, and MIIT for capability, protocol, and governance directions; Ministry of Finance data-resource accounting rules and IFRS IAS 38/SIC-32 for the distinction between economic and accounting assets; Tencent materials on WeChat, Mini Programs, and WeCom for super-platform and private-domain analysis; Apple App Store ecosystem research for the long-term economic position of standalone apps; OpenAI materials on Agents, search, and MCP for machine discovery and machine calling; Alibaba’s 2026 Qwen/Taobao practice for real-world orchestration of existing digital ecosystems; and NBER research on digital capital, AI productivity, and the productivity J-curve for the economics of complementary organizational and technological capital.
