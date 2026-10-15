---
name: git-basics
description: Perform essential Git operations for individual development
compatibility: opencode
metadata:
  stack: cli
  language: bash
---

## What I do

I guide users through essential Git commands for individual development workflows.

## Rules

- Commit messages must include a concise title and a descriptive body summarizing staged changes.
- Use `git switch -c <new-branch-name>` to create and switch to new branches.
- Regularly use `git log --oneline --all` to visualize commit history.
- Avoid direct pushes to `main` or `master` branches.
- Prefer clear and descriptive branch names.

## Essential Commands Covered

- `git status`: Show working tree status.
- `git add <file>`: Add file contents to the index.
- `git commit`: Record changes to the repository with a descriptive message.
- `git push`: Update remote refs along with associated objects.
- `git pull`: Fetch from and integrate with another repository or a local branch.
- `git merge`: Join two or more development histories together.
- `git stash`: Stash changes made to the working directory.
- `git tag`: Add tag reference for a commit.
- `git switch -c <new-branch-name>`: Create a new branch and switch to it.
- `git log --oneline --all`: View commit history concisely.

## Examples of Usage

Here are examples illustrating the commands and rules:

### 1. Checking Status and Adding Files

```bash
# Check the current status of the repository
git status

# Add a specific file to the staging area
git add my_feature.js

# Add all changes in the current directory to the staging area
git add .

# or
git add --all
```

### 2. Committing Changes

```bash
# Commit staged changes with a title and description
git commit -m "Feature: Implement user authentication\n\n- Add login form component\n- Implement API call for authentication\n- Add basic error handling"
```
*(Note: The commit message format follows the convention of a concise title (e.g., `feature:`, `Bugfix:`, `Chore:`) and a more detailed body describing the changes.)*

### 3. Branching Workflow

```bash
# Create a new branch named 'new_feature' and switch to it
git switch -c new_feature

# View commit history
git log --oneline --all
```

### 4. Stashing Changes

```bash
# Stash current changes
git stash

# View stashed changes
git stash list

# Apply the most recent stash
git stash pop
```

### 5. Pushing, Pulling, and Merging

```bash
# Push current branch to remote (assuming tracking is set up)
git push

# Pull changes from remote
git pull

# Merge 'another_branch' into the current branch
git merge another_branch
```

### 6. Tagging Commits

```bash
# Tag the current commit with version 1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
```
