---
title: "A List Is a Snapshot: Curating Awesome ADE While GitHub's Star Signal Went Dark"
author: Stephane Busso
description: Building a curated list of Agentic Development Environments meant verifying a hundred repositories by hand — and discovering that the usual way of spotting what is rising on GitHub has quietly stopped working
published: true
tags:
  - agents
  - harness
  - claudecode
  - ai
updated: 2026-08-07T10:00
created: 2026-08-07T10:00
cover:
featured: false
---

I spent a day building [Awesome ADE](https://github.com/kyrolabs/awesome-ade), a curated list of open-source **Agentic Development Environments**. About a hundred entries, every one checked against the GitHub API for stars, last push, archive status and license.

The list is the smaller half of the story. The larger half is what the checking revealed: a category churning fast enough that a third of my first-pass candidates were already dead, renamed or abandoned — and no reliable way left to watch it happen in real time. The star signal that everyone still quotes has been broken for over a year.

Two things came out of that day. A list, and a renewed appreciation for why I built [GH Watch](https://github.com/sbusso/ghwatch). This post is about how they fit together.

## What an ADE actually is

An IDE assumes a human types and the machine completes. An ADE inverts it: an agent plans, edits files, runs terminal commands, manages git branches and fixes failing tests, while the human steers, reviews and merges.

That inversion changes which questions matter. Nobody building an ADE is optimising keystroke latency. They are answering:

- How many agents run at once — one session, or a dozen?
- Where do they run — local worktree, tmux pane, container, microVM, cloud?
- How are they isolated — can agent A break what agent B is building?
- How do I review — diffs, PRs, CI checks, human-in-the-loop gates?
- How do I steer from anywhere — terminal, desktop, browser, phone?

Almost every tool in the space sits on exactly one of five layers:

| Layer | What it does | Examples |
| --- | --- | --- |
| **Harness** | The agent loop: model calls, tool use, permissions | OpenCode, Codex CLI, Gemini CLI, Pi, Goose |
| **Orchestrator** | Runs many harnesses in parallel, tracks their state | Claude Squad, Emdash, Vibe Kanban, herdr |
| **Isolation** | Keeps parallel agents from stepping on each other | git worktrees, container-use, microsandbox, E2B |
| **Surface** | How a human watches and steers | agent-deck, Crystal, Happy, VibeTunnel |
| **Context** | What the agent knows: specs, skills, memory, tools | Spec Kit, AGENTS.md, Serena, MCP servers |

Knowing which layer you are missing is usually the fastest way to work out what to install next. Most people who feel stuck have a great harness and no isolation, so they run one agent at a time and call parallelism a myth.

## Packaging is the real taxonomy

I organised the list by packaging rather than by feature, because that is how the choice actually gets made. You do not pick an orchestrator on its merge-conflict strategy. You pick it because you live in a terminal, or because you want a diff on a second monitor, or because you want to check on a run from a train.

**Terminal and TUI.** [Claude Squad](https://github.com/smtg-ai/claude-squad) and [herdr](https://github.com/herdrdev/herdr) are the anchors here, with [ccmanager](https://github.com/kbwo/ccmanager) and [agent-deck](https://github.com/asheshgoplani/agent-deck) covering session management across worktrees. The pattern is consistent: a git worktree per task, a keyboard-driven switcher on top, and sessions that survive you closing the laptop.

**tmux-native.** This one surprised me by how strong it has become. AWS Labs shipped [cli-agent-orchestrator](https://github.com/awslabs/cli-agent-orchestrator), which coordinates Claude Code, Kiro and Codex inside isolated tmux sessions. [dmux](https://github.com/standardagents/dmux) pairs agents with worktrees over tmux, one pane per task. [amux](https://github.com/mixpeek/amux) is a single-file, tmux-native control plane that runs dozens of sessions and surfaces them on a web dashboard.

tmux keeps winning for boring, excellent reasons. Sessions survive disconnects. Panes are cheap. Everything is scriptable over SSH. An agent that runs for forty minutes needs a substrate that does not care whether you are attached, and tmux solved that problem in 2007. The tools that lean into it rather than reimplementing it ship faster and break less.

**Desktop.** [Emdash](https://github.com/generalaction/emdash) is the most complete of these — worktree per task, ticket ingestion from Linear, GitHub, Jira and GitLab, PR creation and CI review in one place, SSH to remote machines, local-first SQLite state. [Aperant](https://github.com/AndyMik90/Aperant) runs up to twelve agent terminals with an automated QA loop. [Crystal](https://github.com/stravu/crystal) keeps it narrow: parallel sessions, isolated worktrees, side-by-side diff review before merge. [Sculptor](https://github.com/imbue-ai/sculptor) puts each session in a container instead.

Desktop wins on review. Reading a fifteen-file diff in a TUI is possible and unpleasant.

**Web and self-hosted.** [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) turns the board into the interface — an agent per card. [gastown](https://github.com/gastownhall/gastown) scales to twenty or thirty concurrent agents with a coordinator and a merge queue. [OpenHands](https://github.com/OpenHands/OpenHands) gives each agent a browser, a terminal and an editor and lets you watch.

**Mobile and remote.** [Happy](https://github.com/slopus/happy) puts an end-to-end encrypted Claude Code client on your phone. [VibeTunnel](https://github.com/amantus-ai/vibetunnel) exposes any terminal session to a browser. [Omnara](https://github.com/omnara-ai/omnara) routes permission prompts to wherever you are.

This last category is the one I would have dismissed a year ago and now think is the leading indicator. When the interesting question becomes "did it finish and does the diff look right", the ADE stops being a place you sit and becomes a thing you check on.

## Isolation is the actual product

Everything above is a shell around one hard problem: two agents editing the same working tree corrupt each other's work, and you find out at merge time.

Git worktrees are the cheap answer and, for most people, the right one. One checkout per task, one branch per checkout, merge what survives. It costs disk and nothing else, and it is why nearly every tool in the list mentions worktrees in its first paragraph.

Containers and microVMs are the expensive answer, and they buy something worktrees cannot: the agent can run `rm -rf`, install packages, or execute untrusted generated code without touching your machine. [container-use](https://github.com/dagger/container-use) gives every agent its own container and branch. [microsandbox](https://github.com/superradcompany/microsandbox) does hardware-level isolation with near-instant startup. [E2B](https://github.com/e2b-dev/E2B) and [Daytona](https://github.com/daytonaio/daytona) do it in the cloud. Anthropic's [sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) applies OS-level filesystem and network restrictions to the agent's own process tree.

There is also a middle path worth knowing: [Greywall](https://github.com/GreyhavenHQ/greywall), a deny-by-default command sandbox with a transparent network proxy, built-in profiles for Claude Code and OpenCode, and a learning mode that generates the config by watching you work. Cheaper than a container, stronger than trust.

Pick worktrees if your agents write code. Pick containers if your agents run code they wrote.

## What curation surfaced

Here is where it got interesting. My method was unglamorous: assemble candidates from search, existing lists and my own use, then hit `/repos/{owner}/{repo}` for each one and read stars, `pushed_at`, `archived` and `license`. Reject anything archived, anything with no commits in six months, anything without a license, anything under roughly fifty stars.

Roughly a third of the candidate list failed.

**Repositories had moved.** Not redirects I knew about — moves I only found because the API resolved a different `full_name` than the one I asked for. OpenCode now lives under `anomalyco/opencode`. Goose under `aaif-goose/goose`. Pi under `earendil-works/pi`. Claude Flow is now `ruvnet/ruflo`. herdr moved to `herdrdev/herdr`. These are not obscure projects — OpenCode is at 194k stars, Pi at 85k. Every blog post, every shields.io badge and every existing awesome list pointing at the old paths still renders, because GitHub redirects. The star badges quietly count the wrong thing or nothing at all.

**Projects had died mid-flight.** Roo Code, archived at 24k stars. Void, archived at 29k. 1code, archived at 5.6k. Plandex, last pushed ten months ago at 15.5k stars. These all still look alive if you glance at the star count, which is exactly what a star count invites you to do.

**Six months is a brutal filter in this category.** Applying it honestly cost me entries I wanted to keep, including ByteDance's trae-agent at 12k stars, last pushed six months and two days ago. Rules you bend for your favourites are not rules.

None of this is a complaint about the projects. It is what a category looks like at maximum velocity: forks that overtake origins, teams that get acquired and rename the org, weekend projects that hit 20k stars and then stop. The problem is not the churn. The problem is that the instrument everyone uses to observe it is broken.

## The star signal has been broken since May 2025

I know this because I built a pipeline on top of it.

GH Watch ingests [GH Archive](https://www.gharchive.org/), the hourly dump of GitHub's public event stream, into ClickHouse and ranks repositories by star velocity. It was meant to be a self-hosted successor to Changelog Nightly, which stopped publishing in early 2026.

The upstream capture broke on **2025-05-24**, and it is visible to the day in my own data:

| date | stars captured |
| --- | ---: |
| 2025-05-22 | 196,762 |
| 2025-05-23 | 179,954 |
| **2025-05-24** | **122,219** |

The [root cause](https://github.com/igrigorik/gharchive.org/pull/317) is mundane. The crawler's page limit was cut from 500 to 100 to satisfy a GitHub API requirement, but it still fetches a single page per polling cycle — so roughly 80% of each cycle's events are never collected. It was [reported in July 2025](https://github.com/igrigorik/gharchive.org/issues/310), [quantified in May 2026](https://github.com/igrigorik/gharchive.org/issues/320) at under 20% capture, and the fix has been open and unmerged since February 2026.

Then it got worse. Sampling the archive directly and counting every event type shows that it is specifically *user-attributed* events that vanish while machine traffic keeps growing:

| | 2026-03-01 | 2026-07-22 |
| --- | ---: | ---: |
| PushEvent | 121,103 | **166,950** |
| total events | 160,422 | **173,986** |
| stars | 3,017 | **23** |
| pull requests | 9,770 | **108** |
| issue comments | 3,474 | **52** |
| **human share of feed** | **10.14%** | **0.11%** |

Twenty-three stars in a day, globally. The public record of human activity on GitHub has effectively gone to zero, while push volume — increasingly machine-generated, which is its own story — went up.

I verified this was not my bug before believing it: stored counts match a direct read of the same hour-files exactly, across four sampled hours in January, April, June and July 2026.

Both obvious workarounds are also dead. Running the crawler yourself does not help — `/events` is capped at three pages of a hundred, all covering the same four seconds, with a sixty-second poll interval, so two compliant sweeps share zero events. And GitHub restricted the per-repo stargazers endpoint and the GraphQL `stargazers` connection to admins and collaborators on **2026-06-30**. That door closed for everyone.

## What you can still measure

One thing survives: `stargazerCount`, a plain scalar on the GraphQL repository object. A hundred repositories resolve for one rate-limit point — I measured 428,239 repos/hour on a single token — and GitHub's entire universe of repositories with 100 or more stars is 469,412. The whole population fits in an hourly sweep.

So GH Watch stopped being an event pipeline and became a counting one:

| layer | source | property |
| --- | --- | --- |
| discovery | Search, one slice per creation-day | complete enumeration, not a sample |
| velocity | GraphQL `stargazerCount` | exact counts, `Δcount / Δt` |
| intent | mentions on HN, Reddit, X | why it is rising |

Discovery is keyed on **creation-day**, not recency, and that detail is load-bearing. Measured against this corpus, only 11–16% of repositories reach their tenth star within a day of being created. The median takes 19–45 days; the 90th percentile runs 118 to 259 days. A "created this week" window — the intuitive design — would miss most of what you actually want to find.

Counting instead of streaming costs something real, and it is worth naming. There is no `actor_id` on a scalar, so the distinct-actor filter that catches bot rings cannot be computed for new data by any route. Counts also move *down* when people unstar, which an event stream never showed, so velocity is computed with `argMin`/`argMax` over time rather than over value.

## The list and the radar

These are two answers to the same problem, and neither one is sufficient.

**A curated list is an editorial snapshot.** It carries judgement — this tool is worth your evening, this one is a demo — and it carries verification, because I checked every entry on the day I published. It also starts decaying immediately. Awesome ADE is accurate as of 7 August 2026 and will need a sweep in three months, at which point some of those hundred entries will have moved, archived or stalled.

**A velocity radar is a live signal with no taste.** It will tell you a repository went from 400 to 3,000 stars this week. It will not tell you whether it is an ADE, whether it is maintained, or whether it duplicates three things you already have.

Used together they close each other's gap. The radar surfaces candidates; the list applies the filter. That is, concretely, how the next revision of Awesome ADE gets built — and why GH Watch ships a [4 KB embeddable widget](https://github.com/sbusso/ghwatch#widget) that inherits the host page's typography, so a live board can sit next to a curated one on this site without either pretending to be the other.

If there is a general lesson, it is this: **when the shared instrument breaks, curation stops being a nice-to-have and becomes infrastructure.** For most of GitHub's history, "sort by stars this week" was a good enough answer to "what is new". That has not been true since May 2025, and almost nobody has noticed, because the number on the badge still renders.

Awesome ADE lives at [github.com/kyrolabs/awesome-ade](https://github.com/kyrolabs/awesome-ade) — a hundred verified tools, a five-layer map, and a comparison matrix of twenty-three orchestrators covering packaging, isolation model and how many agents each can actually run at once. PRs welcome; the contribution bar is in the repo, and it is the same bar every current entry had to clear.
