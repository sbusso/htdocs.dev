---
title: "The claw-code Story: What's the Harness?"
author: Stephane Busso
description: The architecture behind the most important leak of AI history, and probably the inflexion point for agent orchestration
published: true
tags:
  - claude
  - orchestration
  - harness
updated: 2026-04-04T15:05
created: 2026-04-04T15:05
cover:
---
## The claw-code Story: What Was the Harness?

On March 31, 2026, Anthropic accidentally shipped a source map file in Claude Code's npm package (v2.1.88), exposing ~512,000 lines of TypeScript across ~1,900 files — the full agent harness architecture, tool system, multi-agent orchestration logic, and 44 unreleased feature flags.

Within hours, developer Sigrid Jin (@sigridjineth) — a Korean developer who'd consumed over 25 billion Claude Code tokens — began a **clean-room Python rewrite** of the core agent harness architecture. The repo crossed 100K GitHub stars faster than any repository in GitHub history.

But the interesting part isn't the Python files. It's the **three-tool coordination system** that produced them.

## The Three Tools Wired Together

### 1. oh-my-codex (OmX) — The Workflow Layer

OmX sits on top of OpenAI's Codex CLI and provides reusable workflow keywords:

- **`$architect`** — analysis and planning mode
- **`$executor`** — implementation mode
- **`$plan`** — structured planning output
- **`$ralph`** — persistent execution loop that keeps going until the task is verified complete
- **`$team`** — coordinates multiple agents working in parallel on the same problem

When the developer typed `$team "implement the core runtime"` in Discord, OmX turned that single sentence into a structured multi-step workflow and assigned it out to multiple agents.

### 2. clawhip — The Event Router (Daemon)

This is the piece most people miss and the smartest design decision. clawhip runs as a background daemon watching:

- Git commits
- GitHub issues and PRs
- tmux sessions
- Agent lifecycle events

It sends status updates to the right Discord channel. The critical design choice: **all monitoring stays outside the agent's context window.** An agent deep in a complex implementation task doesn't need its limited memory filled with notification logic and message formatting. clawhip owns the delivery so the agents can focus on code.

This is the same pattern you already have with NanoClaw/ClaudeClaw — keeping the adapter layer separate from the agent's working context.

### 3. oh-my-openagent (OmO) — The Coordination Logic

When the Architect agent's plan conflicted with what the Executor agent built, OmO managed that disagreement. It handles information sharing between agents, task handoffs, and output verification loops.

## The Actual Workflow (Discord as Interface)

Here's what the developer actually did:

1. Opened Discord on his phone
2. Typed a sentence describing what to build
3. Put the phone down and went to sleep

The agents then:

1. **Architect** read the directive, analyzed the target system's structure, wrote out a sequence of steps
2. **Executor** picked up the plan, wrote code, ran tools, generated tests
3. **Reviewer** inspected output, caught problems, sent feedback
4. If feedback was serious → loop back to Architect for re-planning
5. Cycle repeated until everything passed

clawhip filed updates to the Discord channel throughout. If something was blocked, the agents @mentioned the developer. If nothing was blocked, they kept going.

**No terminal. No IDE. No SSH session.** Discord. A chat app. A text box. A send button. The terminal sessions visible in the README screenshots belong to the agents, not the human.

| claw-code harness                   |
| ----------------------------------- |
| Discord as human interface          |
| clawhip routes events to Discord    |
| OmX provides workflow keywords      |
| OmO coordinates agent disagreements |
| Agents write code autonomously      |
| Git worktrees isolate agent work    |

The philosophical takeaway from the claw-code team: the people who built good agent coordination, gave clear direction, and then stepped back shipped more than the people who tried to micromanage every line. The bottleneck is no longer how fast your fingers can produce syntax — it's architectural clarity and task decomposition.