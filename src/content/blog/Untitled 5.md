---
title: "From Conductor to Orchestrator: A Practical Guide to Multi-Agent Coding in 2026"
author: Stephane Busso
description: The complete landscape of multi-agent coding orchestration — from Claude Code Agent Teams to Oh My OpenAgent, the Ralph Loop pattern, and how to choose the right tier for your workflow
published: true
tags:
  - claude
  - agents
  - harness
updated: 2026-04-04T13:55
created: 2026-04-04T13:55
cover:
featured: true
---
Six months ago, most of us worked with a single AI coding assistant in a tight synchronous loop. You typed a prompt, waited, reviewed the output, gave feedback, repeated. Your ceiling was whatever fit in that single context window. The conversation thread was your workspace.

That model is being replaced. The most productive developers are now coordinating multiple agents running asynchronously — each with its own context window, its own file scope, its own area of responsibility — while the developer orchestrates from above. The codebase becomes your canvas, not a conversation thread.

This is the shift from being a **conductor** (one musician, real-time guidance) to being an **orchestrator** (an entire ensemble, asynchronous coordination).
![From Conductor to Orchestrator — the fundamental shift in AI-assisted development.png](/assets/From%20Conductor%20to%20Orchestrator%20%E2%80%94%20the%20fundamental%20shift%20in%20AI-assisted%20development.png)

I've been exploring this space intensively over the past few months — building [ClaudeClaw](https://sbusso.github.io/claudeclaw/), evaluating orchestration tools, and preparing our team's first AI hackathon. This guide captures what I've learned about the current landscape, the key patterns, and how to choose the right approach for different projects.

---

## Why Multi-Agent?

Every developer eventually hits three walls with a single agent.

**Context overload.** One agent can only hold so much information. Large codebases overwhelm a single context window. You lose important details as the conversation grows longer.

**No specialization.** One agent doing everything — data layer, API, UI, tests — is a jack of all trades and master of none. A focused agent that only handles the data layer writes significantly better database code than a generalist juggling your entire codebase.

**No coordination.** Even if you spawn helpers, they can't communicate, share a task list, or resolve dependencies without coordination primitives.

Three focused agents consistently outperform one generalist agent working three times as long. The gains are multiplicative, not additive: parallelism (3x throughput), specialization (focused context), isolation (git worktrees prevent conflicts), and compound learning (an AGENTS.md file accumulates patterns across sessions).

---

## The Three-Tier Model

Every orchestration tool in 2026 fits one of three tiers. The smartest developers use all three depending on the task at hand.
![The Three-Tier Model.png](/assets/The%20Three-Tier%20Model.png)

### Tier 1: In-Process Agents

Single terminal session, no extra tooling needed. **Start here.**

You're still at the keyboard, guiding the work. The agents are subprocesses within your main session — subagents, agent teams, or plugin-managed specialists. Tools in this tier include Claude Code subagents, Agent Teams, OMC (oh-my-claudecode), and Pi extensions.

Best for interactive pair programming, quick feature branches, and 1-3 focused agents.

### Tier 2: Local Orchestrators

Your machine spawns multiple agents in isolated worktrees. You stay in the loop with dashboards, diff review, and merge control. Best for 3-10 agents on known codebases.

