---
title: Migrating From Nix and Home Manager to Homebrew and Chezmoi
author:
  - Stephane Busso
description: migrate your macOS setup from the declarative world of Nix/Home-Manager/Flakes to the more imperative (but organisable) world of Homebrew and Chezmoi
published: true
tags:
  - nix
  - brew
  - chezmoi
  - macos
updated: 2025-04-03T12:30
created: 2025-04-03T12:28
cover: 
---
Okay, let's migrate your macOS setup from the declarative world of Nix/Home-Manager/Flakes to the more imperative (but organisable) world of Homebrew and Chezmoi.

This guide assumes you have a working Home-Manager setup via Nix Flakes on your macOS machine.

**Understanding the Shift**

*   **Nix/Home-Manager:** A fully declarative system where your `home.nix` (and potentially `flake.nix`) defines the desired state (packages, services, dotfiles). Nix builds and links everything into your profile. Dotfiles are often *generated* based on Nix expressions.
*   **Homebrew + Chezmoi:**
    *   **Homebrew:** Primarily a package manager. You install packages imperatively (`brew install`) but can manage a list declaratively using a `Brewfile`.
    *   **Chezmoi:** A dotfile manager. It stores the *source* version of your dotfiles in a Git repository (`~/.local/share/chezmoi`) and applies them to your home directory, handling templates, secrets, permissions, and run scripts. Dotfiles are *managed*, not necessarily *generated* in the same way as Nix.

**Migration Steps**

**Phase 1: Preparation and Extraction**

1.  **BACKUP EVERYTHING!** Seriously. Before making major system changes, ensure you have backups of:
    *   Your entire Home Manager/Flake configuration repository.
    *   Your home directory (especially hidden dotfiles). Time Machine or another backup solution is essential.

2.  **Identify Managed Dotfiles:**
    *   Go through your `home.nix` (and any imported files). Look for `home.file."path/to/dotfile".text = ''...'';` or `home.file."path/to/dotfile".source = ./path/to/source;`.
    *   Also, note configurations managed via Home-Manager modules (e.g., `programs.git`, `programs.zsh`, `programs.neovim`). Nix generates these files.
    *   **Goal:** You need the *final, rendered version* of these configuration files as they currently exist in your home directory.

3.  **Extract Rendered Dotfiles:**
    *   Nix/Home-Manager places the generated files directly into your home directory (e.g., `~/.zshrc`, `~/.gitconfig`, `~/.config/nvim/init.vim`, etc.).
    *   Create a temporary staging directory *outside* your home directory, for example: `mkdir ~/migration_staging`
    *   Copy the *currently active* configuration files managed by Home-Manager into this staging directory.
        *   `cp ~/.zshrc ~/migration_staging/`
        *   `cp ~/.gitconfig ~/migration_staging/`
        *   `cp -R ~/.config/nvim ~/migration_staging/`
        *   `cp -R ~/.config/htop ~/migration_staging/`
        *   ...and so on for every file/directory identified in Step 2.

4.  **Extract Package List:**
    *   Examine the `home.packages = [ pkgs.package1 pkgs.package2 ... ];` section in your `home.nix`.
    *   List all these packages. This is the list you'll need to reinstall using Homebrew. Note that names might differ slightly (e.g., `pkgs.neovim` vs `neovim` in Homebrew).
    *   Also, check if your Flake installs system-wide packages via `nix-darwin` or similar – list those too. Homebrew handles both CLI tools (formulae) and GUI apps (casks).

**Phase 2: Setting up Homebrew and Chezmoi**

5.  **Install Homebrew:** If you don't already have it installed alongside Nix (sometimes people do), install it now:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
    Follow the on-screen instructions, especially regarding adding Homebrew to your `PATH` (which might involve editing your shell profile temporarily, though Chezmoi will manage this later).

6.  **Install Chezmoi:**
    ```bash
    brew install chezmoi
    ```

