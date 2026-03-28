---
title: How to use Claude Code
author: Stephane Busso
description: The complete guide to Claude Code in 2026 — features, hooks, skills, MCP servers, subagents, permission modes, and advanced workflows for maximum productivity
published: true
tags:
  - ai
  - claudecode
  - anthropic
updated: 2026-03-27T10:00
created: 2025-06-13T02:09
cover:
featured: true
---
## Claude Code in 2026: comprehensive guide to features and advanced usage

Claude Code has evolved from a terminal-based AI coding agent into a full autonomous agent platform. Now available as a CLI, desktop app, VS Code and JetBrains extension, web app at `claude.ai/code`, and even controllable from your phone, it ships with hooks, custom skills, subagent orchestration, git worktree isolation, voice input, and computer use on macOS. This article provides a complete guide to maximizing productivity with Claude Code in 2026.

## Platforms and availability

Claude Code runs everywhere in 2026:

- **CLI** — the original terminal experience, composable with Unix pipes
- **Desktop app** — standalone GUI with visual diffs, live app preview, computer use, and scheduled tasks
- **VS Code extension** — launch with `Cmd+Esc` (Mac) or `Ctrl+Esc`, shares selection, open tabs, and diagnostics automatically
- **JetBrains plugin** — IntelliJ, PyCharm, WebStorm, CLion, and Rider with interactive diff viewer
- **Web** — `claude.ai/code` runs on Anthropic cloud VMs, no local setup required
- **Mobile** — send tasks from your phone via Dispatch or control a local session with Remote Control

All platforms share the same engine and feature set. You can start a session on your desktop, teleport it to your terminal with `claude --teleport`, or control it remotely from your phone.

## Models and effort levels

### Available models

| Alias    | Model            | Best for                                       |
| -------- | ---------------- | ---------------------------------------------- |
| `opus`   | Claude Opus 4.6  | Complex reasoning, architecture, deep analysis |
| `sonnet` | Claude Sonnet 4.6 | Daily tasks, balanced capability and speed     |
| `haiku`  | Claude Haiku 4.5 | Simple tasks, fast responses                   |

Both Opus and Sonnet are available with **1 million token context windows** (`opus[1m]`, `sonnet[1m]`), enabling work across large codebases without losing context. Switch models mid-session with `/model` or set a default in settings.

### Effort levels (adaptive reasoning)

Control how deeply Claude reasons beyond the natural language triggers:

- **low** — minimal reasoning, fastest responses
- **medium** — balanced (default)
- **high** — deep reasoning for complex problems
- **max** — deepest reasoning, Opus 4.6 only

Set with `/effort` or in settings. **Fast mode** (toggle with `/fast`) uses the same model but optimizes for speed — available on Team and Enterprise plans.

## Custom slash commands and skills

Slash commands provide powerful workflow automation through reusable prompt templates stored as Markdown files. These commands dramatically reduce repetitive tasks and standardize team workflows. In 2026, commands have evolved into the more powerful **skills** system (covered below), but classic commands remain fully supported.

### Creating and managing commands

**Project-scoped commands** live in `.claude/commands/` directory and are accessible to all team members who clone the repository. Access these with `/project:command_name` syntax. For example, creating a performance optimization command:

```bash
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md
```

**User-scoped commands** reside in `~/.claude/commands/` and work across all projects. These personal productivity enhancers are invoked with `/user:command_name`.

### Organizational best practices

Implement **hierarchical structures** using subdirectories for better categorization. Commands like `.claude/commands/frontend/component.md` become `/project:frontend:component`. Maintain consistent naming conventions with descriptive, action-oriented names using hyphens for multi-word commands.

Include the `$ARGUMENTS` placeholder for dynamic inputs, enabling commands like:

```markdown
# .claude/commands/fix-issue.md
Please analyze and fix the GitHub issue: $ARGUMENTS
1. Use `gh issue view` to get issue details
2. Search codebase for relevant files
3. Implement necessary changes
4. Write and run tests
5. Create descriptive commit and PR
```

