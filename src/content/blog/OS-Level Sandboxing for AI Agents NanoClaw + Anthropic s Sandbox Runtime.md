---
title: "OS-Level Sandboxing for AI Agents: NanoClaw + Anthropic's Sandbox Runtime"
author: Stephane Busso
description: A technical deep dive into running Claude agents with kernel-enforced isolation — no Docker, no VMs, sub-10ms cold starts.
published: true
tags:
  - ai
  - agents
  - claudecode
  - claude
  - security
  - sandbox
  - anthropic
updated: 2026-03-21T11:59
created: 2026-03-21T11:59
cover:
featured: false
---
## The Problem with AI Agent Security

Most AI agent frameworks handle security at the application level: allowlists, permission checks in code, pairing codes. OpenClaw — one of the more established options — runs all agents in a single Node.js process with shared memory. At ~500K lines of code, 53 config files, and 70+ dependencies (as of early 2026), the attack surface is too large for any individual to audit. A single bug in the permission logic gives an agent unrestricted host access. There's no kernel-enforced boundary — just JavaScript checks in a shared V8 isolate.

Application-level security means that the permission checks and the thing being restricted share a runtime. An agent that exploits a prompt injection, a malformed tool response, or a dependency vulnerability inherits the full privileges of the Node.js process. The checks are in JavaScript. The escape is also in JavaScript. There is no second layer.

The shared-process model compounds this. Every conversation — family group chat, work Slack channel, production debugging session — runs in the same event loop, sharing a heap. Isolation between groups is enforced by code, not by process boundaries. One leaked reference, one global mutation, one unscoped variable, and you have cross-contamination between conversations that should never interact.

Configuration sprawl makes the system harder to reason about over time. Each feature adds config surfaces. Behavior becomes emergent from interactions between dozens of configuration files rather than traceable through source code. The system becomes something you operate rather than something you understand.

This is a well-known architectural trade-off: application-level security is flexible but fragile. For AI agents with tool use, file access, and network capabilities, fragile isn't acceptable.

