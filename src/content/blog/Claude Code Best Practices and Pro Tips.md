---
title: "Claude Code: Best Practices and Pro Tips"
author: Stephane Busso
description: This guide provides tips and tricks for effectively using Claude Code, a command-line tool for agentic coding.
published: true
tags:
  - claudecode
updated: 2025-06-15T18:33
created: 2025-06-15T18:30
cover:
---

This guide provides tips and tricks for effectively using Claude Code, a command-line tool for agentic coding.

### Using Claude Code as a Bash CLI

Claude Code (often invoked as `claude` or `cc`) can be used similarly to other bash-based command-line interfaces.

1.  **Use CC as a bash CLI**
    You can perform many standard command-line operations. For example, to checkout a new branch and lint the project:
    ```bash
    claude "checkout a new branch and lint this project"
    ```

2.  **Pass command line arguments to CC**
    Arguments passed to `claude` on startup will be run. For instance:
    ```bash
    claude "How does turnManager.js work?"
    ```

3.  **Use `claude -p` for headless mode**
    The `-p` flag allows Claude Code to run in headless mode, meaning it will output the result directly to the terminal without entering the interactive interface.
    ```bash
    claude -p "How many files are in this project?"
    ```
    Output might be:
    ```
    834 files
    ```

4.  **Chain CC with other CLIs**
    You can pipe the output of other commands into Claude Code or vice-versa.

5.  **Pipe data into CC**
    For example, to analyze a CSV file:
    ```bash
    cat data.csv | claude -p "Who won the most games?"
    ```
    Output might be:
    ```
    Based on the data, Rusty won the most games with 3 wins.
    ```

6.  **Run instances in parallel**
    You can have multiple Claude Code instances running simultaneously, perhaps in different terminal tabs or windows, each working on different tasks or parts of a project.

7.  **Ask CC to run "subagents" (Tasks)**
    Claude Code can launch instances of itself to perform sub-tasks. This is often indicated by a `Task(...)` in the Claude Code output. For example, if you ask Claude to find where `gameState.direction` is modified, it might spin up a subagent:
    ```
    Task(Find where gameState.direction is modified)...
    ```

### Claude Code + Images

Claude Code has powerful capabilities for working with images.

8.  **Drag Images into CC**
    You can drag an image file directly into the terminal window where Claude Code is running. Claude will then be able to "see" and analyze the image.
    ```
    > [Image #1]
    ```

9.  **Copy-paste images**
    On macOS, you can copy a screenshot to your clipboard using `Shift + Command + Control + 4`, then select an area. Paste it into Claude Code using `Control + V` (not `Command + V`).
    ```
    > [Image #1]
    ```

10. **Give CC mockups**
    You can provide Claude Code with image mockups of a UI and ask it to build the interface. Paste the mockup image and then prompt:
    ```
    > [Image #1]
    > Build the HTML and CSS for this UI mockup.
    ```

11. **Use screenshots as feedback**
    To iterate on a design or fix a UI bug:
    *   Ask Claude Code to build something.
    *   Open what it built in a browser.
    *   Take a screenshot.
    *   Paste the screenshot into Claude Code.
    *   Provide feedback, e.g., "The button in this screenshot [Image #1] should be blue."

12. **Automate feedback with Puppeteer**
    You can set up a Puppeteer MCP (Model Context Protocol) server locally. Then, Claude Code can use Puppeteer to open a web page, take a screenshot, and save it.
    First, ensure your Puppeteer MCP server is running. Then, in Claude Code:
    ```
    > /mcp
    MCP Server Status
    * Puppeteer: connected

    > Open http://localhost:1234 and take a screenshot named 'welcome-screen'.
    ```
    Claude Code might respond with:
    ```
    puppeteer:puppeteer_navigate (MCP){url: "http://localhost:1234"}...
    Navigated to http://localhost:1234.
    puppeteer:puppeteer_screenshot (MCP){name: "welcome-screen", width: 1024, height: 768}...
    Screenshot 'welcome-screen' taken at 1024x768
    [Image]
    ```