## Planning mode usage and extended thinking

Planning mode, officially called "Extended Thinking," allows Claude to spend additional time analyzing problems before responding. This feature enables **deep reasoning for complex tasks** with configurable thinking budgets from 1,024 to 128K tokens.

### Natural language triggers and token allocation

Activate different thinking levels with simple phrases:

- `"think"` → 4,000 tokens
- `"think hard"` or `"megathink"` → 10,000 tokens
- `"think harder"` or `"ultrathink"` → 31,999 tokens

The thinking process displays as italic gray text, providing transparency into Claude's reasoning. This proves invaluable for complex problem-solving, architecture decisions, debugging intricate issues, and large-scale refactoring projects.

### Effective usage patterns

Deploy extended thinking for **multi-constraint problems** where Claude must balance competing requirements. For architectural decisions, request: "Design a scalable microservices architecture for our e-commerce platform. Think harder about the trade-offs between consistency and availability."

Extended thinking excels when applied to debugging complex issues, refactoring strategies, and system design challenges. The feature performs optimally with English language inputs and high-level instructions that allow Claude to determine the optimal thinking approach.

In 2026, extended thinking works alongside the **effort level** system (see Models section above). Toggle thinking visibility with `Ctrl+O` (verbose mode) or `Option+T`. The thinking process is now powered by **adaptive reasoning** on Opus and Sonnet 4.6, which dynamically allocates thinking based on task complexity rather than fixed token budgets.

## MCP servers setup and benefits

The Model Context Protocol represents a paradigm shift in AI-tool integration, serving as the **"USB-C of AI applications."** This open standard enables standardized connections between AI models and external data sources, tools, and services.

### Understanding the dual architecture

Claude Code uniquely functions as both MCP client and server. As a client, it connects to multiple MCP servers simultaneously, accessing external tools while maintaining isolated connections for security. As a server, it exposes built-in tools (View, Edit, LS) to other applications, enabling programmatic access to Claude's coding capabilities.

### Configuration and implementation

Set up MCP servers through three methods:

**CLI Wizard** (beginner-friendly):

```bash
claude mcp add puppeteer -s project -- npx -y @modelcontextprotocol/server-puppeteer
```

**Direct JSON configuration** (advanced):

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

### Transformative benefits

MCP servers enable **visual testing** through Puppeteer integration, **error monitoring** via Sentry, **direct database operations**, and seamless **enterprise system integration**. The ecosystem has grown to thousands of community servers, with adoption by major AI providers including OpenAI, Google, and Microsoft.

### Connection types in 2026

MCP now supports four connection types:

- **Remote HTTP** — cloud APIs, SaaS tools
- **Remote SSE** — real-time streaming connections
- **Local stdio** — desktop apps, databases, filesystem tools
- **WebSocket** — bidirectional communication

Additional capabilities include OAuth2 authentication, push messages via channels, managed allowlists/denylists, and MCP resources (data files and documentation exposed to Claude).

## Sub-agents and task delegation

Claude Code implements a sophisticated sub-agent system enabling **parallel task execution** and specialized problem-solving. This architecture allows Claude to automatically spawn sub-agents working on different aspects of complex problems simultaneously.

### Delegation patterns and best practices

Effective delegation follows a structured pattern:

1. **Planning Phase**: Main agent coordinates overall strategy
2. **Execution Phase**: Sub-agents handle specialized tasks in parallel
3. **Validation Phase**: Independent verification agents check outputs
4. **Integration Phase**: Results consolidate under main agent coordination

Trigger parallel execution with requests like: "Research three separate approaches to implement OAuth2. Do it in parallel using three agents."

### Optimal task types for delegation

**Research and analysis** benefits from parallel investigation of competing solutions and simultaneous review of multiple codebases. **Development tasks** excel with parallel component development and independent test suite creation. **Quality assurance** improves through independent security analysis and cross-verification of implementations.