7.  **Initialize Chezmoi:**
    *   Decide where you'll host your new dotfiles repository (e.g., GitHub, GitLab). Create an empty repository there. Let's say it's `git@github.com:yourusername/dotfiles.git`.
    *   Initialize Chezmoi, linking it to your remote repository:
        ```bash
        chezmoi init --apply yourusername@github.com/yourusername/dotfiles.git
        # Or use SSH:
        # chezmoi init --apply git@github.com:yourusername/dotfiles.git
        ```
        *   `init`: Creates the source directory (`~/.local/share/chezmoi`), initializes a Git repo there, adds the remote, and creates a basic `.chezmoiignore` file.
        *   `--apply`: Performs an initial `chezmoi apply` after init. Important if you have pre-existing dotfiles you want Chezmoi to manage immediately (less relevant here as we're adding fresh ones).

**Phase 3: Populating Chezmoi and Installing Packages**

8.  **Add Dotfiles to Chezmoi:**
    *   Navigate to your home directory (`cd ~`).
    *   For each file/directory you copied to `~/migration_staging`:
        *   First, ensure the file/directory exists in the correct location in your *actual* home directory (copy it back from staging if needed: `cp ~/migration_staging/.zshrc ~/.zshrc`).
        *   Then, add it to Chezmoi:
            ```bash
            chezmoi add ~/.zshrc
            chezmoi add ~/.gitconfig
            chezmoi add ~/.config/nvim # Add directories recursively
            # ... and so on for all your extracted dotfiles
            ```
    *   **What `chezmoi add` does:**
        *   Copies the file/directory from your home directory (`target`) to the Chezmoi source directory (`~/.local/share/chezmoi`).
        *   It might rename the file in the source directory (e.g., `.zshrc` becomes `dot_zshrc`).
        *   It checks permissions (e.g., `private_` prefix for `0600`, `executable_` prefix for executable files).
        *   By default (can be configured), it replaces the original file in your home directory with a symlink to the file managed by Chezmoi (in `~/.local/share/chezmoi`), or potentially turns it into a template if certain conditions are met. You can configure this behavior.

9.  **Create a Brewfile:**
    *   This file lists all the Homebrew packages (formulae and casks) you want to manage. It's the Homebrew equivalent of your `home.packages` list.
    *   You can manage this `Brewfile` *itself* with Chezmoi. Good practice!
        *   Create the file in your Chezmoi source directory: `touch "$(chezmoi source-path)/Brewfile"`
        *   Edit the file: `chezmoi edit "$(chezmoi source-path)/Brewfile"`
    *   Populate the `Brewfile` based on the package list you extracted in Step 4. Translate Nix package names to Homebrew names (search on `brew.sh`).
        ```sh
        # Example Brewfile content
        tap "homebrew/bundle"
        tap "homebrew/cask-fonts"

        # CLI Tools (Formulae)
        brew "git"
        brew "neovim"
        brew "zsh"
        brew "htop"
        brew "ripgrep"
        brew "fzf"
        # To install fzf's keybindings and fuzzy completion:
        # $(brew --prefix)/opt/fzf/install
        # You might add this command to a chezmoi run_ script (see later)

        # GUI Apps (Casks)
        cask "google-chrome"
        cask "visual-studio-code"
        cask "iterm2"
        cask "font-fira-code-nerd-font"

        # Optional: From Mac App Store
        # mas "Xcode", id: 497799835 # Need 'brew install mas' first
        ```
    *   Add and commit the `Brewfile` within your Chezmoi repo:
        ```bash
        cd "$(chezmoi source-path)"
        git add Brewfile
        git commit -m "Add Brewfile"
        # git push # Optional for now
        ```
    *   Apply the changes (this ensures the `Brewfile` exists in your home directory if you chose not to put it in the source path, or just updates Chezmoi's state):
        ```bash
        chezmoi apply
        ```

10. **Install Packages via Brewfile:**
    *   Use Homebrew Bundle to install everything listed in your `Brewfile`:
        ```bash
        # If Brewfile is managed by chezmoi and symlinked to ~/Brewfile (default)
        brew bundle install --file ~/Brewfile
        # Or directly reference the one in the source path if you prefer
        # brew bundle install --file "$(chezmoi source-path)/Brewfile"
        ```
    *   This will install all the specified formulae and casks. It might take a while.

**Phase 4: Refinement and Cleanup**

11. **Review and Tweak:**
    *   Restart your shell (or open a new terminal window/tab). Does it pick up the new `zsh` (if installed), settings from `.zshrc`, etc.?
    *   Check your applications (Neovim, Git, etc.). Are their configurations loaded correctly?
    *   You might need to manually run setup steps for some tools (like `$(brew --prefix)/opt/fzf/install`).

12. **Leverage Chezmoi Features (Advanced/Optional):**
    *   **Templates:** If parts of your config need to differ per machine (e.g., Git email, hostname-specific settings), turn those files into templates.
        *   `chezmoi add --template ~/.gitconfig` or edit the file in the source dir (`chezmoi edit ~/.gitconfig`) and add Go template syntax (e.g., `email = {{ .email }}`).
        *   Define variables in `~/.config/chezmoi/chezmoi.toml`.
    *   **Secrets:** Use `chezmoi secret` commands to integrate with password managers (1Password, pass, Keychain, etc.) for sensitive data.
    *   **Run Scripts:** Create scripts in your Chezmoi source directory named `run_once_install-packages.sh` or similar. These run automatically during `chezmoi apply` under certain conditions (e.g., the first time, or every time). Useful for tasks like running `fzf/install` or other setup commands.
        ```bash
        # Example: $(chezmoi source-path)/run_once_after_install-fzf.sh
        #!/bin/zsh
        # only run if fzf is installed
        if command -v fzf >/dev/null 2>&1; then
             echo "Running fzf install script..."
             "$(brew --prefix)/opt/fzf/install" --key-bindings --completion --no-update-rc
        fi
        ```
        Make it executable (`chmod +x run_...sh`) and add it to Git.

13. **Commit and Push:**
    *   Once you're happy with the state of your dotfiles in Chezmoi:
        ```bash
        cd "$(chezmoi source-path)"
        git status # Review changes
        git add .
        git commit -m "Initial import of dotfiles from Home Manager"
        git push origin main # Or master
        ```

14. **Uninstall Nix and Home-Manager (Proceed with CAUTION!)**
    *   **ONLY do this AFTER you are confident your new Homebrew + Chezmoi setup is working correctly.** Uninstalling Nix is non-trivial and removes `/nix`.
    *   There isn't one single official "uninstall" script that works for all setups. Common steps involve:
        *   Removing Nix daemon service (`launchctl unload /Library/LaunchDaemons/org.nixos.nix-daemon.plist`, `sudo rm /Library/LaunchDaemons/org.nixos.nix-daemon.plist`, etc.).
        *   Removing Nix setup lines from your shell profiles (`/etc/zshrc`, `/etc/bashrc`, `~/.zshrc`, `~/.bash_profile`). Chezmoi should now manage your user profile files.
        *   Removing `/etc/nix` directory.
        *   Deleting the Nix store: `sudo rm -rf /nix`. **THIS IS IRREVERSIBLE.**
    *   **Recommendation:** Search for up-to-date guides specifically for uninstalling Nix on macOS for your specific installation method (e.g., single-user vs multi-user daemon). The official NixOS/nix manual or community forums/chats are good places to look. **Double-check commands before running them.**

**Ongoing Workflow**

*   **Adding a new package:**
    1.  `brew install some-package`
    2.  `brew bundle dump --file="$(chezmoi source-path)/Brewfile" --force` (Overwrites Brewfile with current setup) OR manually edit the `Brewfile` (`chezmoi edit ~/Brewfile`).
    3.  `cd $(chezmoi source-path)`
    4.  `git add Brewfile`
    5.  `git commit -m "Add some-package"`
    6.  `git push`
*   **Adding a new dotfile:**
    1.  Create/edit the file in your home directory (e.g., `~/.config/foo/bar.conf`).
    2.  `chezmoi add ~/.config/foo/bar.conf`
    3.  `cd $(chezmoi source-path)`
    4.  `git add .`
    5.  `git commit -m "Add foo config"`
    6.  `git push`
*   **Editing a managed dotfile:**
    1.  `chezmoi edit ~/.zshrc` (Opens the *source* file in your `$EDITOR`).
    2.  Save and close the editor.
    3.  Chezmoi automatically runs `chezmoi apply` to update the target file.
    4.  `cd $(chezmoi source-path)`
    5.  `git commit -am "Update zshrc"`
    6.  `git push`
*   **Pulling changes on another machine:**
    1.  `chezmoi update` (Pulls git repo and applies changes).

You've now migrated from a fully declarative Nix setup to a managed dotfile system with Chezmoi and package management with Homebrew! It requires a bit more manual intervention sometimes (like updating the Brewfile) but offers a robust, widely used, and more conventional macOS setup.