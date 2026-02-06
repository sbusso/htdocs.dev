---
title: The Modern Python Data Stack in 2026
author: Stephane Busso
description: A Complete Guide to Building Fast, Reproducible Data Projects
published: true
tags:
  - python
  - data
updated: 2026-02-06T14:46
created: 2026-02-06T14:46
cover:
---
**A Complete Guide to Building Fast, Reproducible Data Projects**

_From Package Management to Publishing — Every Tool You Need_

---

|Tool|Category|Replaces|
|---|---|---|
|uv|Package & Project Management|pip, virtualenv, Poetry, pyenv|
|Ruff|Linting & Formatting|flake8, isort, black|
|ty|Type Checking|mypy, pyright|
|Positron IDE|Development Environment|VS Code, RStudio, JupyterLab|
|Marimo|Reactive Notebooks|Jupyter Notebook|
|Polars|DataFrame Processing|Pandas|
|DuckDB|Embedded SQL Analytics|SQLite (analytics), Spark (local)|
|Quarto|Publishing & Documentation|MkDocs, Jupyter Book, nbconvert|
|Evidence|BI & Data Dashboards|Power BI, Tableau, Metabase|

---

## Introduction: Python's Tooling Renaissance

Python has dominated data science, machine learning, and analytics for over a decade. But for much of that time, its developer tooling lagged behind the language's ambitions. Dependency management was fragmented across pip, virtualenv, conda, and Poetry. Notebooks introduced reproducibility nightmares. Type checking felt like an afterthought. And publishing results required stitching together multiple disconnected tools.

In 2026, that story has fundamentally changed. A new generation of tools — many built in Rust for blazing speed, others rethinking entire workflows from scratch — has coalesced into a modern Python data stack that is fast, reproducible, and elegant.

This guide walks through each layer of this modern stack: from project setup with uv, through code quality with Ruff and ty, to reactive notebooks with Marimo, high-performance data processing with Polars and DuckDB, a purpose-built IDE with Positron, reproducible publishing with Quarto, and code-driven analytics with Evidence. Together, these tools form an integrated ecosystem where every piece works with the others.

---

## 1. uv — The Universal Python Project Manager

**What it is:** A Rust-based, all-in-one tool that replaces pip, virtualenv, Poetry, pyenv, and pipx with a single, blazing-fast command. Built by Astral, uv is 10–100x faster than pip and handles package installation, virtual environment creation, Python version management, and project scaffolding in one unified interface.

### Why It Matters

Python's packaging ecosystem has historically been one of its weakest points. The famous XKCD comic about Python environments resonated precisely because managing dependencies, virtual environments, and Python versions required juggling multiple tools with overlapping responsibilities. uv eliminates this entirely.

### Key Features

- **10–100x faster installs:** Rust-powered dependency resolution and installation that makes pip feel glacial.
- **Unified workflow:** `uv init` → `uv add` → `uv run` → `uv sync`. One tool for everything.
- **Built-in Python management:** `uv python install 3.12` downloads and manages Python versions. No more pyenv.
- **Lockfile support:** `uv.lock` ensures reproducible environments across machines and CI.
- **Disposable tools with uvx:** Run ruff, black, or any CLI tool in isolated environments without polluting your project. Think npx for Python.
- **Backward compatible:** Works with `requirements.txt` and `pyproject.toml`. Migrate incrementally.

### Quick Start

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a new project
uv init my-data-project
cd my-data-project

# Add dependencies (creates .venv automatically)
uv add polars duckdb marimo

# Run your script in the right environment
uv run python analysis.py

# Pin a Python version
uv python pin 3.12
```

🌐 [docs.astral.sh/uv](https://docs.astral.sh/uv/)

---

## 2. Ruff — Lightning-Fast Linting and Formatting

**What it is:** An ultra-fast Python linter and code formatter written in Rust. Ruff replaces flake8, isort, and black in a single tool, running 10–100x faster while covering 800+ lint rules with auto-fix capabilities.

### Why It Matters

Code quality tools are only effective if developers actually run them. Traditional Python linters were slow enough that developers would skip them during development and only run them in CI. Ruff is so fast it can run on every save without any perceptible delay, making code quality automatic rather than aspirational.

### Key Features

- **Drop-in replacement:** Covers most flake8, isort, and black rules. One config in `pyproject.toml`.
- **800+ built-in rules:** Style, bugs, performance, and security checks out of the box.
- **Auto-fix:** `ruff check --fix` resolves most issues automatically.
- **Editor integration:** Official VS Code/Positron extension with format-on-save.

### Quick Start

```bash
# Lint and auto-fix
uvx ruff check --fix .