Sub-agents preserve main context by handling specialized tasks, reduce context switching overhead, and enable more efficient token usage. The system catches edge cases through independent validation and provides multiple perspectives for robust solutions.

### Built-in subagent types (2026)

Claude Code now ships with specialized built-in subagents:

- **Explore** — fast, read-only codebase analysis (uses Haiku for speed)
- **Plan** — research agent for plan mode investigations
- **General-purpose** — complex multi-step work with full tool access

### Custom agents

Define your own agents in `.claude/agents/`:

```markdown
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Review code for security vulnerabilities
model: opus
allowed-tools: ["Read", "Grep", "Glob"]
---

You are a security-focused code reviewer. Analyze code for OWASP top 10 vulnerabilities, injection risks, and authentication issues.
```

Custom agents support tool restrictions, model selection, persistent memory, worktree isolation, max turn limits, and lifecycle hooks.

### Agent teams (experimental)

Multiple independent Claude Code sessions can now coordinate via shared tasks and peer-to-peer messaging. Each agent gets its own full context window, enabling truly parallel complex work on separate features or research tracks.

## Workflow optimization tips

### Foundation setup with CLAUDE.md

Create a **central configuration file** using the `/init` command. This persistent memory includes coding conventions, build commands, testing procedures, and repository etiquette. The file dynamically updates during sessions using the `#` key for auto-incorporation.

Example structure:

```markdown
# Project: MyApp
## Technologies
- React, TypeScript, Node.js
## Build Commands
- `npm run build`: Build the project
## Code Style
- Use ES modules (import/export)
## Workflow
- Always run tests before committing
```

### Advanced prompting techniques

Replace vague requests with **precise instructions**. Instead of "fix this," use "add input validation to ensure user_id is an integer and write tests for edge cases." Implement structured workflows separating research, planning, implementation, and verification phases.

### IDE integration strategies

**VS Code** users can launch Claude Code with `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux). The extension automatically shares current selection, open tabs, and diagnostic errors. **JetBrains** integration offers similar capabilities with full diagnostic sharing and inline diff viewing.

### Performance optimization

Leverage **git worktrees** for parallel Claude sessions on different features. Use headless mode (`-p` flag) for automation and scripts. Implement allowlists for trusted tools to optimize token usage. Monitor costs with `/cost` for per-session token tracking and set appropriate model selection (Sonnet 4.6 for most tasks, Opus 4.6 for complex decisions, Haiku 4.5 for simple queries).

## Project initialization best practices

### The /init command foundation

Running `/init` in your project root generates comprehensive project analysis, creating standardized documentation and establishing consistent development environments. This automated setup identifies technology stacks, build commands, and coding conventions.

### Optimal project structure

Organize projects with dedicated directories:

```text
project/
├── .claude/
│   ├── commands/           # Classic slash commands
│   ├── skills/             # Custom skills (replaces commands)
│   ├── agents/             # Custom subagent definitions
│   ├── hooks/              # Reusable hook scripts
│   ├── rules/              # Path-scoped conditional rules
│   ├── settings.json       # Project settings, hooks, permissions
│   └── settings.local.json # Personal settings (gitignored)
├── CLAUDE.md               # Main project instructions
├── .mcp.json               # MCP server config
├── .worktreeinclude        # Files to copy into worktrees
└── spec.md                 # Project specification
```

### Team collaboration setup

Check CLAUDE.md into version control for shared team knowledge. Include .mcp.json for common tool configurations. Document team-specific commands and establish allowlist standards for consistent security practices.

## Real-world examples and productivity gains

### Developer success stories

Anthropic engineers report **95% of git operations** handled through Claude. Complex refactoring tasks see dramatic improvements, with one example showing a 2-year-old broken codebase fixed in just 2 days. Rakuten validated Opus 4 running **autonomously for 7 hours** on open-source refactoring projects.

Data scientists convert exploratory notebooks to production Metaflow pipelines, saving 1-2 days per model. The CodeConcise tool demonstrates adding new programming language support in minutes versus traditional weeks-long implementations.

### Non-technical user breakthroughs

Users with **no coding experience** successfully build and deploy functional applications. One testimonial describes going "from downtrodden and skeptical to dancing around the room in 15 minutes" after automating frustrating work tasks. Teachers create professional development tracking applications, while business users automate manual workflows into efficient systems.

The democratization of programming enables:

- 50-page PDF policies summarized in 3 paragraphs
- Customer support automation with empathetic response generation
- Interactive data visualizations from simple prompts
- Custom productivity calculators and utility applications

### Enterprise adoption patterns

Companies leverage Claude Code for applications they "wouldn't have had bandwidth for," including AI labeling tools, sales ROI calculators, and complex multi-step automated tasks. Small teams achieve **enterprise-level output** through AI multiplication of resources.

## Hooks: deterministic automation

Hooks are one of the most powerful additions in 2026. They are shell scripts that run at specific lifecycle points — no LLM involved, fully deterministic. They automate behaviors like "format code after every edit" or "block changes to `.env` files."

### Hook events

Claude Code exposes 20+ hook events including:

- `PreToolUse` / `PostToolUse` — before/after tool execution (can block)
- `SessionStart` — session begins or resumes
- `UserPromptSubmit` — before processing a prompt
- `Stop` — Claude finishes responding
- `Notification` — Claude needs your attention
- `FileChanged` — watched files change
- `SubagentStart` / `SubagentStop` — subagent lifecycle
- `PreCompact` / `PostCompact` — before/after context compression

### Hook types

1. **Command hooks** — shell scripts with stdin/stdout
2. **Prompt-based hooks** — single LLM call for yes/no decisions
3. **Agent-based hooks** — full subagent with tool access for verification
4. **HTTP hooks** — POST data to external endpoints

### Practical examples

**Auto-format after edits** (in `.claude/settings.json`):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "npx prettier --write $CLAUDE_FILE_PATH"
      }
    ]
  }
}
```

