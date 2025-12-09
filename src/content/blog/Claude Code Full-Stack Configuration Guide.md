---
title: Claude Code Full-Stack Configuration Guide
author: Stephane Busso
description: This guide presents a state-of-the-art setup for using **Claude Code** (Anthropic’s AI coding assistant) in a modern full-stack project
published: true
tags:
  - claudecode
  - fullstack
  - tanstack
  - typescript
  - python
  - vite
  - react
  - bun
  - uv
updated: 2025-12-09T08:53
created: 2025-12-09T08:49
cover:
---
## (TanStack/TypeScript + Python)

  

**Last Updated:** December 2025 – This guide presents a state-of-the-art setup for using **Claude Code** (Anthropic’s AI coding assistant) in a modern full-stack project. We focus on a **TanStack/TypeScript front-end** with a **Python back-end** (Dockerized, deployed via Railway) and a **PostgreSQL database**, with front-end bundling through Vite and deployment on Cloudflare. The goal is a **“bulletproof” workflow** that takes advantage of Claude Code’s extensibility – including MCP servers (e.g. Context7), custom skills, slash commands, sub-agents, plugins, and hooks – to guide the AI agent through **analysis, planning, implementation, and validation phases** of development. We’ll also touch on sensible security practices to keep the workflow safe.

  

## **Overview of the Tech Stack**

- **Front-end:** A Vite-powered TypeScript application (e.g. React + TanStack libraries like TanStack Router or Query). This stack provides a fast dev server and modern JS/TS features. We’ll configure Claude Code to assist with UI component development, state management (TanStack Query), and client-side routing.
    
- **Back-end:** A Python server (e.g. FastAPI or Flask) containerized with Docker, possibly deployed on Railway. Claude Code will help with API endpoint implementation, business logic, and integration with a PostgreSQL database.
    
- **Database:** PostgreSQL for data persistence. Queries or schema changes may be needed; we can feed schema context to Claude so it can write correct SQL or ORM code.
    
- **Deployment:** Cloudflare for front-end (likely using Cloudflare Pages or Workers to serve the built static assets) and Railway for back-end (deploying the Docker container). We might configure Claude Code to assist in building and deploying these artifacts via CLI commands.
    

  

This heterogeneous stack means our AI assistant must seamlessly navigate **TypeScript/React code** and **Python code**, plus configuration files (Vite config, Dockerfiles, etc.). The configuration we’ll set up ensures Claude has the right context and tools to handle both sides of the application.

  

## **Setting Up the Claude Code Environment**

  

First, ensure you have access to Claude Code (via Anthropic’s platform or the VS Code extension). The VS Code extension (as of late 2025) provides a convenient GUI with a Claude sidebar and plan review mode . It reads the same configuration as the CLI, so you can use whichever interface you prefer . Key steps to get started:

- **Install Claude Code:** If using VS Code, install the **Claude Code VS Code extension** (Beta) . For CLI usage, install the Claude Code CLI via Anthropic’s instructions. Sign in or configure API access as needed.
    
- **Set Up Access:** Claude Code may require an API key or access through a provider (Anthropic’s own service or third-party like Bedrock). Configure any required environment variables or authentication in the settings (e.g. ~/.claude/settings.json or project’s .claude/settings.json). For VS Code, you can disable the login prompt if you use custom auth .
    
- **Verify Tools:** Make sure common dev tools are installed on your system so Claude can use them. For example:
    
    - Node.js and package managers (npm/yarn) for front-end build/tests.
        
    - Python and pip for backend tasks.
        
    - Docker CLI if you want Claude to build images.
        
    - Cloudflare/Wrangler CLI and Railway CLI (if you plan to let Claude run deployment commands).
        
    - Git and GitHub’s gh CLI (Claude knows how to use gh for repo tasks, if installed ).
        
    
- **Extended Context:** Optionally, enable “Extended thinking” mode in VS Code (there’s a toggle) to allow Claude more time/steps when solving complex tasks . This can help when the agent needs to deeply analyze or plan before coding.
    

  

**Plan Mode:** Claude Code has a “Plan” subagent that can outline steps for complex changes. In VS Code’s extension, you can toggle Plan mode to have Claude produce a plan which you can review/edit before execution . In CLI, a similar effect can be achieved by asking Claude to plan first or using commands (we will see custom /plan commands later). Using plan mode for major features is highly recommended, as it forces the agent to think through the approach before editing code – reducing mistakes.

  

## **Integrating Model Context Protocol (MCP) Servers**

  

To give Claude **dynamic, context-specific knowledge**, integrate Model Context Protocol (MCP) servers. MCPs act as tools that Claude can call for supplemental information. The **“MCP stack”** below supercharges Claude Code, addressing its weaknesses (like outdated knowledge or limited project awareness):