### Claude Code + MCP (Model Context Protocol)

MCP allows Claude Code to interact with various tools and services.

13. **Use CC as an MCP *server***
    Claude Code can function as an MCP server, allowing other agents or tools to interact with it.

14. **Use CC as an MCP *client***
    Claude Code can also act as an MCP client, connecting to various MCP servers to leverage their capabilities. There are many available MCP servers for different services.

15. **Connect your DB with MCP**
    You can use a Postgres MCP server (or other database MCP servers) to allow Claude Code to interact directly with your database.
    After configuring the Postgres MCP server:
    ```
    > Can you see my database?
    ```
    Claude might respond with:
    ```
    * postgres:query (MCP){sql: "SELECT COUNT(*) as total_rows FROM netflix_shows;"}...
    [
      {
        "total_rows": "8807"
      }
    ]
    * postgres:query (MCP){sql: "SELECT * FROM netflix_shows LIMIT 5;"}...
    [
      {
        "show_id": "s1",
        "type": "Movie",
        "title": "Dick Johnson Is Dead",
        ...
      }
    ]
    Your netflix_shows table contains 8,807 Netflix titles with these columns:
    - show_id (text, required) - Unique identifier
    ...
    ```

16. **Connect APIs with MCP**
    MCP servers can act as wrappers around APIs, like the Stripe API.
    After configuring the Stripe MCP server:
    ```
    > what's my current balance on stripe?
    ```
    Claude might respond with:
    ```
    * stripe:retrieve_balance (MCP)
    {
      "object": "balance",
      "available": [
        {
          "amount": 111618,
          "currency": "usd",
          ...
        }
      ],
      ...
    }
    You have $1,116.18 available in your Stripe account.
    ```

17. **Import docs with MCP**
    Some services, like Cloudflare, provide MCP servers to give Claude access to their up-to-date documentation.
    ```bash
    claude mcp add --transport sse sse-server https://docs.mcp.cloudflare.com/sse
    ```
    Then in Claude Code:
    ```
    > how do I deploy this app on cloudflare workers. use the up to date cloudflare docs.
    ```
    Claude might use the MCP server:
    ```
    * sse-server:search_cloudflare_documentation (MCP){query: "deploy static site cloudflare workers pages"}...
    [result]
    <url>https://developers.cloudflare.com/pages/migrations/migrating-from-workers/</url>
    <text>
    # Pages > Migration guides > Migrating from Workers Sites to Pages
    ...
    </text>
    [/result]
    ```

18. **Import docs with URLs**
    If an MCP server for documentation isn't available, you can paste a URL to the documentation directly into Claude Code.
    ```
    > Build the hello world with pydanticai using: https://ai.pydantic.dev/
    ```
    Claude will fetch and use the content from the URL:
    ```
    * Fetch(https://ai.pydantic.dev/)...
    Received 69.8KB (200 OK)
    * Modeling...
    ...
    ```

19. **Import misc knowledge with URLs**
    You can use the fetch capability to provide Claude with any knowledge from a URL that it might need for a task. For example, to build a game based on specific rules:
    ```
    > write pseudo code to describe the rules of uno based on here: https://www.unorules.com/
    ```    Claude will fetch the rules:
    ```
    * Fetch(https://www.unorules.com/)...
    Received 123.8KB (200 OK)
    * Write(file_path: uno_rules.txt)_
    // UNO GAME RULES - PSEUDO CODE
    // Setup:
    // players = 2 to 10 (ages 7+)
    // FOR EACH player:
    //   deal 7 cards
    ...
    ```

### Using `CLAUDE.md` Files

`CLAUDE.md` is a special file that Claude Code automatically pulls into context when starting a conversation.