# Format code
uvx ruff format .
```

🌐 [docs.astral.sh/ruff](https://docs.astral.sh/ruff/)

---

## 3. ty — Modern Type Checking at Rust Speed

**What it is:** A next-generation Python type checker from Astral (the makers of uv and Ruff), built in Rust. ty aims to replace mypy with dramatically faster performance and better developer experience, including a built-in language server for real-time IDE feedback.

### Why It Matters

Type checking in Python has always been optional, and slow type checkers made it feel burdensome. ty changes the equation: it's fast enough to run continuously in watch mode, providing instant feedback as you type. Combined with its built-in language server, type checking becomes part of the editing experience rather than a separate step.

### Key Features

- **Rust-powered speed:** Orders of magnitude faster than mypy, enabling continuous type checking.
- **Watch mode:** `ty check --watch` gives real-time feedback during development.
- **Built-in language server:** IDE integration is first-class, not an afterthought.
- **Better diagnostics:** Clearer error messages with actionable suggestions.
- **uv integration:** Run as a disposable tool with `uvx ty check`.

### Quick Start

```bash
# One-time check
uvx ty check

# Continuous feedback
uvx ty check --watch
```

> **Note:** ty is still in beta. Introduce it gradually — first as an informational check, then as a CI gate once you're confident in its signal-to-noise ratio.

🌐 [docs.astral.sh/ty](https://docs.astral.sh/ty/)

---

## 4. Positron — The Data Science IDE

**What it is:** A free, next-generation IDE from Posit (formerly RStudio), built on VS Code's open-source foundation but purpose-designed for data science. Positron treats Python and R as first-class citizens with native data exploration, variable inspection, plot management, and AI assistance built in — no extensions required.

### Why It Matters

Data scientists have long been forced to choose: VS Code offers extensibility but requires plugins for basic data work; JupyterLab excels at exploration but lacks IDE power; RStudio is purpose-built but R-centric. Positron is the first IDE that combines VS Code's extensibility with RStudio's data-first design, while treating Python and R equally. Released as stable in 2025, it represents where data science development is heading.

### Key Features

- **Data Explorer:** Interactive spreadsheet view with filtering, sorting, and summary statistics for in-memory DataFrames.
- **Variables Pane:** See all current DataFrames, arrays, and objects with dimensions and column names at a glance.
- **Plot Pane:** Review, resize, and export visualizations without switching contexts.
- **Positron Assistant:** AI assistant (powered by Anthropic) that understands your session context — variables, plots, and loaded packages.
- **Multi-language:** Native Python and R support with interpreter switching. Run both in the same project.
- **Connections Pane:** Browse and query SQL Server, Databricks, Snowflake, BigQuery directly in the IDE.
- **Integrated App Preview:** Build and preview Shiny, Streamlit, Dash, and FastAPI apps with a single click.
- **VS Code Extensions:** Compatible with the Open VSX marketplace — bring your existing extensions.
- **uv Integration:** Project templates that automatically configure virtual environments with uv.
- **Quarto Support:** Render Quarto documents to HTML, PDF, and slides directly within the IDE.

### Quick Start

```bash
# Download from positron.posit.co
# Open your uv project folder
# Positron auto-detects your Python environment
# Start exploring data with the built-in Data Explorer
```

🌐 [positron.posit.co](https://positron.posit.co/)

---

## 5. Marimo — Reactive Notebooks Done Right

**What it is:** A reactive Python notebook that solves Jupyter's reproducibility problems. Marimo notebooks are stored as pure `.py` files (not JSON), execute deterministically based on a dependency graph, and can be deployed as interactive web apps or run as scripts.

### Why It Matters

Jupyter notebooks are powerful for exploration but carry well-known problems: hidden state from out-of-order execution, JSON files that create merge conflicts in Git, and no built-in way to deploy work as applications. Marimo rethinks the notebook from the ground up. Every cell's dependencies are tracked automatically. When you update a cell, all dependent cells re-execute or are marked stale. There's no hidden state, no "run all cells" rituals, and no phantom bugs.

### Key Features

- **Reactive execution:** Change a cell and dependent cells automatically update. Deterministic, reproducible results every time.
- **Pure Python files:** Notebooks are `.py` files that version cleanly in Git, run as scripts, and import as modules.
- **No hidden state:** Deleting a cell removes its variables from the session. What you see is what you get.
- **Interactive UI:** Built-in sliders, buttons, dropdowns, and tables — no callback wiring required.
- **SQL support:** Write SQL cells that query DataFrames or databases directly.
- **Deployable as apps:** Convert notebooks to interactive web apps with `marimo run`.
- **AI code generation:** Built-in AI assistance for generating and refining code.
- **WASM support:** Run Marimo notebooks directly in the browser with no backend.

### Quick Start

```bash
# Install via uv
uv add marimo

