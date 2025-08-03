# Project Hygiene Rules

## 1. Code Cleanliness is Priority
- Every commit should leave the code cleaner than before.
- Avoid “commented-out” code. If it’s dead, delete it.

## 2. Zero Redundant Artifacts
- No unused imports, functions, variables, or CSS classes.
- Remove all ghost components after removal of related UI logic.

## 3. AI-Generated Edits Must Be Verified
- After using AI, always cross-check for:
  - Orphaned lines
  - Broken formatting
  - Unused helper code

## 4. Commit Discipline
- Every commit must be atomic: 1 feature/fix = 1 commit.
- Use conventional commit messages (e.g., `feat:`, `fix:`, `chore:`).

## 5. No Half-Done Refactors
- Don’t leave hanging props, incomplete components, or partial rewrites.
- Finish what you start. If not, clearly mark with `// TODO:` and log in issue tracker.

## 6. CSS/Styling
- Purge unused classes after design refactor.
- Use scoped styles where possible (e.g., Tailwind, CSS modules).

## 7. Components
- If a component is removed, purge:
  - Imports
  - Routes
  - State handling
  - Context usage

## 8. Kill with Purpose
- If a page/feature is removed, commit with `chore: remove <feature>` and ensure no residual logic remains.

## 9. CI Cleanliness (optional)
- Run a linter/formatter (e.g., Prettier, ESLint) before every push.

## 10. Manual Sanity Check Before Push
- Open the affected page/component and verify:
  - No console errors
  - Layout intact
  - Functionality preserved

---

**🧠 Mindset**: Write like the next dev is a serial killer who hates messy code.  