20. **Use `CLAUDE.md` files**
    This file is an ideal place for documenting:
    *   Common bash commands
    *   Core files and utility functions
    *   Code style guidelines
    *   Testing instructions
    *   Repository etiquette (e.g., branch naming, merge vs. rebase)
    *   Developer environment setup (e.g., pyenv use, which compilers work)
    *   Any unexpected behaviors or warnings particular to the project
    *   Other information you want Claude to remember

    Example `CLAUDE.md` content:
    ```markdown
    # Bash commands
    npm run build: Build the project
    npm run typecheck: Run the typechecker

    # Code style
    - Use ES modules (import/export) syntax, not CommonJS (require)
    - Destructure imports when possible (eg. import { foo } from 'bar')

    # Workflow
    - Be sure to typecheck when you're done making a series of code changes
    - Prefer running single tests, and not the whole test suite, for performance
    ```
    You can place `CLAUDE.md` files in:
    *   The root of your repo.
    *   Any parent of the directory where you run `claude`.
    *   Any child of the directory where you run `claude`.

21. **`/init` creates `CLAUDE.md`**
    Typing `/init` after launching Claude Code in a project directory will prompt Claude to analyze your codebase and create a `CLAUDE.md` file with essential information.
    ```
    > /init
    * /init is analyzing your codebase...
    * I'll analyze this Ruby on Rails codebase and create a CLAUDE.md file with the essential information for future Claude Code instances.
    * Task(Analyze Rails codebase structure)_...
    Done (16 tool uses * 22.2k tokens * 41.8s)
    ...
    ```

22. **`#` adds to `CLAUDE.md`**
    If you prefix a message in Claude Code with a hash symbol (`#`), Claude will ask if you want to save this information to your `CLAUDE.md` file (Project memory).
    ```
    > # always use single responsibility principle when creating new methods
    Where should this memory be saved?
    1. Project memory (Checked in at ./CLAUDE.md)
    2. Project memory (Local) (Gitignored in ./CLAUDE.local.md)
    3. User memory (Saved in ~/.claude/CLAUDE.md)
    ```

23. **`~/.claude/CLAUDE.md` - Global**
    You can set up a global `CLAUDE.md` file in your `~/.claude/` directory. This will be loaded anytime you use Claude Code, across any project.

24. **Use `CLAUDE.md` in subdirs (e.g., tests)**
    You can have `CLAUDE.md` files in subdirectories (e.g., a `/tests` directory) to provide context specific to that part of the project.

25. **Refactor `CLAUDE.md` often**
    `CLAUDE.md` files can grow. Periodically review and refactor them to keep them concise and relevant, as this file is loaded as a prompt with every request. More specific prompts yield better results.

26. **Use Anthropic's prompt improver**
    For complex `CLAUDE.md` files, consider using a prompt optimization tool to help structure and refine the content for better performance with Claude.

### Slash Commands

Slash commands are custom prompts you can define.

27. **Define slash commands in `.claude/commands`**
    Create files in the `.claude/commands` directory (either in your project root or your global `~/.claude/` directory). Each file represents a slash command. These are essentially prompt templates.
    Example `issue.md` for a `/issue` command:
    ```markdown
    Please analyze and fix the GitHub issue: $ARGUMENTS.

    Follow these steps:
    1. Use 'gh issue view' to get the issue details.
    2. Understand the problem described in the issue.
    3. Search the codebase for relevant files.
    4. Implement the necessary changes to fix the issue.
    5. Ensure the code passes linting and type checking.
    6. Create a descriptive commit message.
    7. Push and create a PR.

    Remember to use the GitHub CLI ('gh') for all Github-related tasks.
    ```
    To use it:
    ```
    > /issue 39
    ```

28. **Use args with slash commands**
    As seen above, the `$ARGUMENTS` variable in your command file will be replaced by whatever you type after the slash command.

### UI Tips

29. **Tab to autocomplete filenames**
    When typing filenames or paths in the Claude Code prompt, you can use the `Tab` key for autocompletion. Being specific with file paths helps Claude.

30. **Hit `esc` early and often**
    If you see Claude Code going down the wrong path or taking too long, don't hesitate to press the `Escape` key to interrupt it.

31. **Ask CC to undo**
    After interrupting, you can ask Claude Code to undo its last set of actions.
    ```
    > Undo the previous changes.
    ```