# Create and edit a notebook
uv run marimo edit notebook.py

# Run as a web app
uv run marimo run notebook.py

# Run as a script
uv run python notebook.py
```

🌐 [marimo.io](https://marimo.io/)

---

## 6. Polars — DataFrames at the Speed of Rust

**What it is:** A Rust-based DataFrame library that is 5–20x faster than Pandas and 8x more energy efficient. Polars uses columnar storage (Apache Arrow), lazy evaluation with automatic query optimization, and multi-core parallelism by default.

### Why It Matters

Pandas was revolutionary when it launched in 2008, but its single-threaded, row-oriented architecture shows its age with modern data volumes. Polars brings a query-engine mindset to DataFrame processing: you describe what you want, and Polars optimizes how to execute it — including filter pushdown, projection pushdown, and parallel execution across all CPU cores.

### Key Features

- **Lazy evaluation:** `LazyFrame` lets you build a computation plan, then Polars optimizes and executes it.
- **Automatic parallelism:** Uses all CPU cores by default. No configuration needed.
- **Streaming execution:** Process datasets larger than RAM with `collect(engine="streaming")`.
- **Expression API:** Composable, readable transformations without slow `.apply()` + lambda patterns.
- **Arrow-native:** Seamless interop with Parquet, IPC, and other Arrow-based tools including DuckDB.
- **Strict typing:** Catches type errors early instead of silently coercing values.

### Quick Start

```python
import polars as pl

# Lazy: describe what you want, Polars optimizes how
result = (
    pl.scan_parquet("sales_data/*.parquet")
    .filter(pl.col("revenue") > 1000)
    .group_by("region")
    .agg(pl.col("revenue").sum())
    .sort("revenue", descending=True)
    .collect()  # Execute the optimized plan
)
```

🌐 [pola.rs](https://pola.rs/)

---

## 7. DuckDB — SQLite for Analytics

**What it is:** An embedded, in-process analytical database that runs SQL queries directly on local files (CSV, Parquet, JSON) and in-memory DataFrames — without a server. DuckDB uses columnar storage and vectorized execution to deliver analytical performance 10–100x faster than SQLite, right inside your Python process.

### Why It Matters

Before DuckDB, running analytical SQL queries locally meant either importing data into a full database server (PostgreSQL, MySQL) or accepting the limitations of SQLite, which was designed for transactional workloads. DuckDB eliminates this tradeoff: `pip install duckdb` and you have a production-grade analytical engine that can query Parquet files, join with Pandas/Polars DataFrames, and handle billions of rows on a laptop.

### Key Features

- **Zero setup:** `pip install duckdb`. No server, no configuration, no DBA required.
- **Query files directly:** `SELECT * FROM 'data.parquet'` or `'data.csv'` — treat files as tables.
- **DataFrame integration:** Zero-copy querying of Pandas, Polars, and Arrow DataFrames via Apache Arrow.
- **Vectorized execution:** Processes data in batches for optimal CPU cache usage and SIMD utilization.
- **Larger-than-memory:** Streaming execution handles datasets that don't fit in RAM.
- **Rich SQL dialect:** Window functions, CTEs, EXCLUDE/REPLACE syntax, and friendly SQL extensions.
- **WASM support:** Run DuckDB in the browser via WebAssembly for client-side analytics.
- **MotherDuck:** Serverless cloud extension for shared, scalable DuckDB instances.

### Quick Start

```python
import duckdb

# Query a Parquet file with SQL — no loading step
result = duckdb.sql("""
    SELECT region, SUM(revenue) as total
    FROM 'sales_data/*.parquet'
    GROUP BY region
    ORDER BY total DESC
""").pl()  # Returns a Polars DataFrame