- **Context7 (Live Documentation Oracle):** This MCP fetches up-to-date documentation for libraries and frameworks. It’s invaluable for a TanStack + Python stack, ensuring Claude always uses current APIs for things like TanStack Router or React Query on the front-end, and Python libraries on the back-end. _Why?_ Without it, Claude might rely on stale training data and produce incorrect calls. **Context7 fixes that** by pulling _real-time docs_ – “no more ‘wait, is this the old API?’ moments” . It’s like having the official docs at Claude’s fingertips. **Setup:** You’ll need an API key from context7; then register the MCP in Claude Code (e.g. via CLI: claude mcp add --transport sse context7 https://mcp.context7.com/sse ). Once added, Claude can call resolve-library-id and get-library-docs actions to retrieve library docs as needed – for example, pulling the latest **TanStack Query** usage or the correct **SQLAlchemy** function syntax.
    
- **Serena (Semantic Code Search):** Serena is a semantic codebase searcher and editor. It indexes your project and lets Claude retrieve code context by _meaning_, not just exact keyword matches . This is crucial in a large full-stack project where related logic might span files or use different naming. Serena “doesn’t just grep your code – it understands what your code does,” meaning you can ask, _“Where do we handle user authentication?”_ and it will surface relevant code across your TypeScript and Python modules . For our stack, that might help find where API calls are made on the front-end and the corresponding backend endpoints, or how data flows to the database. **Setup:** Serena runs as a local server (for example, using the command from its docs: claude mcp add serena --uvx --from git+https://github.com/oraios/serena then start it with serena start-mcp-server --context ide-assistant --project $(pwd) ). Once active, Claude can use Serena’s search or edit tools to locate code by intent and even perform code modifications in context.
    
- **Sequential Thinking (Structured Reasoning engine):** This MCP provides a chain-of-thought planner for complex problems . It helps Claude break down “hairy problems into logical, debuggable steps” – essentially acting as an AI project architect. In our workflow, **Sequential Thinking** can be invoked when Claude faces a non-trivial design decision or multi-step implementation. For instance, if adding a new feature that spans front-end UI, backend API, and database migration, the sequential reasoning tool can guide Claude to map out dependencies and sub-tasks before coding. Many complex tasks benefit from this explicit reasoning step. **Setup:** Add the MCP (e.g. claude mcp add sequential-thinking -s local -- npx -y @modelcontextprotocol/server-sequential-thinking ). Claude can then use the sequentialthinking tool to analyze and plan. _Note:_ Some users report Claude has strong built-in reasoning and may do this automatically, but explicit sequential steps can still improve clarity . We’ll leverage this for the **analysis & planning phases** of tasks.
    

  

These three MCP servers – **Context7, Serena, and Sequential Thinking** – are widely regarded as a “best stack” to use with Claude Code . Together, they dramatically improve accuracy and relevance of Claude’s coding suggestions. In practice, using them transformed one developer’s workflow: _“Sequential Thinking mapped out requirements and dependencies, Serena found our existing code patterns, Context7 pulled the latest docs, and Claude synthesized a solution that fit perfectly”_ . We aim to achieve the same level of quality and speed.

  

> **Tip:** After adding MCPs, you can craft a _prompt or slash command_ to remind Claude to use them. For example, one power-user created a /go command that tells Claude: **“Always use Serena for code retrieval, Context7 for docs, and Sequential Thinking for decision making; and read the CLAUDE.md root file before doing anything.”** . This ensures the AI consistently leverages these tools for every task.

  

## **Providing Project Context with CLAUDE.md and Skills**

  

To guide Claude effectively across the full stack, we need to supply it with **project-specific context and guidelines**. Claude Code offers two key mechanisms for this: **CLAUDE.md files** and **Agent Skills**.

  

### **Documenting the Project in CLAUDE.md**

  

A CLAUDE.md file is an ideal place to put high-level information about your project that you want Claude to **always remember**. Claude Code automatically loads this file at session start , so it acts like persistent context or “instructions” for the AI. In a full-stack TanStack/Python project, you should include:

- **Build & Run Commands:** Document common scripts. For example:
    
    - _Front-end:_ npm run dev (for local dev server), npm run build (Vite build), npm test (if front-end tests exist).
        
    - _Back-end:_ pytest for running tests, docker build commands, or any special run scripts.
        
    - _Deployment:_ Commands or steps for Cloudflare (e.g. using wrangler CLI for Workers/Pages) and Railway (perhaps railway up or note that deployment is via pushing to a branch).
        
    
- **Project Structure & Key Files:** Outline the repository layout and important files. E.g. “/frontend/ contains the React app (Vite config in vite.config.ts), /backend/ has a FastAPI app (Dockerfile, etc.), shared config in .env files, etc.”
    
- **Code Style & Conventions:** List any stylistic or architectural guidelines. For front-end, maybe “Follow React Hooks rules, use TanStack Query for data fetching (no direct fetch calls), state management via context if needed.” For back-end, “Use Pydantic models for request/response schemas, follow repository pattern for DB access,” etc. Also include general style (e.g. TypeScript uses ES module imports, Python uses black/flake8 style) .
    
- **Testing and QA:** Note how to verify changes. “Run npm run typecheck and npm run test before commit” , “Ensure all Pytest tests pass; check coverage,” or “manual test in dev environment at localhost:3000 and localhost:8000.”
    
- **Environment and Dependencies:** Mention versions or special setup (Node version, Python version, any polyfills needed, etc.), and any gotchas (e.g. “app uses Cloudflare KV via environment variable X,” or “Railway’s Postgres URL is provided via env var DATABASE_URL”).
    
- **Security/Compliance Notes:** Even though we have no strict compliance requirement here, any security-sensitive notes belong in CLAUDE.md. For example: “**IMPORTANT:** Never hardcode secrets or credentials – use environment variables. Sanitize user inputs (prevent SQL injection and XSS).” Such notes will remind Claude to adhere to security best practices.
    

  

Keep the CLAUDE.md **concise and bullet-pointed** (as above) for readability . The idea is to give Claude the _critical context at a glance_. This reduces the need for repeated explanations and helps avoid AI mistakes that stem from missing context. If you iterate on CLAUDE.md content, treat it like code: refine it over time for clarity and include it in version control so the whole team benefits .

  

> **Pro Tip:** You can quickly add to CLAUDE.md during a session by typing # followed by an instruction; Claude will incorporate that into the file for next time . For example, after solving a tricky deployment bug, you might add a line to CLAUDE.md about it so the AI doesn’t repeat the mistake.

  

### **Creating Auto-Loaded Skills for Additional Context**

  

**Skills** in Claude Code are another powerful way to inject context or behavior. A _skill_ is essentially a snippet of instructions or information that Claude can load _automatically_ when certain topics arise . Skills are stored as YAML or Markdown files (in ~/.claude/skills for personal, or in your project’s .claude/skills/ directory for project-specific skills) . Each skill has a **description** that acts as a trigger, telling Claude _when to load it_.

  

Use skills to cover auxiliary or detailed context that might not live in CLAUDE.md or to enforce consistent behavior. Some useful skills for our scenario:

- **“Tech Stack Overview” Skill:** A skill that reiterates the core technologies and how they interact. Content example: “This project uses a React frontend with TanStack Router/Query and a Python FastAPI backend. The frontend calls the backend via REST JSON APIs; state is managed via TanStack Query for server state. The backend uses SQLAlchemy to interact with PostgreSQL. Auto-invoke when user asks about data flow, API integration, or mentions ‘TanStack’ or ‘SQLAlchemy’.” The skill ensures that whenever we discuss these layers, Claude has a quick refresher of the architecture.
    
- **“Database Schema” Skill:** Provide a summary of key database tables and fields, or an ERD in text form. Trigger it when Claude needs to write or modify database queries or models (e.g. trigger words: “SQL”, “database”, “query”, table names). This helps the AI avoid hallucinating table/column names and use the actual schema.
    
- **“Security Best Practices” Skill:** Remind Claude of security measures. Content could list things like “Use parameterized queries or ORM (no raw string SQL concatenation) to prevent SQL injection; encode output to prevent XSS; validate inputs; never log sensitive info; enforce auth checks on protected endpoints.” Trigger on keywords like “login”, “SQL”, “sanitize”, “password”, etc., or more generally whenever implementing backend logic. This skill acts as a safety net so that in the implementation phase, the AI doesn’t propose insecure code. (While Claude generally tries to produce safe code, an explicit reminder helps.)
    
- **“Coding Style/Lint Rules” Skill:** If you have strict lint or formatting rules (ESLint, Prettier for TS, PEP8/flake8 for Python), you can write a skill summarizing those conventions. E.g. “Auto-invoke when working with TypeScript files. Ensure code follows our style: use const/let appropriately, no unused vars (ESLint rules), prefer functional components and hooks, etc. Do NOT use any banned patterns (X).” Similarly for Python, “use type hints, follow black formatting, no wildcard imports,” etc. Trigger on file types or keywords.
    
- **“Project Management” or “Persona” Skills (optional):** If relevant, you could add skills about the project’s stakeholders or user personas (useful if Claude is asked to write user stories or documentation). For example, a skill about a product owner’s preferences or a user persona details. This is more auxiliary but demonstrates the flexibility of skills .
    

  

When creating skills, **be specific in the description** about **when to load and when not to**. A _“WHEN/WHEN NOT”_ pattern in descriptions greatly improves auto-invocation accuracy . For instance, instead of “Provides information about the database,” write “**Auto-invoke when** the conversation involves SQL queries, database schema, or migrations. **Do NOT load for** general discussions unrelated to data storage.” This clarity ensures Claude triggers the skill exactly when needed, and not on irrelevant occasions .

  

Skills are essentially **automatic context injections**. They function like extended memory – “I want Claude to remember X automatically → use a Skill” . Unlike CLAUDE.md (which is always loaded globally), skills can be finer-grained, loading only for relevant topics. This helps keep Claude’s context focused and under token limits, while still providing rich info when necessary. In our setup, the combination of a comprehensive CLAUDE.md and targeted skills ensures Claude is aware of our stack’s details at all times (without us re-describing things each time).

  

## **Custom Slash Commands for Workflow Automation**

  

Claude Code allows defining custom **slash commands** – think of these as shortcuts or macros that either expand to some prompt text or trigger certain agent actions. We will create commands to streamline frequent tasks and orchestrate multi-step workflows with a single user input .

  

Commands can do a few things: they can inject a pre-defined prompt (possibly with placeholders for arguments), run simple shell scripts, or invoke subagents (specialist agents) for complex flows . They reside in .claude/commands/ as YAML files. Here are some useful commands to consider:

- **/go** **(Setup & Kickoff Command):** As inspired by Robert Marshall , this command can set the stage for any development task. It might inject a system prompt telling Claude to utilize our tools and context: for example, “Always use Context7 for docs, Serena for code search, Sequential Thinking for planning. Refer to CLAUDE.md for project specifics. Now proceed with:$ARG” (where $ARG will be the task description you type after /go). This single command ensures every time you ask Claude to do something (like “/go Add a new login route”), it’s operating with the full power of the integrated tools and knowledge. Essentially, /go becomes the default way you tell Claude to handle a task, guaranteeing it doesn’t forget to leverage our MCPs and skills.
    
- **/plan** **(Planning Phase Command):** This command can trigger a dedicated _planning sub-agent_ or sequence. One approach is to have /plan <feature_or_change> instruct Claude (perhaps via a subagent, see next section) to produce a **detailed plan** for implementing the given feature/change. The plan could include an outline of files to modify, functions to write, and a step-by-step strategy (covering both front-end and back-end work). In practice, this might call a subagent that only has planning tools (read/search, sequential thinking) and no write access, to purely brainstorm and output a markdown plan . The result can be presented to you for review. This is similar to using Claude Code’s built-in plan mode, but as a custom command you have more control. By separating planning, you ensure the **analysis & design** gets its due attention before coding begins.
    
- **/execute** **or** **/implement** **(Implementation Command):** After a plan is ready (either from /plan or your own outline), you could use a command to tell Claude to execute it. For example, /implement featureX-plan.md might load a file (the plan) and instruct Claude to carry it out step by step. In fact, some community workflows (like Tâches’ _create-plans_ skill) do exactly this: generate a PLAN.md, then run it via an execution command that sequentially applies each step . You can manually do this by copying the plan into the prompt, but a command ensures consistent handling (and possibly uses hooks to segment tasks, handle errors, etc.). This gives a structured **implementation phase** where Claude focuses on coding as per the approved plan.
    
- **/test** **(Run Tests Command):** Testing is part of validation, and you can automate it. A /test command might simply run your test suites using the Bash tool. For instance, it could be configured to execute npm run test && npm run build for the front-end and pytest for the back-end, then return the results. This saves you from typing out those commands or manually approving each. If tests fail, you and Claude see the output, and you can then enter a debugging loop. (We can also make Claude call this command itself at the end of implementation via a hook or instruction – more on that soon.)
    
- **/deploy** **(Deployment Command):** Deploying to Cloudflare and Railway might involve multiple steps – e.g. building the front-end and publishing it, pushing Docker image to Railway or triggering a deploy. While one could integrate CI/CD outside Claude, you might set up a command for development convenience. For example, /deploy front could run a Cloudflare Pages publish command (assuming configuration is done), and /deploy back could build and push the Docker image. Or a single /deploy could do both. _Use with caution:_ It’s powerful to have Claude deploy, but ensure everything is tested first. You might keep this as a separate step you trigger only when ready.
    
- **Utility Commands:** Other shortcuts might include /db-migrate to run database migrations (if using Alembic or Prisma or similar), /format to run Prettier/Black on the codebase, or /open-doc <library> to quickly fetch docs via Context7 (though Claude might do that automatically, a command could explicitly fetch and show docs for a given lib). If you find yourself frequently guiding the AI through a repetitive multi-step fix, consider bundling that into a command.
    

  

Technically, many slash commands are either front-ends to subagents or to simple scripts . For example, you might have a “PlanAgent” subagent and /plan simply invokes it; or /test just runs a bash command internally. Define commands in YAML with a description and either an action (like calling a subagent) or direct bash to run.

  

By creating intuitive commands, we achieve a **streamlined developer experience:** instead of lengthy prompts like _“Please analyze X, then do Y…”_, you issue /<command> argument and Claude knows what to do. This not only speeds things up but also reduces ambiguity, since the command encapsulates best-practice prompts you’ve pre-defined.

  

## **Leveraging Sub-Agents for Specialized Tasks**

  

**Sub-agents** (or just “agents” in some docs) are custom-configured AI personas that operate under specific instructions and tool restrictions. In Claude Code, subagents allow you to break a complex workflow into parts – each handled by a specialized agent – rather than one monolithic AI doing everything. This aligns perfectly with the development phases: we can have different subagents for **analysis/planning**, **implementation**, **validation**, etc. Indeed, a common pattern is: _“I want to automate Y workflow step-by-step → use a Subagent.”_

  

Key points about subagents:

- They have their own **system prompt** (defining their role/goals) and can be given access to a subset of tools. For example, an “Analyst” subagent might only use read/search tools but not write code, whereas a “Coder” subagent can edit files and run code.
    
- You invoke a subagent either by name in the prompt (e.g. @planner-agent, …) or via a slash command that calls it .
    
- Subagents can call each other or return control to the main Claude agent. You can design an orchestrator (main agent) that delegates work to subagents for certain stages.
    

  

For our **bulletproof workflow**, we can define a few subagents:

- **Analysis/Planning Agent (e.g.** **planner-agent****):** This agent’s job is to _comprehend requirements and produce a plan_. Its prompt would encourage thorough analysis: e.g. “You are a planning assistant. You will receive a feature/task description. Break it down into requirements, identify which parts of the codebase are affected (front-end vs back-end vs DB), and output a step-by-step plan for implementation, including any design decisions. You have access to reading code (ReadFile, Grep, Serena search) and documentation (Context7) and reasoning (SequentialThinking). You **do not** write code changes yourself.” By restricting its tools to analysis ones (no direct editing), this subagent will focus on thinking and outlining . When invoked (say by /plan), it might output a structured plan: e.g. “1. Update API endpoint X in backend, 2. Add new React component Y, 3. Adjust DB schema if needed, 4. Write unit tests…”. This corresponds to the **analysis + planning phase** – get everything figured out on paper (well, on markdown) before coding.
    
- **Main Implementation Agent (the default Claude or** **developer-agent****):** This is the agent that actually writes and modifies code according to the plan. In many cases, you can use the default Claude Code session as the implementer, especially if you feed it the plan and your CLAUDE.md context. However, you could also formalize it as a subagent with a specific persona, e.g. “Senior Full-Stack Developer Agent” that has full access to editing, bash, etc., and perhaps a bit more caution or style guidance in its prompt. The main agent will take the plan (from the planner) and execute it. One effective approach is exactly what we discussed: **Planner subagent does analysis, main Claude executes** the changes . This division of labor mimics a real team where an architect plans and a developer implements – it tends to produce better results than a single agent trying to do everything at once.
    
- **Testing/Validation Agent:** After implementation, it’s useful to have a specialized agent to verify the changes. This could be a “QA agent” or simply a routine run by the main agent. For example, a subagent could be configured to run tests and analyze the output (with maybe some known strategies for debugging). However, often you can handle validation without a separate agent: by using hooks or by instructing Claude (main agent) to run tests and fix any failures. If you want to be thorough, you might define a subagent with expertise in testing or even security analysis (for instance, a “Security Auditor” agent that runs static analysis tools or checks for OWASP vulnerabilities in the code). For brevity, we might not need a distinct subagent here – a combination of automated test runs and maybe a security scan script could suffice – but know that subagents _could_ be made for these roles if desired (and indeed community members have created many such specialized agents ).
    
- **Utility Agents (optional):** Depending on your project, you might add others – e.g. a “DB migration agent” to create complex migration scripts, or a “Documentation agent” to update README/docs after a feature. Each would have a tailored prompt and toolset. These aren’t strictly necessary but illustrate the modularity.
    

  

When designing subagents, keep them **concise and targeted**. You don’t need 1000-line prompts for each agent – in fact, “subagents should be concise, not comprehensive; Claude is smart enough to work with well-structured guidance” . Each agent’s instructions should clearly outline its scope (analysis vs coding vs testing) and any special knowledge or tools it should use.

  

We will orchestrate these agents in the workflow. Typically, you might manually trigger them with commands: e.g. you run /plan FeatureX which invokes the planner subagent and returns a plan. Then you approve or tweak the plan, and either manually prompt main Claude to implement it, or run /implement PlanX. However, you can streamline this with **commands and hooks** so that it feels like a continuous pipeline.

  

In summary, subagents allow Claude Code to mimic a **multi-role team**: one “AI member” analyzes and plans, another codes, another tests. This reduces errors and oversights because each subagent is focused and can even use different strategies. For instance, the planner can do heavy reasoning (with sequential thinking MCP) without being distracted by code editing, while the coder can be set to strictly follow the given plan and project standards. Users have found that complex tasks benefit from this specialist approach – the AI effectively “consults” with itself in different modes and produces more reliable outcomes.

  

## **Establishing a Phased Workflow (Analysis → Plan → Implement → Validate)**

  

Now let’s put it all together into a cohesive workflow that spans the entire development cycle for a given task. Our goal is to make the AI agent **operate across analysis, planning, implementation, and validation phases** methodically. This section outlines how you might execute a feature from start to finish using the configurations above:

1. **Kickoff / Analysis:** Begin by describing the feature or problem to Claude. For example, “We need to add a new user profile page where users can update their bio. This requires a new frontend route, a backend API endpoint, and a database field for bio.” Instead of directly asking for code, you invoke your **planning command**: **/plan "Add user profile page with editable bio"**.
    
    - This triggers the _Planner subagent_ which uses **Sequential Thinking** to clarify requirements and possibly ask follow-up questions (Claude might ask if there’s an existing user model, how authentication is handled, etc., which you answer).
        
    - The planner then uses **Serena** to scan relevant parts of the code (maybe finding the User model in Python and the routing setup in React) and **Context7** to check any library usage (perhaps looking up the TanStack Router docs for adding a new route).
        
    - It produces a structured **Plan**. For example, it might output:
        
        1. **Database** – Add a bio column to the users table (and a migration).
            
        2. **Backend** – Create an API endpoint /api/user/updateBio to update the bio (validate input, save to DB).
            
        3. **Frontend** – Add a /profile route in TanStack Router; create UserProfile.tsx component with a form to edit bio; use TanStack Query to fetch and mutate user data via the new API.
            
        4. **Validation** – Update or write tests for the new API and frontend component; ensure authentication is required to access profile.
            
        
    - This plan can be saved to a PLAN.md or posted in the chat for review. **Review the plan**: thanks to the analysis phase, it should be logical and aligned with project patterns (the planner likely even found _where_ in the code to add things, e.g. which file defines routes). You can edit or add any steps if you notice something missing.
        
    
2. **Planning Approval:** Once you’re satisfied, you signal Claude to proceed. If using a manual approach, you can simply say “Sounds good. Please implement this plan.” If using structured commands, you might run **/implement PLAN.md** or similar, which passes the plan to the main agent. In some setups (like Tâches _create-plans_ skill), there’s an explicit step to convert the plan into executable tasks , but you can also trust Claude to follow the markdown plan itself.
    
    - It’s worth noting you could use Claude Code’s **Plan Mode UI** here: in VS Code, switch to plan mode so that Claude enacts the plan step by step with you approving each change, or use the CLI in segments. This gives you a checkpoint before major changes.
        
    
3. **Implementation (Coding Phase):** The main Claude agent (with full tool access) now takes over to implement each step:
    
    - It will start editing files to add the bio field (maybe creating a Alembic migration if using one, or altering an SQLAlchemy model and generating a migration script).
        
    - Then it will create the new backend route/handler function in the Python code. Because **Context7** is available, if Claude needs to recall how to integrate with your framework (say FastAPI syntax for adding a new endpoint), it can fetch that documentation on the fly . Because the plan likely references existing patterns (maybe “use the existing user update logic as reference”), Claude can also use **Serena** to open those files and ensure consistency (e.g. find how authentication is checked in other routes, and replicate it) .
        
    - Next, it moves to front-end: it will add the new route in your router configuration, create the UserProfile.tsx component file, use TanStack Query’s hooks for data fetching/updating. Here again, **Context7** might pull up TanStack Query docs if needed to ensure correct usage of useQuery and useMutation for form submission, etc. The agent writes the TypeScript code, possibly consulting CLAUDE.md or a style skill to keep code style consistent (like ensuring it uses functional components with proper hooks).
        
    - Claude will usually do this in a logical order, but if it ever gets off track, you can intervene. Ideally, because it’s following the plan, it should be clear about what to do next. Each file edit or command it wants to run will either auto-apply (if you allowed it) or prompt you for approval. You can generally allow file edits freely (Claude Code lets you always-allow edit and similar safe actions to streamline work ).
        
    - Keep an eye on the changes: since you gave it architecture context and the plan, the code should align with your expectations. For example, you should see it adding the bio field in both backend and front, not naming things weirdly, etc. If something is off, correct Claude or adjust the plan.
        
    - This phase ends when Claude believes it has completed all steps of the plan. It might summarize “Implemented all steps. Next, we should run tests.”
        
    
4. **Validation (Testing & Review Phase):** Now it’s time to verify the changes:
    
    - Have Claude run the test suites. You can literally ask: “Run the tests to validate everything.” If you set up the /test command or a Post-implementation hook, this might happen automatically. For instance, a **PostToolUse hook** could detect when Claude finishes a series of edits (or when it’s “Stop” event fires after answering) and trigger npm run build && npm test && pytest behind the scenes. But it may be simpler to explicitly instruct the agent or call /test.
        
    - Claude executes the tests using the Bash tool and returns the results. If all tests pass and the build succeeds, fantastic – you have high confidence the changes are correct. If there are failures or errors:
        
        - We enter a debug loop: The agent (or a specialized testing subagent) can analyze the error messages. Thanks to its context, it will know where to look – perhaps using Serena to open the file referenced in a stack trace, etc.
            
        - Claude suggests a fix for each issue. This is essentially an iteration of the implementation phase for bugfixing. It edits code to address failing tests or runtime errors, then you run tests again. This loop continues until green.
            
        - If new bugs or edge cases come up, the agent might use **Sequential Thinking** again to reason out a solution (especially if the fix is non-trivial). You can also prompt it to consider if there are any **edge cases or additional validation needed** (it might then load the Security skill or recall best practices to add, say, input validation on that new bio field if not already done).
            
        
    - Optionally, consider a **code review** step: you can ask Claude (perhaps via a slash command or a skill) to perform a self-review of the diff and point out any potential issues or improvements. There are community plugins for PR review that do this . This can catch things like missing null checks or stylistic issues that tests didn’t cover.
        
    
5. **Deployment or Next Steps:** Once validation is done, you can proceed to deploy. If you have a /deploy command, you might run it now. Claude will package the front-end (Vite build output) and publish it to Cloudflare (make sure credentials or API tokens for Cloudflare are available, maybe via environment), and push the backend container to Railway. If you prefer, you can do the deployment manually, but having Claude generate the Dockerfile or deployment script earlier ensures it’s ready. **Be cautious** when letting Claude deploy: double-check configuration to avoid accidents (e.g. deploying to production accidentally). It’s often wise to deploy to a staging environment first.
    
    - Claude can also automate creating a Git commit or PR. Because it knows how to use the gh CLI and Git, you could have it commit the changes and even open a pull request with a summary. Claude Code is capable of drafting commit messages describing what was done.
        
    - These final steps can be fully automated or manual as fits your workflow. In a team setting, you might just use Claude to prepare the code and tests, then you push through the normal review process.
        
    

  

Throughout all phases, our configuration has been doing heavy lifting:

- **MCPs** ensured Claude had **knowledge and context** (current documentation, awareness of our codebase’s relevant parts, and the ability to reason through complex tasks).
    
- **Skills and CLAUDE.md** ensured it adhered to **project specifics and best practices** automatically (like using TanStack Query correctly and keeping security in mind).
    
- **Subagents** broke the work into manageable chunks with different focuses (plan vs code vs test), so the AI didn’t jumble these steps or skip analysis.
    
- **Commands and Hooks** provided a **smooth user experience**, reducing manual prompt writing and enforcing consistency. For example, you could set a PreToolUse hook to automatically run Prettier/ESLint on any edited TypeScript file, so the code is always formatted . Or a PostToolUse hook on file writes that runs npm run typecheck to catch type errors immediately – feeding that feedback to Claude without you even asking. Hooks give “deterministic control” to ensure certain actions _always_ happen at given points , which is far more reliable than hoping the AI remembers to do it.
    

  

**Result:** By the end of this workflow, you’ve essentially had Claude operate like a diligent engineer: analyzing requirements, designing a solution, coding it across multiple layers, and testing it thoroughly. This structured, tool-augmented approach significantly reduces the chance of errors or oversights. In fact, anecdotal reports from early adopters of such setups show major improvements: tasks completed faster and with better quality, fewer context-switches for the human, and an AI that feels less like a “code generator with amnesia” and more like a competent collaborator .

  

## **Using Plugins to Package Your Setup**

  

Claude Code introduced **plugins** as a way to bundle and share configurations of commands, subagents, MCP setups, and hooks . If you want to reuse this full-stack setup across projects or share it with teammates, consider turning it into a Claude Code plugin.

  

A plugin is basically a repository (or local folder) that contains a .claude-plugin directory with YAML files defining all the slash commands, agents, etc., plus a manifest. By packaging your **slash commands**, **subagents**, **MCP server configs**, and **hooks** into a plugin, you enable others (or your future self on a new project) to install it with a single command (e.g. /plugin install my-fullstack-setup) and instantly get the same capabilities. This promotes consistency across the team.

  

For example, you might create FullStackPlugin that, when installed:

- Adds the Context7, Serena, and SequentialThinking MCP entries automatically.
    
- Provides the /go, /plan, /implement, /test, /deploy commands pre-configured.
    
- Registers the planner-agent and any other subagents.
    
- Sets up hooks (like auto-format on save, or run tests on Stop event, etc.).
    
- Even includes some skills or CLAUDE.md templates if appropriate.
    

  

With a plugin, onboarding a new developer or starting a new similar project becomes easier – just install the plugin and Claude Code is ready to work with the same “brain” and workflow you’ve defined. Anthropic expected such use cases: _“Plugins help you standardize Claude Code environments around a set of shared best practices”_ , _“bundling customizations that work together for specific use cases”_ – exactly what our full-stack configuration is.

  

There are already community-driven plugin marketplaces. For instance, Dan Ávila’s marketplace offers DevOps and testing plugins, and another collection provides 80+ subagents for specialized tasks . It’s worth exploring those; you might find a pre-made plugin for common needs (perhaps one that handles typical Rails/React or Node/DB workflows which can be adapted to our stack). If not, yours could contribute to filling that gap.

  

To create a plugin, follow Claude’s docs or use the /plugin create command in Claude Code which guides you. And remember, plugins can be toggled on/off easily – so you can enable your full-stack plugin when working on TanStack/Python projects and disable it if you switch to a different context, keeping Claude’s mind uncluttered.

  

## **Security Best Practices for Claude Code Agents**

  

Even without strict compliance requirements, it’s important to enforce **“good sense” security** in this AI-driven workflow. We’re essentially giving an AI significant control over our codebase and environment; thus, we should configure boundaries to prevent accidents or abuse (especially relevant if using Claude Code on private code or with production deployment capabilities). Here are some security considerations and features:

- **Principle of Least Privilege:** Only allow Claude the access it truly needs. Claude Code by default starts in read-only mode and asks permission for actions . Continue to require confirmation for sensitive operations (e.g., deploying to prod, modifying critical infrastructure files). You can customize the allowlist of commands – for example, auto-allow edits and test runs (to avoid fatigue from too many prompts), but **do not auto-allow destructive commands** like database resets or mass file deletions . You might explicitly **block** certain commands via hooks or config (for instance, disallow any rm -rf or deletion of certain directories).
    
- **Filesystem & Network Sandboxing:** In October 2025 Anthropic introduced a sandboxing feature that is a game-changer for safe autonomy. It confines Claude’s file access to your project directory and restricts network access to only approved domains . This means you can let Claude run tools and tests freely _within_ a sandbox without prompting every time, confident it can’t touch your home folder or exfiltrate data. Enabling the **sandboxed bash tool** (via the /sandbox command) is highly recommended . You can configure which directories are accessible (e.g. your project folder, maybe a temp build dir) and which external hosts are allowed (perhaps GitHub, context7 API, etc.) . This yields **84% fewer permission prompts** in Anthropic’s testing while _increasing_ security – a win-win: Claude can run many actions autonomously during implementation and testing, and you only get prompted if it tries to do something outside the sandbox. We suggest setting the sandbox to include your project workspace and perhaps a safe temp directory, and limiting network access except for essential APIs (like documentation servers). This will prevent any accidental destructive command from affecting your wider system and stop any potential “prompt injection” attacks from contacting malicious servers.
    
- **Sensitive Data and Secrets:** Never store secrets (API keys, passwords) in prompts, skills, or CLAUDE.md. If Claude needs an API key (e.g. for Context7 MCP), it should be loaded from environment or a secure store, not hard-coded. Moreover, be cautious if you ever let Claude have access to credentials (like deployment keys) – with sandboxing and proper allowlist, you can ensure it only uses them in intended ways. It’s good to keep production credentials outside of the Claude environment; for deployment, perhaps have it trigger a CI pipeline rather than directly pushing code from your machine.
    
- **Hooks for Protection:** Use **hooks** to enforce security rules. For example, a **PreToolUse hook** can act as a gatekeeper for certain tools: if Claude tries a potentially risky bash command, the hook can intercept and decide to block it unless certain conditions are met . A _“file protection”_ hook could prevent editing of specific critical files (maybe .env or deployment scripts) unless you explicitly allow it . A _“logging”_ hook can record all commands Claude executes to an audit log , so you can review them later for any suspicious activity. Given our workflow, a useful hook might be: _if Claude attempts to run a deployment command outside of a_ _/deploy_ _invocation (i.e. unexpectedly), block it and ask for confirmation._ This ensures the AI doesn’t push code without human go-ahead.
    
- **Human Oversight:** Even with automation, keep a human in the loop for final decisions. Use plan mode or review diffs of significant changes. Encourage Claude to explain its reasoning, especially for critical changes. This guide’s workflow already inserts a review stage (the planning review and test review). Stick to that – do not blindly accept everything. That said, with the configuration recommended, Claude is more likely to produce correct and safe outputs on the first try , but vigilance is always prudent.
    
- **Updates and Model Behavior:** As models update, monitor if your skills or instructions still yield the desired compliance. Occasionally, re-run your CLAUDE.md through Anthropic’s _prompt improver_ or simply observe if Claude deviates from any guidelines and adjust accordingly (for example, if it starts to ignore a security instruction, you might need to emphasize it more or update phrasing).
    

  

In short, treat Claude Code as you would a powerful script running on your machine: give it defined boundaries (via sandbox), enforce rules (via hooks/permissions), and keep an eye on it. Claude Code’s design is **“conservative by default”** with permissions ; by configuring things like sandbox and specific hooks, we can actually allow it to do more on its own (reducing prompt fatigue) **while staying safe** . This yields a development flow that is fast but doesn’t cut corners on security.

  

## **Conclusion**

  

By configuring Claude Code with the above **MCP integrations, skills, commands, subagents, hooks, and plugin packaging**, you equip the AI to be a true full-stack assistant. It will understand your TanStack/TypeScript + Python project in context, use the latest best practices from documentation, recall your project’s specific details, and follow a structured approach to build and verify features.

  

This “bulletproof” workflow mirrors how an experienced development team operates: careful planning, adherence to standards, iterative implementation with continuous testing, and safeguarding of quality and security at each step. Developers who have adopted similar setups report dramatic improvements – faster completion of complex features (60–70% time reduction in one case) and higher code quality with fewer bugs – all while reducing the mental load on the human coder.

  

Remember that every project is unique, so feel free to tweak the skills and commands. The core ideas remain: **give Claude as much relevant knowledge as possible, break tasks into phases, and let tools/automation enforce the process.** With this configuration, Claude Code can truly function as an “AI pair programmer” that not only writes code, but also plans, reviews, and deploys it following the best practices of modern full-stack development.

  

By implementing this state-of-the-art setup, you’re at the cutting edge of AI-assisted software engineering. Happy coding with Claude, and enjoy the newfound efficiency and confidence in your TanStack + Python projects!

  

**Sources:**

- Anthropic Claude Code Documentation and Blog – _Claude Code Plugins and Extensibility_ , _Claude Code Best Practices_ , _Claude Code Sandboxing (Security)_ .
    
- Community Guides – _Understanding Claude Code: Skills vs Commands vs Subagents vs Plugins_ (J. Conneely, Oct 2025) , _Turning Claude Code into a Development Powerhouse_ (R. Marshall, Aug 2025) .
    
- Claude Code user resources – Tâches Claude Code Resources (glittercowboy) , Context7 MCP (Upstash) , Serena (OraiOS) , Sequential Thinking MCP , and various Reddit discussions detailing workflow optimizations.