**Block edits to protected files:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "command": "if echo $CLAUDE_FILE_PATH | grep -qE '\\.(env|lock)$'; then exit 2; fi"
      }
    ]
  }
}
```

Exit codes control behavior: `0` = allow, `2` = block. This makes hooks a reliable safety net for your workflow.

## Custom skills: the evolution of slash commands

Skills are reusable workflows or knowledge packages that Claude loads automatically when relevant or on demand via `/skill-name`. They replace and extend the classic commands system with richer capabilities. Unlike classic slash commands (single markdown files with fixed logic), skills are **directories** that can contain scripts, templates, reference docs, and assets — and they activate automatically based on context.

### How skills differ from slash commands

| Aspect | Slash Commands | Skills |
| ------ | -------------- | ------ |
| **Structure** | Single `.md` file | Directory with `SKILL.md` + supporting files |
| **Invocation** | Manual only (`/command`) | Manual or auto-triggered by description match |
| **Supporting files** | None | Templates, examples, scripts, reference docs |
| **Configuration** | Minimal | Rich frontmatter (model, tools, paths, hooks, fork) |
| **Distribution** | Copy the file | Plugin packaging with marketplace support |

As of Claude Code 2.1, commands and skills share the same `/` invocation syntax. Files at `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. Skills are the recommended approach going forward.

### Creating a skill

Each skill lives in its own directory with a required `SKILL.md` file:

```
.claude/skills/deploy/
├── SKILL.md              # Required: instructions + frontmatter
├── template.md           # Optional: template Claude fills in
├── reference.md          # Optional: detailed specs
├── examples/
│   └── good-output.md    # Optional: example outputs
└── scripts/
    └── validate.sh       # Optional: executable scripts
```

A minimal `SKILL.md`:

```markdown
---
name: deploy
description: Deploy the application to production. Use when the user says "deploy", "ship", or "push to prod".
---

1. Run the test suite
2. Build the project
3. Deploy with railway up
4. Verify the deployment is healthy
5. Report the deployment URL
```