# Query an existing Polars DataFrame
import polars as pl
df = pl.DataFrame({"name": ["Alice", "Bob"], "score": [95, 87]})
duckdb.sql("SELECT * FROM df WHERE score > 90").show()
```

🌐 [duckdb.org](https://duckdb.org/)

---

## 8. Quarto — Reproducible Publishing for Data Science

**What it is:** An open-source scientific and technical publishing system from Posit that renders markdown with executable code into HTML, PDF, Word, presentations, websites, books, and dashboards. Quarto is language-agnostic (Python, R, Julia, Observable JS) and built on Pandoc, the universal document converter.

### Why MkDocs Isn't Enough for Data Projects

MkDocs is excellent for static documentation sites, but data projects need more than documentation. They need reports where code executes and generates results, publications with cross-references and citations, dashboards that update when data changes, and multi-format output from a single source. Quarto does all of this while also handling documentation sites. It's a superset of MkDocs' functionality, specifically designed for code-driven content.

### Key Features

- **Executable code:** Python, R, Julia, or Observable JS code blocks run during rendering. Results are embedded in the output.
- **Multi-format output:** Same `.qmd` source renders to HTML, PDF (via LaTeX or Typst), Word, ePub, Reveal.js slides, and more.
- **Scientific writing:** LaTeX equations, cross-references, figure panels, callouts, citations, and bibliography support built in.
- **Websites and books:** Project system for multi-document outputs: blogs, documentation sites, course materials, and full books.
- **Dashboards:** Quarto Dashboards (since v1.4) create interactive dashboards from code cells.
- **Parameterized reports:** Generate many customized reports from a single notebook template.
- **brand.yml:** Apply organizational branding consistently across all outputs.
- **IDE integration:** First-class support in Positron, VS Code, RStudio, and Jupyter Lab.

### Quick Start

```yaml
# Create a document (analysis.qmd)
---
title: "Sales Analysis Q4 2025"
format: html
---
```

````python
```{python}
import polars as pl
df = pl.read_parquet("sales.parquet")
df.group_by("region").agg(pl.col("revenue").sum())
```
````

```bash
# Render to HTML
quarto render analysis.qmd

# Render to PDF
quarto render analysis.qmd --to pdf
```

🌐 [quarto.org](https://quarto.org/)

---

## 9. Evidence — Business Intelligence as Code

**What it is:** An open-source framework for building data products — reports, dashboards, and decision-support tools — using only SQL and Markdown. Evidence generates static websites from markdown files with embedded SQL queries, offering a code-driven alternative to drag-and-drop BI tools like Power BI and Tableau.

### Why It Matters

Traditional BI tools create maintenance nightmares: dashboards that can't be version-controlled, filters that break silently, and customization limits that force workarounds. Evidence applies software engineering principles to analytics — your dashboards live in Git, changes are reviewed in pull requests, and deployments are automated. Combined with DuckDB, it creates a powerful local-first analytics pipeline.

### Key Features

- **SQL + Markdown:** Write SQL queries inline in markdown files. Results automatically feed charts and tables.
- **Version controlled:** Everything is code — Git-friendly, reviewable, and auditable.
- **DuckDB powered:** Universal SQL engine built on DuckDB's WASM distribution for client-side execution.
- **Templated pages:** Generate dozens of pages from a single template — one per region, customer, or product.
- **Rich components:** Charts, tables, maps, value boxes, and interactive filters from a Svelte-based component library.
- **Static deployment:** Build once, deploy anywhere — Netlify, Vercel, or your own server.
- **Data source flexibility:** Connect to Snowflake, BigQuery, PostgreSQL, DuckDB, CSV, or Parquet files.
- **AI assistance:** AI agent that writes Evidence markdown, checks schemas, and debugs errors.

### Quick Start

```bash
# Create a new Evidence project
npx degit evidence-dev/template my-report
cd my-report && npm install
npm run dev
```

````markdown
<!-- Edit src/pages/index.md -->

```sql revenue_by_region
SELECT region, SUM(revenue) as total
FROM sales GROUP BY region
````