Tools include [Conductor](https://conductor.dev/) (Melty Labs), [Claude Squad](https://github.com/smtg-ai/claude-squad), [Parallel Code](https://github.com/johannesjo/parallel-code), [OpenCode](https://opencode.ai/) + Oh My OpenAgent (Sisyphus), [Vibe Kanban](https://vibekanban.com/), and Google Antigravity's Mission Control.

This is where the "check in periodically" workflow starts. You decompose work, assign it, and review results rather than writing code yourself.

### Tier 3: Cloud Async

Assign a task, close your laptop, return to a pull request. Agents run in cloud VMs. No terminal, no local setup.

Tools include Claude Code Web (at `claude.ai/code`), GitHub Copilot Coding Agent (assign issues to `@copilot`), OpenAI Codex Web, Jules (Google), and Cursor Glass.

This is the "ship while you sleep" tier. Most developers in 2026 will use Tier 1 for interactive work, Tier 2 for parallel sprints, and Tier 3 to drain the backlog overnight.

---

## The Key Players — Detailed Breakdown

### The "Oh My" Ecosystem

The naming here gets confusing. It's all from the same creator ([Yeachan Heo](https://github.com/Yeachan-Heo)) and collaborators, but each targets a different runtime:

|Tool|Abbrev.|Runtime|What It Does|
|---|---|---|---|
|[oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) (OmX)|OmX|OpenAI Codex CLI|Workflow keywords (`$team`, `$ralph`, `$architect`). Built the claw-code rewrite.|
|[oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) (OmO)|OmO / Sisyphus|OpenCode (Go)|Full 11-agent orchestration plugin. Multi-model routing. Most mature.|
|[oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) (OMC)|OMC|Claude Code|Teams-first orchestration plugin for Claude Code. 19+ specialized agents, 40+ skills.|

If you're already using Claude Code, **OMC is your on-ramp.** Install and run:

```bash
# In Claude Code
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
/oh-my-claudecode:omc-setup
```

Then just describe what you want: "Build me a REST API" — that's it. OMC detects your intent and orchestrates agents automatically. Say "fast" for parallelism. Say "don't stop" for persistence. The key modes:

- **Autopilot** — full autonomous execution from idea to tested code
- **Ralph** — self-referential loop until verified complete
- **Ralplan** — Socratic planning before execution (exposes hidden assumptions)
- **Ultrapilot** — up to 5 concurrent workers for maximum parallelism

What's particularly smart is the **skill learning system**: OMC extracts debugging knowledge into portable skill files that auto-inject when similar patterns appear in future sessions.

### Oh My OpenAgent (Sisyphus) — The Multi-Model Powerhouse

OmO is the most architecturally ambitious of the three. It transforms [OpenCode](https://opencode.ai/) into a full multi-agent engineering system with 11 specialized agents:

- **Sisyphus** — main orchestrator (Claude Opus / Kimi K2.5)
- **Hephaestus** — deep technical worker (GPT-5.4)
- **Prometheus** — strategic planner with interview-style workflow
- **Atlas** — todo-list-driven execution
- **Oracle** — architecture reviewer
- **Junior** — the actual code writer, spawned per task category

The key insight is **multi-model routing**: Claude for orchestration (its ~1,100-line prompt needs strong instruction-following), GPT for deep reasoning, Gemini for frontend, cheap models for routine tasks. You can even route utility agents (explore, librarian) to local models via Ollama while keeping orchestration on cloud providers.

A practical hybrid config:

```jsonc
{
  "agents": {
    "explore": { "model": "ollama/qwen2.5-coder:7b" },
    "librarian": { "model": "ollama/qwen2.5-coder:7b" },
    "oracle": { "model": "openai/gpt-5.4", "variant": "high" },
    "sisyphus": { "model": "anthropic/claude-opus-4-6", "variant": "max" }
  },
  "categories": {
    "quick": { "model": "opencode/gpt-5-nano" },
    "unspecified-high": { "model": "anthropic/claude-opus-4-6" }
  }
}
```

**Cost warning:** The creator mentions spending $24K in LLM tokens on personal projects. This is a heavy-consumption setup. Route carefully.

### Claude Code Agent Teams — The Native Path

This is Anthropic's built-in approach, introduced as a research preview in v2.1.32 (February 2026). No plugins needed.

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

The architecture has three layers: **Team Lead** (your main session) → **Shared Task List** (with dependency tracking and file locking) → **Teammates** (independent Claude instances in tmux panes).

Teammates self-claim tasks from the shared list. They message each other directly — peer-to-peer, not through the lead. When a teammate marks a task complete, blocked tasks auto-unblock. Press `Ctrl+T` to toggle a visual overlay of the task list.

The key question for choosing between subagents and Agent Teams: **do your workers need to communicate with each other?** Use subagents for quick, focused workers that report back. Use Agent Teams when teammates need to share findings, challenge each other, and coordinate autonomously.

### OpenCode — The Open-Source Runtime

OpenCode is a Go-based CLI coding agent with 120K+ GitHub stars and support for 75+ LLM providers. It's the runtime that Oh My OpenAgent plugs into. Provider-agnostic, free, you pay only API costs.

Important caveat: Anthropic blocked OpenCode from using Claude models via OAuth in January 2026. You need direct API keys. Most users run it with GPT, Gemini, Kimi, or local models.

### Pi (pi.dev) — The Minimalist Philosophy

Pi is a deliberately minimal terminal coding harness by Mario Zechner (creator of libGDX). Four built-in tools (read, write, edit, bash), a ~300-word system prompt, and everything else is opt-in via TypeScript extensions.

The philosophy: "Frontier models have been RL-trained up the wazoo — they inherently understand what a coding agent is." Trust the model, keep the harness small. No MCP, no built-in sub-agents, no plan mode — you build those yourself or install packages.

Where Pi excels: maximum context budget (tiny system prompt leaves more room for your code), full observability (no black-box sub-agents), and extensibility. It also has [oh-my-pi](https://github.com/can1357/oh-my-pi), a community fork adding LSP, subagents, Python cells, and 40+ language configs.

The Pi vs Claude Code SDK comparison I wrote in [a previous post](https://claude.ai/posts/pi-ai-sdk-vs-anthropic-claude-agent-sdk) captures the tension: Claude Code is "Rails" — opinionated, structured, best practices baked in. Pi is "Arch Linux" — smallest kernel, greatest freedom.

### Forge Orchestrator — Multi-Tool Coordination

[Forge Orchestrator](https://github.com/nxtg-ai/forge-orchestrator) solves a specific problem: when Claude Code, Codex CLI, and Gemini CLI all work on the same repo with no shared state. It's a single Rust binary (~3 MB) that adds file locking, knowledge capture, task planning, and drift detection.

The killer feature is **cross-tool knowledge persistence**: knowledge captured during a Claude Code session is available to Codex CLI the next day. After a week, the system knows your conventions better than you remember them.

### Agent Orchestrator (Composio) — Fleet Management

[Agent Orchestrator](https://github.com/ComposioHQ/agent-orchestrator) manages fleets of coding agents in parallel. Each agent gets its own git worktree, branch, and PR. When CI fails, the agent fixes it. When reviewers leave comments, the agent addresses them. Agent-agnostic (Claude Code, Codex, Aider), runtime-agnostic (tmux, Docker), tracker-agnostic (GitHub, Linear).

---

## The Patterns That Matter

### The Architect-Executor-Reviewer Loop

The most common coordination pattern across all orchestration tools:

![The Architect-Executor-Reviewer agent coordination loop.png](/assets/The%20Architect-Executor-Reviewer%20agent%20coordination%20loop.png)

1. **Architect** reads the directive, analyzes the system, produces a plan with sequenced steps
2. **Executor** picks up the plan, writes code, runs tools, generates tests
3. **Reviewer** inspects output, catches problems, sends feedback
4. If feedback is serious, the loop returns to the Architect for re-planning
5. The cycle repeats until output passes all checks

The human's interface might be a Discord channel, a Slack message, or a terminal prompt. The agents file updates to the notification channel. If something is blocked, they mention the developer. If nothing is blocked, they keep going.

This is the pattern behind the [claw-code](https://github.com/instructkr/claw-code) story — a developer typed ten sentences into Discord and woke up to a working codebase port that crossed 100K GitHub stars.

### The Ralph Loop

This is the single most important pattern to understand, and it's tool-agnostic:
![The Ralph Loop  stateless-but-iterative agent execution.png](/assets/The%20Ralph%20Loop%20%20stateless-but-iterative%20agent%20execution.png)
1. **Pick** — select the next task from `tasks.json`
2. **Implement** — make the change
3. **Validate** — run tests, types, lint
4. **Commit** — if checks pass, commit and update task status
5. **Reset** — clear the agent context and start fresh with the next task

The key insight is **stateless-but-iterative**. By resetting context each iteration, the agent avoids accumulating confusion. Small bounded tasks produce cleaner code with fewer hallucinations than one enormous prompt.

Safeguards that make it reliable: feed errors back for auto-retry, but kill and reassign after 3+ stuck iterations. A dedicated reviewer agent catches issues before they compound.

Popularized by Geoffrey Huntley and Ryan Carson, the Ralph Loop is implemented natively in OMC (`ralph` keyword), OmO (`/ralph-loop`), and OmX (`$ralph`). But you can implement it with any tool — even a bash script wrapping Claude Code in a loop.

### Worktree Isolation

Git worktrees are the foundation of every Tier 2 tool. Each agent gets its own working directory with its own branch. No merge conflicts during parallel work.

Since Claude Code v2.1.49, worktree support is native:

```bash
# Start Claude in an isolated worktree
claude --worktree feature-auth

# Start another session in a separate worktree
claude --worktree bugfix-123

# Or configure agents to always use worktrees
# In .claude/agents/refactor-agent.md:
# ---
# name: refactor-agent
# isolation: worktree
# ---
```

When agents finish, worktrees with no changes auto-clean. Worktrees with changes persist for your review. This mirrors real development teams: developers work on separate branches, PRs are reviewed, and changes merge to main.

### AGENTS.md as Compound Memory

Research from ETH Zurich (Gloaguen et al.) has shown that **LLM-generated AGENTS.md files offer no benefit** and can marginally reduce success rates (~3% on average) while increasing inference costs by over 20%. Developer-written context files provide a modest ~4% improvement.

The rule: never let an agent write to `AGENTS.md` directly. The lead must approve every line. Keep it shorter with clear sections:

```markdown
## STYLE
- Use functional components with hooks
- Prefer named exports

## GOTCHAS
- SQLite requires WAL mode for concurrent reads
- Cloudflare Workers have 128MB memory limit
- D1 transactions are not yet supported

## ARCH_DECISIONS
- All state in D1, no in-memory caches
- Hono for API routing, Zod for validation
- One route file per feature module

## TEST_STRATEGY
- Integration tests over unit tests for API routes
- Use Miniflare for local Workers testing
```

---

## Comparison Matrix

|Criterion|Claude Code Agent Teams|OMC (on Claude Code)|OmO/Sisyphus (on OpenCode)|Forge Orchestrator|
|---|---|---|---|---|
|**Setup complexity**|Low (env var)|Medium (plugin)|Medium-High (config)|Medium (Rust binary)|
|**Multi-model routing**|No (Claude only)|Yes (Claude + Codex + Gemini)|Yes (any provider)|N/A (tool-agnostic layer)|
|**Cost**|Claude tokens only|Smart routing saves 30-50%|Pay-per-provider|Free layer on top|
|**Agent count**|3-5 recommended|Up to 5 (Ultrapilot)|11 built-in roles|N/A|
|**Learning persistence**|AGENTS.md (manual)|Skill learning (automatic)|Notepad system (automatic)|Knowledge base (automatic)|
|**Best for**|Native Claude users|Claude power users|Multi-provider maximalists|Multi-tool coordination|
|**Maturity**|Research preview|v4.9+ (active)|Very active, large community|Early but solid|

---

## The Tools I Didn't Cover (But Should Be On Your Radar)

- **[Conductor](https://conductor.dev/)** (Melty Labs) — fastest way to start multi-agent orchestration on Mac. Visual dashboard, diff-first review UI, free.
- **[Vibe Kanban](https://vibekanban.com/)** — Kanban board where each card is an agent task. Cross-platform (Mac, Windows, Linux). Solves the "doomscrolling gap" while agents work.
- **[Claw Empire](https://github.com/GreenSheep01201/claw-empire)** — pixel-art "virtual office" that orchestrates CLI agents as company employees. Fun but functional.
- **Google Antigravity** — agent-first IDE with Mission Control (Cmd+E). Up to ~5 concurrent agents, built-in browser for live testing. In early 2026, adopted Claude Code's skill standard for cross-platform compatibility.
- **[Cursor Glass](https://cursor.com/agents)** — Cursor's new interface making agent management the primary surface. Kick off agents from web, Slack, Linear, GitHub, or phone.
- **[Stoneforge](https://stoneforge.ai/)** — structured documentation to cut agent codebase orientation from 20 tool calls to 3.

---

## Quality Gates: Trust But Verify

The bottleneck is no longer generation. It's **verification**. Agents can produce impressive output at incredible speed. Knowing with confidence whether that output is correct is the hard part.

Three quality gates that make agent output trustworthy:

**Plan approval.** Require teammates to write a plan before coding. The lead reviews the approach and approves or rejects. It's far cheaper to fix a bad plan than to fix bad code.

**Hooks.** Automated checks on lifecycle events. A `TaskCompleted` hook runs lint and tests before marking a task as done. If the hook fails, the agent keeps working until it passes.

**Dedicated reviewer agent.** Spawn a permanent reviewer with read-only tools (lint, test, security-scan). 1 reviewer per 3-4 builders. The lead only ever sees green-reviewed code.

---

## What This Means (The Philosophical Bit)

The article that brought claw-code to mainstream attention argued that "the code is a byproduct" — what matters is the coordination system that produced it. I agree, but I'd push it further.

**The orchestration setup is also a byproduct.** The real product is a developer's ability to think clearly about what needs to be built, decompose it into parallelizable tasks, and write good AGENTS.md files. That's architectural clarity, task decomposition, and system design — the skills that get more valuable as agents get stronger.

A faster agent does not reduce the need for clear thinking. It increases it. A badly directed team of fast agents will produce a lot of wrong code very quickly.

When intelligence becomes a commodity, what remains expensive is conviction about what is worth building. The ability to look at a problem and know which parts matter and which parts are noise. The patience to design systems that work correctly even when no one is watching.

---

## Getting Started — My Recommended Path

**Week 1: Enable and experiment.**

```bash
# Enable Agent Teams
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Write an AGENTS.md for your main project
# Keep it short, human-written, opinionated

# Try a simple parallel task:
# "Create a 3-person agent team: backend API, frontend UI, and tests"
```

**Week 2: Install OMC** and try autopilot mode on a real feature. Compare the output quality and token cost against manual development.

**Week 3: Set up OpenCode + OmO** on a secondary machine (Mac mini, build server). Configure multi-model routing with local models for utility agents. Try `ulw` (ultrawork) on a medium-sized task.

**Week 4: Adopt the Ralph Loop** for your backlog. Break a feature into 8-10 atomic tasks in `tasks.json`. Let agents loop through them overnight. Review the commits in the morning.

The gap between "uses Claude Code" and "orchestrates Claude Code teams" is widening. The developers who build muscle memory with agent orchestration now will have a serious edge as these tools mature.

---

## References

- [Addy Osmani — The Code Agent Orchestra](https://addyosmani.com/blog/code-agent-orchestra/) — O'Reilly AI CodeCon talk writeup, the most comprehensive overview of the landscape
- [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) — Teams-first multi-agent orchestration for Claude Code
- [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) — Full multi-agent harness for OpenCode
- [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex) — Workflow layer for Codex CLI
- [clawhip](https://github.com/Yeachan-Heo/clawhip) — Event-to-channel notification router
- [Forge Orchestrator](https://github.com/nxtg-ai/forge-orchestrator) — Multi-AI task orchestration with file locking and knowledge capture
- [Agent Orchestrator](https://github.com/ComposioHQ/agent-orchestrator) — Fleet management for parallel coding agents
- [Pi coding agent](https://github.com/badlogic/pi-mono) — Minimal terminal coding harness
- [OpenCode](https://opencode.ai/) — Open-source Go CLI coding agent
- [Claude Code Agent Teams docs](https://code.claude.com/docs/en/common-workflows) — Official Anthropic documentation
- [claw-code](https://github.com/instructkr/claw-code) — The showcase that started the conversation