### Version Control

Using Claude Code with version control is highly recommended.

32. **Have CC use version control**
    Instruct Claude Code to use Git commands.
    ```
    > Checkout a new branch named 'feature-xyz' and commit these changes.
    ```

33. **Have CC commit often**
    Ask Claude Code to commit changes after every significant modification. This makes it easier to roll back if needed.
    ```
    > Commit the changes with the message "Implement feature X".
    ```

34. **Have CC write your commit messages**
    Claude Code can often write very good, descriptive commit messages.

35. **Revert more often**
    Don't be afraid to use `git revert` or `git reset` if Claude makes extensive unwanted changes. Sometimes it's faster to revert to a known good state and try a more specific prompt.

36. **Install GitHub CLI (`gh`)**
    Claude Code can use the `gh` CLI for interactions with GitHub, such as creating pull requests or viewing issues.

37. **Or use GitHub via MCP**
    Alternatively, you can configure and use the GitHub MCP server for interactions with GitHub.

38. **Ask CC to file PRs**
    Once changes are committed, you can ask Claude to create a pull request.
    ```
    > Create a pull request for the current branch.
    ```

39. **Ask CC to review PRs**
    You can provide Claude Code with the context of a pull request (e.g., by pasting a link or using the `gh` CLI or MCP) and ask it to perform a code review.

### Managing Context

Effectively managing context is key to getting the most out of Claude Code.

40. **Be aware of upcoming auto-compact**
    Keep an eye on the context left indicator (often in the bottom right of the UI). This tells you how much of the conversation history can be retained before Claude starts automatically compacting (summarizing) older parts.

41. **Proactively compact at checkpoints**
    When you reach a natural breakpoint in your workflow (e.g., after a feature is complete, a bug is fixed, or a commit is made), and you see the context window getting full, consider manually compacting the context using the `/compact` command. This gives you more control over the summarization.
    ```
    > /compact
    Compacting conversation history...
    ```

42. **Consider `/clear` vs `/compact`**
    If the current conversation thread has gone too far off track or contains a lot of irrelevant information for the next task, `/clear` might be better than `/compact`. `/clear` wipes the conversation history, giving Claude a completely fresh start (though it will still have `CLAUDE.md` and file content you provide).

43. **Use scratch pads to plan work**
    Tell Claude to use a scratchpad file (e.g., `SCRATCHPAD.md`) to outline its plan, list files it will modify, or jot down thoughts before making changes. This helps you guide its process and makes the context more explicit.
    ```
    > Plan the refactor of game.js in SCRATCHPAD.md before making changes.
    ```

44. **Use GH issues to plan work**
    Alternatively, use GitHub issues to define tasks and plans. You can then refer Claude to these issues.

45. **Smaller context -> lower cost**
    If you are on a token-based pricing plan, actively managing and minimizing the context (by clearing, compacting, and using external memory like files and `CLAUDE.md`) will help reduce costs.

46. **Use OpenTelemetry support**
    For more robust cost tracking, especially in team environments, configure Claude Code's OpenTelemetry (OTel) support. This allows you to send metrics to backends like DataDog to monitor token usage and costs.
    You can configure this via environment variables or a managed settings JSON file (e.g., `~/Library/Application Support/ClaudeCode/managed-settings.json` on macOS).
    Example `managed-settings.json` snippet:
    ```json
    {
      "env": {
        "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
        "OTEL_METRICS_EXPORTER": "otlp",
        "OTEL_EXPORTER_OTLP_PROTOCOL": "grpc",
        "OTEL_EXPORTER_OTLP_ENDPOINT": "http://collector.company.com:4317",
        "OTEL_EXPORTER_OTLP_HEADERS": "Authorization=Bearer your-auth-token"
      }
    }
    ```

47. **Upgrade to Claude Max plans**
    If cost per token is a concern, consider upgrading to a Claude Max plan which often bundles a larger amount of usage for a flat fee, potentially making heavy usage more cost-effective.