---
title: "Replacing npx with Bunx: A Simple Workaround"
author:
  - Stephane Busso
description: How to replace `npx` with `bunx`
published: true
tags:
  - bun
  - cli
updated: 2025-02-13T17:21
created: 2025-02-13T17:17
cover: 
---
If you're using Bun as your JavaScript package manager, you might want to replace `npx` with `bunx`. However, some tools expect `npx` to exist and won’t recognize a simple alias. Here’s how to work around that issue.

### Why Replace `npx` with `bunx`?

Bun is a faster alternative to npm, and `bunx` serves the same purpose as `npx`, allowing you to run Node.js packages without installing them globally.

For example, instead of:

```sh
npx create-next-app@latest my-app
```

You can use:

```sh
bunx create-next-app@latest my-app
```

However, some tools strictly require `npx`. If you simply alias it in your shell configuration:

```sh
alias npx="bunx"
```

It will work in an interactive shell but may fail in automated scripts or commands like `uv run`.

### Workaround: Create a Fake `npx` Script

A more reliable way is to create a lightweight script that redirects `npx` calls to `bunx`.

#### Steps:

1. Create a custom script for `npx`:

   ```sh
   mkdir -p ~/.local/bin
   echo '#!/bin/sh' %3E ~/.local/bin/npx
   echo 'exec bunx "$@"' >> ~/.local/bin/npx
   chmod +x ~/.local/bin/npx
   ```

2. Add `~/.local/bin` to your system `PATH` (if not already included):

   ```sh
   export PATH="$HOME/.local/bin:$PATH"
   ```

   Add this line to your `~/.bashrc`, `~/.zshrc`, or `~/.profile` to make it permanent.

3. Restart your terminal or run:

   ```sh
   source ~/.zshrc  # or source ~/.bashrc
   ```

Now, any command expecting `npx` will automatically use `bunx` instead.

### Conclusion

Using `bunx` instead of `npx` can speed up development, but some tools depend on `npx` existing in the system. This simple script method allows you to replace `npx` with `bunx` without breaking compatibility with tools like `uv run` or other automated scripts.>)