### Complete frontmatter reference

```yaml
---
name: my-skill                    # Identifier, becomes /my-skill
description: What this does       # CRITICAL — Claude uses this to decide auto-loading
argument-hint: [issue-number]     # Shown in autocomplete
disable-model-invocation: false   # true = only user can invoke (not auto-triggered)
user-invocable: true              # false = hidden from / menu, Claude can still auto-trigger
allowed-tools: Read, Grep, Glob   # Tool allowlist while skill is active
model: sonnet                     # Override session model (opus, sonnet, haiku, inherit)
effort: high                      # Override effort level (low, medium, high, max)
context: fork                     # Run in isolated subagent instead of main conversation
agent: Explore                    # Subagent type when context: fork (Explore, Plan, general-purpose)
paths: "src/**/*.ts"              # Auto-load only when editing matching files
shell: bash                       # Shell for !`command` blocks (bash or powershell)
hooks:                            # Lifecycle hooks scoped to this skill
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh"
---
```

### The description field is everything

The `description` is the most important field. Claude reads all skill descriptions at session start (~2% of context budget) and uses them to decide which skills to load. The full skill content only loads when invoked.

**Bad:** `description: Helper for code`
**Good:** `description: Refactor code for readability and performance. Use when improving existing code, simplifying complex logic, or optimizing hot paths.`

Be specific about **when** the skill should trigger — include the verbs and phrases a user would say.

### Skill scoping and discovery

Skills are discovered from multiple locations, with higher scopes overriding lower:

| Scope | Location | Version controlled | Use case |
| ----- | -------- | ------------------ | -------- |
| Enterprise | Managed settings | Admin-controlled | Org-wide standards |
| Personal | `~/.claude/skills/<name>/SKILL.md` | No | Personal workflows across all projects |
| Project | `.claude/skills/<name>/SKILL.md` | Yes | Team conventions, project-specific workflows |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Distributable | Shared tools across teams |
| Nested | Subdirectory `.claude/skills/` | Yes | Monorepo package-specific skills |

**Nested discovery**: when editing `packages/frontend/src/App.tsx`, Claude also discovers skills in `packages/frontend/.claude/skills/`. Skills in directories added via `--add-dir` are picked up automatically with live change detection.

### Arguments and string substitution

Skills support dynamic inputs via several substitution variables:

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `$ARGUMENTS` | All arguments as a single string | `/fix 123` → `$ARGUMENTS` = `"123"` |
| `$0`, `$1`, `$2` | Positional arguments (0-indexed) | `/migrate SearchBar React Vue` → `$0`=`SearchBar`, `$1`=`React`, `$2`=`Vue` |
| `${CLAUDE_SESSION_ID}` | Current session ID | For logging and correlation |
| `${CLAUDE_SKILL_DIR}` | Directory containing the SKILL.md | Reference bundled scripts regardless of cwd |
| `${CLAUDE_PLUGIN_DATA}` | Persistent data folder for the skill | Store state across sessions |

If a skill doesn't reference `$ARGUMENTS`, Claude Code automatically appends `ARGUMENTS: <input>` so Claude still sees what you typed.

**Positional example:**

```markdown
---
name: migrate-component
description: Migrate a component between frameworks
argument-hint: [component] [from-framework] [to-framework]
---

Migrate the $0 component from $1 to $2.
Preserve all existing behavior and tests.
```

### Tool restrictions

The `allowed-tools` field limits which tools Claude can use without asking permission while the skill is active:

```yaml
allowed-tools: Read, Grep, Glob
```

