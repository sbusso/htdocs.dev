---
title: "Personal Agentic OS: who will own the personal knowledge layer?"
author: Stephane Busso
description: "Frontier models are converging into commodities; your accumulated context is the one input nobody else has. The personal knowledge stack now exists — format, capture, sync, protocol — except for the one layer nobody has an incentive to standardize: governance. It's the last moat left, and whoever owns it owns the model of you."
published: true
tags:
  - paos
  - agent
  - os
updated: 2026-07-13T10:04
created: 2026-07-13T10:04
cover:
---
1984 gave us the personal computer. 1994 connected them. 2007 put one in every pocket and handed our attention to social platforms. 2022 started something we're still mislabeling as "chatbots."

What's actually forming is a new stratum of personal computing, and it splits in two. The visible half is the personal AI: the cognitive layer, the thing that answers, drafts, plans. The invisible half is the personal knowledge layer: the substrate of context that makes one person's AI meaningfully different from another's. Everyone is looking at the first. The second is where the next decade gets decided, because frontier models are converging into commodities while your accumulated context is the one input nobody else has.

The problem is that we've been here before, and it went badly.

## Twenty years of PKM proved one thing

Evernote, Roam, Obsidian, Notion. Two decades of "second brain" tooling produced a durable finding: almost nobody maintains one. Manual knowledge management is a chore, and the population willing to pay that chore-tax is a rounding error. Notion built a great structured workspace and users still experience the structuring itself as work. The lesson isn't that personal knowledge has no value. It's that the human cannot be the ingestion pipeline.

LLMs invert the loop. Instead of humans capturing so machines can read, agents capture so humans can govern. Your email, calendar, meetings, chat history, and reading already contain a decent model of who you are and what you're doing. What was missing was a universal consumer for that corpus. Now there is one: any LLM can read a folder of markdown. That single fact is why personal data stores failed for fifteen years (Solid never found a consumer for its pods) and why the same idea is suddenly viable.

## What actually shipped in 2026

The past six months have been unusually dense. A quick tour, bottom of the stack to the top.

**The format converged.** Andrej Karpathy's "LLM wiki" setup early this year — a persistent base of interlinked markdown files that an agent builds and maintains, deliberately plain-text to avoid vendor lock-in — acted as a catalyst more than an invention. Within a quarter, Google Cloud published the [Open Knowledge Format](https://github.com/GoogleCloudPlatform/okf) (OKF): markdown files with YAML frontmatter, no SDK, no runtime, cross-links as the knowledge graph. OKF is aimed at enterprise knowledge (schemas, runbooks), but it formalizes the pattern: knowledge compiled once and maintained, rather than re-derived from raw sources on every query the way RAG does.