This article covers a different approach: [my fork of NanoClaw](https://github.com/sbusso/nanoclaw) running agents inside Anthropic's `sandbox-runtime` — OS-level isolation with kernel-enforced filesystem and network restrictions, sub-10ms cold starts, and a security boundary you can inspect in a single function.

## Architecture Comparison

Here's what OpenClaw's agent execution looks like:

```
OpenClaw:  Message → Shared Node.js process → Application-level permission checks → Agent (shared memory)
```

And here's the architecture in my NanoClaw fork:

```
NanoClaw:  Channels → SQLite → Polling loop → Sandbox (Claude Agent SDK) → Response
```

The critical difference: every agent invocation in NanoClaw spawns an isolated process with OS-level restrictions. There is no shared memory between conversations. The agent for a family group chat and the agent debugging a production incident never share a heap, a process, or a filesystem scope.

### The core loop

The entire orchestrator is a single Node.js process (~35K tokens of source). That's small enough for Claude to hold the entire codebase in a single context window — read it, reason about it, modify it. Compare that to auditing 500K lines across 70+ packages.

Channels (Slack, Telegram, WhatsApp, Discord, Gmail) self-register at startup using a simple pattern: if the credentials exist in `.env`, the channel activates. No channel registry file. No channel configuration object. The channel implementation calls `registerChannel()` during module initialization, and the orchestrator discovers it at startup. Want to remove a channel? Delete its credentials. Want to add one? Run `/add-slack` and provide tokens.

Messages from all channels land in a single SQLite database, normalized to a common format. A polling loop picks them up, determines which group the message belongs to, and spawns a sandboxed Claude agent for that group. When the agent finishes, it writes its response to an IPC file. The orchestrator picks it up and routes it back through the originating channel.

Each group gets:
- Its own directory (`groups/{name}/`)
- Its own `CLAUDE.md` persistent memory — the agent reads this at startup for context about the group, its members, and ongoing conversations
- Its own sandbox process with only that directory mounted writable
- File-based IPC for outbound messages and scheduled tasks

The group isolation is physical, not logical. The sandbox for a family chat literally cannot read the files from a work channel's directory. This isn't enforced by a permission check in JavaScript — it's enforced by the kernel refusing the `open()` syscall.

### Skills over features

The codebase uses a skills-over-features model. Instead of a monolithic system with every integration bundled, capabilities are added via Claude Code skills (`/add-slack`, `/add-telegram`, `/add-gmail`) that merge code into your fork. Each skill is a git branch that gets merged in. Each installation contains only the code it actually uses.

This means your NanoClaw instance is your software. Not a platform you configure — code you own, committed to your repo, visible in your git history. When you run `/add-slack`, Claude Code merges the Slack channel implementation, installs the `@slack/bolt` dependency, and runs the tests. The result is committed to your fork. You can read every line that changed.

> **No config files by design.** NanoClaw avoids configuration sprawl entirely. Behavior changes are code changes — applied by Claude Code, visible in git history, auditable and reversible. The codebase is small enough (~35K tokens) that an LLM can hold it in full context and modify it safely. There's no config file interaction to debug. There's no "this config overrides that config" chain to trace. The code is the behavior.

## Why Sandbox > Docker

My fork supports two runtimes. Docker was the starting point; Anthropic's `sandbox-runtime` is what I actually run.

| | Docker | Sandbox |
|---|---|---|
| **Cold start** | ~2-5s | <10ms |
| **Memory overhead** | VM per container | None |
| **Network isolation** | Full outbound (credential proxy mitigates) | OS-level `allowedDomains` |
| **Credential model** | Proxy service (extra attack surface) | Direct credentials + restricted network |
| **Setup** | Docker daemon + image build | `npm install` |
| **Filesystem isolation** | Volume mounts | Kernel-enforced read/write boundaries |

### Performance

Docker spins up a Linux VM per agent invocation: 2-5 second cold starts, dedicated VM memory, a daemon that must be running. You also need to build and maintain a container image — any change to the agent runner means rebuilding the image. For a personal assistant processing chat messages, this is overhead without benefit.

Sandbox spawns a restricted process in <10ms. No VM. No daemon. No container image to build or maintain. The agent responds almost instantly. For a chat assistant where responsiveness matters, going from a multi-second boot to sub-10ms means the difference between feeling like a background job and feeling like a conversation.

### Security

Docker containers have **full outbound network access by default**. Any process inside the container can connect to any host on the internet. To prevent credential exfiltration, NanoClaw's Docker mode runs a credential proxy — a localhost HTTP service that intercepts API calls and swaps placeholder tokens for real keys. The agent never sees the real `ANTHROPIC_API_KEY`. This works, but it adds an entire service to the attack surface. The proxy has to be correct, available, and not bypassable. It's another thing that can break.

Sandbox restricts network at the OS level. The agent can only connect to:
- `api.anthropic.com` and `*.anthropic.com` (for API and OAuth)
- `localhost` and `127.0.0.1` (for IPC)

Everything else is blocked by the kernel. A `curl` to any other host fails at the syscall level — not because a proxy intercepted it, but because the OS refused the connection. Real credentials are passed directly — no proxy needed, because there's nowhere to exfiltrate them to.

The filesystem story is similar. Docker uses volume mounts to expose host directories inside the container. Sandbox uses kernel-enforced `allowWrite` and `allowRead` paths. The agent for a family chat group gets write access to `groups/family/` and read access to the project root (minus `.env`). That's it. No volume mount misconfiguration can accidentally expose your home directory.

### The trust model

Inside the sandbox, agents run with `permissionMode: 'bypassPermissions'` — all Claude Code permission prompts are disabled. This sounds dangerous until you understand the architecture: the sandbox IS the trust boundary.

Application-level permission prompts ("are you sure you want to write this file?") are security theater when the agent and the permission check share a runtime. A sufficiently clever prompt injection or tool response could bypass the check — it's JavaScript all the way down. By contrast, the sandbox's restrictions are enforced by the kernel. The agent can't bypass them from userspace. There's no JavaScript to exploit.

This is a cleaner security model: instead of layering application-level checks on top of full access, grant exactly the access needed and enforce it below the application. The result is that the agent runs with full autonomy inside a tightly scoped box. It can read, write, execute, and use tools — but only within the boundaries defined by the settings file.

## Sandbox Runtime Integration — Technical Deep Dive

Anthropic's `@anthropic-ai/sandbox-runtime` (`srt`) is a CLI tool that provides OS-level process sandboxing. It takes a `--settings` JSON file defining boundaries and spawns a child process inside them. On macOS it uses Apple's Seatbelt framework; on Linux, bubblewrap. No containers, no VMs — kernel-level restrictions on an ordinary process.

```bash
npx @anthropic-ai/sandbox-runtime --settings /tmp/settings.json -- node agent-runner.js
```

Everything after `--` runs inside the sandbox.

### Settings schema

The settings file defines network and filesystem boundaries. Here's what my fork generates per agent run:

```json
{
  "network": {
    "allowedDomains": ["api.anthropic.com", "*.anthropic.com", "localhost", "127.0.0.1"],
    "deniedDomains": [],
    "allowLocalBinding": true
  },
  "filesystem": {
    "denyRead": ["/path/to/project/.env"],
    "allowRead": ["/path/to/project"],
    "allowWrite": ["/path/to/group"],
    "denyWrite": ["/path/to/project/.env"]
  }
}
```

Network: `allowedDomains` is allow-only — everything unlisted is blocked. There's no deny-by-default-except list to manage; if a domain isn't in `allowedDomains`, the connection is refused. Filesystem: reads use deny-then-allow (deny entries checked first); writes are allow-only. The `.env` file is explicitly denied for both reads and writes — even though the agent can read the project directory, it cannot read the file containing credentials.

The settings file is dynamically generated per agent run from each group's mount specifications. A group with access to an external directory (say, an Obsidian vault at `~/Documents/vault`) gets that path added to `allowRead` and `allowWrite`. A group without that mount simply doesn't have the path listed — the kernel blocks access with no code change needed.

> **Gotcha: Silent schema validation.** Every field must be present, even if empty. Omit `allowRead: []` and the entire settings file silently fails validation — all permissions denied, zero error messages. No stderr warnings. We spent hours debugging EPERM errors before realizing the settings file was being silently ignored. If your sandbox agent is getting permission denied on everything, check that every field exists before looking anywhere else.

### Path mapping: making the agent runner runtime-agnostic

Docker maps host directories to `/workspace/*` via volume mounts. Sandbox runs on the host — there's no `/workspace/` path.

The solution: `NANOCLAW_*_DIR` environment variables. When spawning a sandbox agent, the orchestrator maps each mount to its host path. The agent runner reads these with Docker-path fallbacks:

```typescript
// Docker: paths mapped to /workspace/*
// Sandbox: env vars provide actual host paths
const WORKSPACE_GROUP   = process.env.NANOCLAW_GROUP_DIR   || '/workspace/group';
const WORKSPACE_IPC     = process.env.NANOCLAW_IPC_DIR     || '/workspace/ipc';
const WORKSPACE_PROJECT = process.env.NANOCLAW_PROJECT_DIR || '/workspace/project';
const WORKSPACE_GLOBAL  = process.env.NANOCLAW_GLOBAL_DIR  || '/workspace/global';
const WORKSPACE_EXTRA   = process.env.NANOCLAW_EXTRA_DIR   || '/workspace/extra';
```

Same agent runner binary, both runtimes. It doesn't know which runtime launched it. This matters for maintenance: there's one agent runner to test, one set of tool implementations, one IPC protocol. Runtime selection is an orchestrator concern, not an agent concern.

The orchestrator sets these env vars when spawning a sandbox agent, mapping each group's configured mounts to their actual host paths. In Docker mode, the env vars are absent, so the fallbacks kick in and the agent sees the familiar `/workspace/*` layout. Zero conditional logic in the agent runner.

### Credential handling: the inversion

Docker model: **protect the credentials, allow the network.** A credential proxy on localhost intercepts API calls and injects real keys. The agent never sees them. But the agent has full outbound access, so the proxy is the only thing preventing exfiltration.

Sandbox model: **trust the credentials, restrict the network.** Real keys passed via env vars. The agent has them — but can only connect to Anthropic's API. There's nowhere to send stolen credentials.

```typescript
const secrets = readEnvFileForProxy([
  'ANTHROPIC_API_KEY', 'CLAUDE_CODE_OAUTH_TOKEN', 'ANTHROPIC_AUTH_TOKEN',
]);

const child = spawn(sandboxArgs[0], sandboxArgs.slice(1), {
  env: {
    ...process.env,
    ...(secrets.ANTHROPIC_API_KEY
      ? { ANTHROPIC_API_KEY: secrets.ANTHROPIC_API_KEY }
      : { CLAUDE_CODE_OAUTH_TOKEN: secrets.CLAUDE_CODE_OAUTH_TOKEN || '' }),
    ...pathEnv,
  },
});
```

Fewer moving parts. No proxy service. No proxy bugs. Same security guarantee: the agent cannot exfiltrate credentials.

This is the credential handling inversion in practice. Docker's model: protect the credentials, allow the network — then add a proxy to compensate. Sandbox's model: trust the credentials, restrict the network. The second model has fewer components, fewer failure modes, and a smaller attack surface.

> **Gotcha: `tsx` blocked by sandbox.** The agent runner originally used `tsx` (TypeScript executor). Sandbox blocks Unix sockets, which `tsx` needs for worker thread communication — instant EPERM on startup. Fix: pre-compile with `npx tsc`, run with plain `node`. The compiled output at `container/agent-runner/dist/index.js` is used by sandbox; Docker uses its own copy baked into the image.

> **Gotcha: Stale sessions after runtime switch.** Switching a group between Docker and sandbox leaves stale session IDs that cause "No conversation found" errors. Fix: `sqlite3 store/messages.db "DELETE FROM sessions"`.

### Result

Agent spawns in <10ms. Full Claude Agent SDK capabilities — tool use, file operations, web access, browser automation. Network restricted to Anthropic's API. No Docker daemon. No image builds. No credential proxy. File-based IPC works identically in both runtimes: the agent writes messages and scheduled tasks to files in the IPC directory, and the orchestrator picks them up. The agent doesn't know or care which runtime launched it.

## Running My Fork

### Prerequisites

- macOS or Linux
- Node.js 20+
- [Claude Code](https://claude.ai/download)
- No Docker required

### Setup

```bash
git clone https://github.com/sbusso/nanoclaw.git
cd nanoclaw
claude
# type: /setup
```

`/setup` is a Claude Code skill that handles everything interactively: dependency installation, runtime selection (sandbox is the default), channel authentication via platform APIs (bot name auto-detected — no manual config), group registration, and service startup. It detects your platform, installs `@anthropic-ai/sandbox-runtime` if needed, walks you through creating a Slack/Telegram/Discord bot, and registers your first channel — all without you editing a single config file.

Channel setup uses the platform's own API to auto-detect the bot's display name and list available channels. This matters more than it sounds: a common failure mode in chat bots is the trigger pattern not matching the bot's actual name. If your Slack bot is named "Claude Assistant" but the trigger is set to `@Andy`, nothing works. NanoClaw's setup fetches the bot's real name from the API and uses it everywhere — `.env`, trigger patterns, group `CLAUDE.md` files — so the first message just works.

### What you get

- AI assistant on Slack, Telegram, WhatsApp, Discord, or Gmail — your choice
- <10ms sandbox agent spawns with full Claude tool use
- Per-group isolated memory, filesystem, and sandbox
- Scheduled tasks (cron-based), web access, browser automation
- A codebase you own and can modify via Claude Code

### Making it yours

NanoClaw is a fork, not a hosted service. You own the code. The entire codebase fits in Claude's context window, which means you can tell Claude Code what you want and it can make safe, targeted changes.

Examples of what daily use looks like:
- "Add a morning briefing that runs at 7am and posts to Slack" — Claude creates a scheduled task with a cron expression
- "Give the family group access to my Obsidian vault" — Claude adds the vault path to the group's mount allowlist
- "Change the trigger word from @Claude to just !ask" — Claude updates the trigger pattern in the database and `.env`

Each change is a code change, committed to your fork, reversible with `git revert`.

### Why this fork

The upstream [qwibitai/nanoclaw](https://github.com/qwibitai/nanoclaw) is the minimal base. [My fork](https://github.com/sbusso/nanoclaw) is what I run daily:

- Sandbox as the default runtime
- Slack integration baked in
- Bot name auto-detected from platform APIs during setup
- All integration fixes from the sandbox runtime work documented in this article
- Docker available as per-group fallback

## Conclusion

Application-level security for AI agents is a solved problem in the same way that application-level authentication was solved before OAuth: it works until it doesn't, and when it fails, it fails completely.

OS-level sandboxing is a fundamentally different approach. The security boundary is the kernel, not JavaScript permission checks. The attack surface is a JSON settings file and ~150 lines of runtime configuration, not 500K lines of application logic. You can read the entire sandbox integration in one sitting, understand every decision, and verify it does what it claims.

AI agents are trending toward more autonomy — more tool use, more file access, more network access, longer-running tasks. The security model should be getting stronger to match, not adding more JavaScript checks on top of a shared-memory process. Kernel-enforced isolation is the only model that scales with increasing agent capability without increasing the trust surface proportionally.

Anthropic's `sandbox-runtime` makes this practical without Docker's overhead: sub-10ms cold starts, no VMs, no daemon, kernel-enforced filesystem and network restrictions. The trade-off is that sandbox is macOS/Linux only and doesn't support per-group agent-runner customization (use Docker for that). The documentation is sparse and the schema validation is unforgiving — as the gotchas in this article demonstrate. But for the common case — a personal AI assistant that needs isolation, not customization — sandbox is strictly better.

NanoClaw bets that the best AI assistant infrastructure is infrastructure you can read, understand, and verify yourself. Not a platform you operate. Not a service you subscribe to. Your software, your agent, sandbox settings you can inspect in a single function.

The full source is at [github.com/sbusso/nanoclaw](https://github.com/sbusso/nanoclaw). Fork it, read it, modify it. The whole point is that you can.