This creates a **read-only skill** — Claude cannot Edit, Write, or Bash without explicit user approval. Use wildcards for tool families: `mcp__github__*` allows all GitHub MCP tools. Combine with hooks for conditional restrictions (e.g., allow Bash but only for SELECT queries):

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
```

### Model and effort overrides

Force a specific model for the skill's execution, regardless of session settings:

```yaml
model: opus    # Complex analysis, deep refactoring
model: haiku   # Fast, simple tasks (cost savings)
model: sonnet  # Balanced (default if omitted)
```

Combine with effort level: `effort: max` for Opus 4.6 deep reasoning on critical skills.

### Path scoping for auto-loading

Restrict when a skill auto-loads based on which files are being edited:

```yaml
# Only loads when editing Rust files
paths: "src/**/*.rs"

# Multiple patterns (comma-separated)
paths: "src/**/*.tsx,src/**/*.css,**/*.md"

# Or as YAML list
paths:
  - "src/**/*.tsx"
  - "**/*.test.ts"
  - "Dockerfile"
```

With `paths` set, the skill **only auto-loads** for matching files. You can still invoke it manually with `/skill-name` regardless.

### Fork context: isolated subagent execution

Setting `context: fork` runs the skill in an isolated subagent instead of the main conversation:

```yaml
---
name: codebase-analysis
description: Analyze codebase architecture
context: fork
agent: Explore
---

Analyze the codebase and report:
1. Architecture overview
2. Key modules and responsibilities
3. External dependencies
4. Entry points
```

| Aspect | Inline (default) | `context: fork` |
| ------ | ----------------- | --------------- |
| Context | Full conversation history | Fresh, isolated context |
| Output | Inline in conversation | Summarized result returned |
| Token cost | Uses main context window | Uses separate subagent window |
| Tool access | Session permissions | Controlled by `agent` type |

**When to fork**: self-contained research, verbose output you don't want cluttering context, read-only exploration via `agent: Explore`. **When not to fork**: tasks needing conversation history or iterative refinement.

### Templates and supporting files

Keep `SKILL.md` under 500 lines. Move detailed content to supporting files and reference them:

```markdown
---
name: api-endpoint
description: Create a new REST API endpoint following our conventions
---

Create a new endpoint using our template:

!`cat ${CLAUDE_SKILL_DIR}/template.ts`

For complete API guidelines, see [reference.md](reference.md).
For examples, see [examples/](examples/).
```

The `` !`command` `` syntax executes before Claude sees the content, injecting real data:

```markdown
Your recent commits:
!`git log --oneline -10`
```

### Hooks scoped to skills

Define hooks that **only run while the skill is active**:

```yaml
---
name: safe-deploy
description: Deploy with safety checks
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/pre-deploy-check.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
  Stop:
    - hooks:
        - type: command
          command: "./scripts/cleanup.sh"