**Capture went passive.** [Rowboat](https://github.com/rowboatlabs/rowboat) (YC-backed, Apache-2.0, 13k+ stars in months) is the clearest signal. It connects Gmail, calendar, Slack, and meeting transcripts, and grows an Obsidian-compatible markdown vault organized by entities — people, projects, organizations — where each decision and commitment becomes its own backlinked file. It only creates an entity once enough evidence accumulates, which is a small design choice that matters: unguarded ingestion turns a vault into a landfill. Rowboat positions itself explicitly against renting a closed memory silo, which tells you the sovereignty framing has become a commercial wedge, not just an ideology.

**Editing went agent-native.** [Tolaria](https://github.com/refactoringhq/tolaria) (from Luca Rossi of Refactoring, AGPL) takes the opposite entry point: vault first, agents on top. Plain markdown with optional frontmatter, every vault a git repo, an MCP server exposing vault operations, and an `AGENTS.md` file per vault that tells any coding agent how the vault is structured and how to behave in it. Two of its choices deserve to outlive it: writes hit disk before UI state, and types are "lenses, not schemas" — navigation aids without validation. That's the right amount of structure for knowledge that has to survive format churn.

**Governance got prototyped.** [Row-Bot](https://github.com/siddsachar/row-bot) (no relation to Rowboat) is a local assistant whose interesting part is its memory discipline: typed entities and relations, provenance tracking, review states, and a scheduled "dream cycle" that merges duplicates, decays confidence, and infers relations. This is the least glamorous layer and the one everybody else hand-waves: what happens to knowledge after capture. Who resolved the contradiction between what you believed in 2019 and what you believe now? What gets forgotten, and on whose authority?

**The comfort tier exists.** [Khoj](https://github.com/khoj-ai/khoj) has run the local/cloud/hybrid model for a while: fully self-hostable, or hosted if you'd rather not operate infrastructure. [sqlite-memory](https://github.com/sqliteai/sqlite-memory) sketches the sync answer: markdown as source of truth, embeddings computed on-device, CRDT sync that moves only portable content. Local-first with optional convenience is a solved pattern — Obsidian has been a profitable business on exactly that shape for years.

**And upstream, the extraction fight.** [Surfer Protocol](https://github.com/Surfer-Org/Protocol) open-sources data export from siloed platforms. Fabric's [context-use](https://onfabric.substack.com/p/context-use-turn-your-data-exports) converts platform exports (ChatGPT, Instagram, Google) into portable context with per-agent scopes, and the company has worked with Google on the Data Portability API since its first version. Koodos named the whole category "[personal context infrastructure](https://blog.koodos.com/p/personal-context-infrastructure)". The [Data Transfer Initiative](https://dtinit.org/) is building the trust and policy scaffolding, with the DMA review and US state laws like Utah's Digital Choice Act pushing in the same direction. Portability is becoming a regulatory expectation at exactly the moment it becomes technically meaningful.

## Six layers, one hole

Lay the projects out and a stack appears:

1. **Capture** — getting data out of silos, plus lightweight deliberate input (read-later, journaling, voice). Surfer, Fabric, Rowboat's connectors.
2. **Substrate** — where knowledge lives. Markdown + frontmatter + git + backlinks. OKF, Tolaria, Obsidian.
3. **Governance** — consolidation, provenance, contradiction resolution, selective forgetting, write control. Row-Bot's dream cycle, Rowboat's evidence thresholds. All private, all incompatible.
4. **Cognition** — the agents that read and write the substrate. Any model, increasingly via coding-agent CLIs.
5. **Interop** — how third-party AIs plug in. MCP has effectively won this; `AGENTS.md` is emerging as the vault-level convention.
6. **Comfort** — sync, hosting, sharing. CRDTs, git remotes, hosted opt-in.

Layers 1, 2, 4, 5, and 6 all have credible open implementations, and several have more than one. Layer 3 has zero specifications. Every serious project implements governance internally — entity thresholds, review states, confidence decay — and none of them publishes it as a contract another tool could honor. Your Rowboat graph doesn't carry its provenance semantics into Tolaria. There is no portable answer to "which writes are trusted, how conflicts resolve, what may be forgotten."

That's not an accident. Governance is the layer that determines lock-in. A capture tool benefits from open formats (it wants to write anywhere). An assistant benefits from open substrates (it wants to read everything). But whoever controls consolidation — the process that turns raw capture into the canonical model of you — controls the product de facto, regardless of how open the files underneath are. If the distillation logic is proprietary, owning your markdown is like owning your database files without the schema migrations: technically yours, practically stranded. No funded company has an incentive to standardize this layer first, because it's the only moat left once the format and the protocol are commodities.

Which is precisely why it's the layer worth specifying independently. The historical pattern is consistent: durable personal-computing standards (SMTP, HTML, RSS, git) came from conventions and reference implementations, not from products, and businesses grew around them afterward. A "governed personal vault" spec would be small — an OKF-compatible directory structure, a write-ledger convention describing who wrote what under which authority, provenance and review-state frontmatter, scope declarations for agent access, and an export contract. Every piece has prior art in one of the projects above. The assembly doesn't exist.

## The default path and the exit

The platforms are shipping the comfortable alternative: built-in memory inside ChatGPT, Gemini, and Claude — free, invisible, and non-portable by design. Memory is their retention moat, and they will subsidize it forever. Most people will take the silo, the way most people took Gmail over running a mail server.

That's fine. Sovereignty infrastructure has always started with a minority — self-hosting, E2E encryption, password managers — and mattered anyway, because it kept an exit open. Niches occasionally flip when an external shock (a breach, a policy change, a regulation) makes portability suddenly legible to everyone. When that happens, the difference between a niche and a migration is whether a proven, documented standard already exists.

And the alternative to a neutral spec isn't no spec. It's an implicit one: whichever vault layout wins adoption carries its governance semantics with it, unspecified and unexamined, the way Word's .doc format once defined what a document was. The pieces for doing it deliberately are all on the table — a format (OKF), a protocol (MCP), a convention (`AGENTS.md`), a sync model (CRDT over portable content), and half a dozen working governance prototypes to steal ideas from. What's missing is someone with no lock-in that would prevent writing it down.

The personal computer era was defined by who owned the machine. The web era by who owned the network. The social era by who owned the graph. This one will be defined by who owns the model of you — and unlike the previous three, the answer is still genuinely open.