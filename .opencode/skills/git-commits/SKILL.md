---
name: git-commits
description: >
  Defines commit and branch conventions for this project.
  Activate when the user asks to commit or create branches.
---

## Commit Rules

- Title in English, past tense, capitalized, no period
- Max 72 characters for title
- No emojis, no prefix tags (feat/fix/chore)
- Body: bullet points describing specific changes
- Atomic commits per feature/change

## Branch Naming

- `feature/<description>` — new functionality
- `hotfix/<description>` — fast bug fixes
- `bugfix/<description>` — bug fixes
- `refactor/<description>` — code refactors
- `improvement/<description>` — code improvements
- `release/<version>` — release branches

## Example

Added public match submission form and inReview status filtering
- Created savePublicMatchAction server action to persist.
- Added inReview status to the MATCH_STATUS.
- Filtered out inReview matches from public queries.
- Added penalty shootout scores display to the calendar.
- Integrated form submission with toast notifications and cache tag invalidation.
- Renamed data to matches server action for consistency.
- Removed unused default export,