---
```

These are distinct from session-wide hooks in `settings.json` — skill hooks are cleaned up when the skill finishes.

### Invocation control

Two fields control who can trigger a skill:

- **`disable-model-invocation: true`** — only you can invoke via `/skill-name`. Claude cannot auto-trigger. Use for skills with side effects (deploy, send messages, commit).
- **`user-invocable: false`** — hidden from the `/` menu. Claude can still auto-trigger. Use for background knowledge (e.g., legacy system context that should load automatically but doesn't need a command).

You can also control skills via permissions in `settings.json`:

```json
{
  "permissions": {
    "allow": ["Skill(code-review)"],
    "deny": ["Skill(deploy)"]
  }
}
```

### Nine categories of effective skills

Based on Anthropic's guidance, the most valuable skill types are:

1. **Library & API reference** — how to use specific libraries, CLIs, or internal APIs correctly
2. **Product verification** — test and verify code functionality automatically
3. **Data fetching & analysis** — connect to data stacks, run queries, generate reports
4. **Business process automation** — automate repetitive team workflows
5. **Code scaffolding & templates** — generate boilerplate following project conventions
6. **Code quality & review** — enforce standards, lint rules, best practices
7. **CI/CD & deployment** — fetch, push, deploy code through pipelines
8. **Runbooks** — multi-tool investigation and reporting for incidents
9. **Infrastructure operations** — routine maintenance and system checks

### Tips for writing effective skills

- **Build a Gotchas section** — this is the highest-signal content. Document what the model will get wrong without explicit guidance.
- **Don't state the obvious** — focus on information Claude can't derive from reading the code itself.
- **Use progressive disclosure** — organize content in subfolders so Claude reads the right files at the right time, rather than loading everything upfront.
- **Avoid railroading** — describe what the skill should accomplish, not every micro-step. Let Claude choose the optimal approach.
- **Store scripts, generate code** — put validation scripts in `scripts/`, reference them with `${CLAUDE_SKILL_DIR}/scripts/validate.sh`.
- **Use `${CLAUDE_PLUGIN_DATA}` for persistence** — store data that should survive across sessions (metrics, state, caches).
- **Test with multiple invocation paths** — verify the skill works for manual `/skill-name`, with arguments, and via auto-trigger.

### Distributing skills via plugins

Skills can be packaged into **plugins** that bundle skills, hooks, agents, and MCP servers:

```
my-plugin/
├── plugin.json
├── skills/
│   ├── deploy/SKILL.md
│   └── review/SKILL.md
├── agents/
├── hooks/
└── README.md
```

**Distribution methods:**

- **Git repository** — `git push` and install with `/plugin install github.com/org/repo`
- **Plugin marketplace** — a JSON manifest listing plugins that teams subscribe to:

```json
{
  "marketplace": {
    "name": "Team Plugins",
    "owner": "my-company"
  },
  "plugins": [
    {
      "name": "team-skills",
      "source": { "source": "github", "repo": "my-company/claude-plugins", "subdirectory": "team-skills" }
    }
  ]
}
```

Teams add the marketplace once with `/plugin marketplace add <URL>` and get updates automatically. Plugin skills use namespaced invocation: `/plugin-name:skill-name` to avoid conflicts.

## Permission modes and security

Claude Code offers granular control over what actions require approval. Cycle through modes with `Shift+Tab`:

1. **Default** — asks before edits, bash commands, and network operations
2. **Accept Edits** — auto-approves file edits, still asks for bash/network
3. **Plan** — read-only exploration, proposes but doesn't execute changes
4. **Auto** — background classifier evaluates each action for safety (Team/Enterprise, research preview)
5. **Don't Ask** — only pre-approved tools execute, others blocked silently (ideal for CI/CD)
6. **Bypass Permissions** — no checks at all (only for isolated environments like containers)

### Fine-grained permission rules

Configure in settings with glob patterns and wildcards:

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(bun run test)",
      "Read(**/*.ts)",
      "Edit(src/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Edit(.env*)"
    ]
  }
}
```

Organization admins can enforce **managed policies** that users cannot override, ensuring security standards across teams.

## Git worktrees: parallel development

Git worktrees let you run multiple Claude sessions on different features without file conflicts:

```bash
# Terminal 1
claude --worktree feature-auth

# Terminal 2
claude --worktree feature-payments

# Terminal 3
claude --worktree bugfix-login
```

Each session creates an isolated copy at `.claude/worktrees/<name>/` with its own branch. They share git history but have independent working files. Use `.worktreeinclude` to automatically copy `.gitignore`d files (like `.env`) into new worktrees.

Subagents can also run in isolated worktrees with `isolation: worktree`, preventing file conflicts during parallel execution.

## Memory system

### Auto memory

Claude automatically maintains memory across sessions, stored at `~/.claude/projects/<project>/memory/`. It tracks patterns it discovers: build commands that work, architectural decisions, your coding preferences. The first 200 lines load at every session start.

### Manual memory

Use `/memory` to view and edit memory files directly. You can also tell Claude to "remember that we use Vitest, not Jest" and it will persist the information for future sessions.

### CLAUDE.md as persistent instructions

While auto memory is machine-learned, `CLAUDE.md` is your explicit, version-controlled project knowledge. Use `.claude/rules/` for **path-scoped rules** — a rule file with `paths: src/components/**/*.tsx` only loads when working on matching files, keeping context lean.

