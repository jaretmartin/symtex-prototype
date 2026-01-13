---
description: Review staged git changes for issues
allowed-tools: Bash(git:*), Read
---

Review the current staged changes for:

1. Run `git diff --staged` to see what's being committed
2. Check for:
   - Accidental console.log statements
   - Commented-out code
   - TODO comments that should be addressed
   - Type safety issues
   - Security concerns (hardcoded values, exposed secrets)
3. Provide a summary of findings
4. Recommend whether the changes are ready to commit

Be thorough but concise in your review.
