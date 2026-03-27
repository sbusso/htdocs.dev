---
title: "Untitled 5Training Guide: Developing High-Performance Agent Skills"
author: Stephane Busso
description: This training material focuses on moving beyond simple markdown instructions toward **optimizing skills through code** to increase efficiency and reduce costs,.
published: true
tags:
  - claude
  - skills
updated: 2026-03-27T23:11
created: 2026-03-27T23:11
cover:
---
### Training Guide: Developing High-Performance Agent Skills

**Agent skills** (originally known as Claude skills) have emerged as an open standard for empowering AI models and agent harnesses to perform complex tasks. This training material focuses on moving beyond simple markdown instructions toward **optimising skills through code to increase efficiency and reduce costs.

#### 1. Understanding the Skill Structure

A standard skill is composed of several key components that facilitate "context engineering"—the process of providing the model with the exact tokens it needs at the right time,.

- **`skill.md`**: The metadata and orchestrator file that contains core instructions and allows the model to identify the skill,.
- **References/Assets**: Folders containing output examples, templates, and supplementary images or files,.
- **Scripts**: The actual code (Python, Bash, etc.) that runs in a **sandbox environment** to perform the heavy lifting.

#### 2. The Philosophy of "Better Code"

The most effective skills prioritize **code execution over model reasoning** for routine tasks. By offloading logic to scripts, you can:

- **Reduce Token Consumption**: Scripts can filter data before it ever reaches the model's context window,.
- **Enable Lower-Tier Models**: When code handles the complexity, you can often use cheaper, faster models to manage the output,.
- **Improve Reliability**: Pre-defined logic in code is more consistent than probabilistic model outputs,.

#### 3. Best Practices for Skill Development

To build production-ready skills, developers should implement the following patterns:

- **Selective Data Fetching**: Instead of returning an entire HTML page (which can exceed 8,000 tokens), scripts should be programmed to strip unnecessary tags like `<script>`, `<style>`, and `<nav>`,. This can result in a **90% reduction in token usage**.
- **Structured Data Extraction**: If the structure of a target (like a website) is known, use specific CSS selectors in your script to extract metadata. Return this information as **JSON or Markdown** so the model receives structured data rather than raw text,.
- **Offload Logic to Code**: Whenever possible, pre-make decisions in the script. For example, instead of asking a model to find the "lowest price," have the script sort the data and return only the relevant result.
- **Parallelism and Batching**: Use threads within your scripts to handle multiple requests (like searches) simultaneously. This avoids sequential round trips that bloat the conversation history.
- **Execution Limits**: Define strict **stop conditions** and maximum fetch calls in the `skill.md` or script to prevent the agent from entering infinite loops or flooding the context window during pagination,.
- **Incremental Processing**: Design skills to check for existing local files or databases before running. By only processing "new" data since the last run, you save significant resources.

#### 4. Summary for Developers

Building effective agent skills is a game of being **intentional with your tokens**. By using scripts to hardcode known variables (proxies, category names, etc.) and perform data filtering, you create applications that are more efficient, cheaper to run, and easier to scale,.