## Voice input and computer use

### Voice mode

Claude Code supports push-to-talk voice input in 20+ languages. Press spacebar to speak, and Claude transcribes and processes your request. Available across all platforms.

### Computer use (macOS)

On the desktop app, Claude can control your screen — clicking, typing, navigating applications. Combined with Remote Control, you can send instructions from your phone and watch Claude execute desktop operations.

## Essential keyboard shortcuts

| Shortcut | Action |
| -------- | ------ |
| `Shift+Tab` | Cycle permission modes |
| `Ctrl+O` | Toggle verbose mode (see thinking) |
| `Option+T` | Toggle extended thinking |
| `Ctrl+C` | Interrupt current operation |
| `Ctrl+B` | Background current task |
| `Ctrl+G` | Open plan in editor |
| `Ctrl+R` | Reverse history search |
| `Escape` | Cancel/exit current mode |

### Input shortcuts

- `@file` or `@directory` — reference files with autocomplete
- `!command` — run as bash command directly
- `{` or `Shift+Enter` — multiline input
- `/btw` — side question without tool access

## Slash commands reference

| Command | Purpose |
| ------- | ------- |
| `/compact` | Compress conversation to free context |
| `/clear` | Start fresh session |
| `/resume` | Resume a previous session |
| `/model` | Switch models |
| `/effort` | Adjust reasoning depth |
| `/memory` | View/edit CLAUDE.md and memory files |
| `/agents` | Create and manage subagents |
| `/hooks` | Browse configured hooks |
| `/batch` | Parallel changes across codebase (5-30 agents) |
| `/loop` | Run a prompt on a recurring interval |
| `/simplify` | Review and fix code quality issues |
| `/cost` | Show token usage and costs |
| `/context` | View context window usage |
| `/init` | Generate CLAUDE.md for your project |

## Advanced features

### Visual development

Screenshot-based development enables UI creation from mockups. Claude analyzes visual inputs to generate matching code implementations, particularly effective for frontend development and data visualization tasks.

### Industry integration

Claude Sonnet 4 powers **GitHub Copilot** as its base model. The platform integrates with Cursor for state-of-the-art coding capabilities. Enterprise deployments through AWS Bedrock and Google Vertex AI enable secure, scalable implementations.

### Agent SDK

The Claude Agent SDK (available in Python and TypeScript) lets you build custom AI agents with Claude Code capabilities. It provides tool management, agent loop execution, streaming, structured outputs, and session management — enabling you to embed Claude Code features in your own applications and CI/CD pipelines.

## Maximizing productivity with Claude Code

Success with Claude Code requires understanding its capabilities as an **orchestrated system** rather than a simple tool. Implement specification-driven development by generating detailed specs before coding. Embrace test-driven development, which Claude excels at implementing. Use iterative improvement—2-3 passes typically yield significantly better results.

Configure your environment with comprehensive CLAUDE.md files, relevant MCP servers for your tech stack, and custom slash commands for repetitive workflows. Leverage parallel Claude instances for complex tasks, with one writing code while another reviews and tests.

The evidence demonstrates Claude Code as a **transformative force** in software development, enabling both seasoned developers and complete beginners to build sophisticated applications. As the ecosystem continues expanding with community contributions and enterprise adoption, Claude Code is positioned to fundamentally reshape how software is created, making programming accessible to broader audiences while amplifying professional developer capabilities.

With productivity gains ranging from 2x to 10x and breakthrough capabilities in autonomous operation, Claude Code represents not just an evolution in AI assistance but a revolution in how we approach software creation. The key to success lies in embracing its full capabilities—from hooks and skills to MCP integration, permission modes, worktree isolation, and multi-agent workflows—to achieve unprecedented development efficiency and innovation. Invest time in your `CLAUDE.md`, set up hooks for your common workflows, connect the MCP servers your team needs, and let Claude handle the orchestration.