<BarChart data={revenue_by_region} x=region y=total /> ```

### Observable Framework: An Alternative Approach

Observable Framework takes a similar philosophy — static sites with embedded data — but uses JavaScript as the primary language with data loaders in any backend language. Where Evidence targets SQL-centric teams, Observable excels for custom visualizations with D3.js and interactive exploration. Both can connect to DuckDB and deploy as static sites. Choose Evidence if your team thinks in SQL; choose Observable if you need custom JavaScript visualizations.

🌐 [evidence.dev](https://evidence.dev/) | [observablehq.com](https://observablehq.com/)

---

## 10. How It All Fits Together

The real power of this stack isn't in any individual tool — it's in how they integrate. Here's a typical workflow that touches every layer:

### A Complete Data Project Workflow

**Step 1 – Project Setup:** `uv init` creates your project with `pyproject.toml` and a managed `.venv`. `uv add polars duckdb marimo` installs your stack in seconds.

**Step 2 – IDE:** Open the project in Positron. It auto-detects the uv environment, provides the Data Explorer and Variables Pane, and runs Ruff on save.

**Step 3 – Exploration:** Launch `marimo edit` to explore data interactively. Use Polars for fast transformations and DuckDB for complex SQL joins across Parquet files.

**Step 4 – Code Quality:** Ruff auto-formats and lints on every save. `ty check --watch` catches type errors in real-time.

**Step 5 – Analysis:** Write your final analysis in a Quarto document (`.qmd`) with executable Python code blocks. Render to HTML for sharing or PDF for publication.

**Step 6 – Dashboards:** Build an Evidence project that queries your DuckDB database with SQL and generates an interactive BI dashboard for stakeholders.

**Step 7 – Deploy:** Docker containerizes the environment. Quarto publishes to GitHub Pages. Evidence deploys to Netlify. Everything is Git-versioned and reproducible.

### Integration Matrix

|Pair|How They Integrate|
|---|---|
|uv + Positron|Positron auto-detects uv environments and uses project templates|
|Polars + DuckDB|Zero-copy data exchange via Apache Arrow; SQL on Polars DataFrames|
|Marimo + Polars|Reactive notebook cells with fast DataFrame operations|
|Quarto + Positron|Render .qmd documents to HTML/PDF directly in the IDE|
|DuckDB + Evidence|Evidence's query engine is built on DuckDB WASM|
|Ruff + Positron|Format-on-save with official extension|
|uv + Docker|`uv sync` in Dockerfile for reproducible container builds|

---

## 11. Quick Comparison: Modern vs. Legacy

|Category|Legacy Stack|Modern Stack (2026)|
|---|---|---|
|Package Management|pip + virtualenv + pyenv|uv (all-in-one)|
|Linting|flake8 + isort + black|Ruff (single tool)|
|Type Checking|mypy (slow, separate)|ty (fast, integrated)|
|IDE|VS Code + extensions|Positron (data-first)|
|Notebooks|Jupyter (hidden state, JSON)|Marimo (reactive, .py files)|
|DataFrames|Pandas (single-thread)|Polars (multi-core, lazy)|
|Local SQL|SQLite or full Postgres|DuckDB (embedded OLAP)|
|Documentation|MkDocs + manual reports|Quarto (docs + reports + more)|
|Dashboards|Power BI / Tableau (drag-drop)|Evidence (code-driven, Git)|

---

## 12. Conclusion: The Best Time to Modernize Is Now

The modern Python data stack in 2026 isn't about replacing one tool at a time — it's about an ecosystem that was designed to work together. uv manages your projects and environments at Rust speed. Ruff and ty keep your code clean and typed. Positron gives you an IDE that understands data. Marimo makes notebooks reproducible and deployable. Polars and DuckDB handle data processing from DataFrames to SQL. Quarto publishes everything from quick reports to full books. And Evidence turns SQL queries into production dashboards.

The beautiful thing is that migration is incremental. You don't have to adopt everything at once. Start with uv to manage your projects. Add Ruff for automatic formatting. Try Polars on your next analysis. Each tool delivers immediate value on its own and compounds when combined with the others.

For the first time, Python's tooling matches the language's ambitions. These tools are fast, polished, and designed with developer experience as a priority — not an afterthought. If you've been waiting for the right moment to modernize your Python workflow, that moment is now.

---

## Resources

|Tool|URL|
|---|---|
|uv|[docs.astral.sh/uv](https://docs.astral.sh/uv/)|
|Ruff|[docs.astral.sh/ruff](https://docs.astral.sh/ruff/)|
|ty|[docs.astral.sh/ty](https://docs.astral.sh/ty/)|
|Positron|[positron.posit.co](https://positron.posit.co/)|
|Marimo|[marimo.io](https://marimo.io/)|
|Polars|[docs.pola.rs](https://docs.pola.rs/)|
|DuckDB|[duckdb.org](https://duckdb.org/)|
|Quarto|[quarto.org](https://quarto.org/)|
|Evidence|[evidence.dev](https://evidence.dev/)|
|Observable|[observablehq.com](https://observablehq.com/)|
