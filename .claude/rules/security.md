# Security Guidelines

## IMPORTANT: Never Commit Secrets
- No API keys in code
- No credentials in CLAUDE.md
- Use environment variables for sensitive data
- Check `.env` files are in `.gitignore`

## Input Validation
- Sanitize all user inputs
- Validate on both client and server (when backend exists)
- Use Zod or similar for schema validation

## XSS Prevention
- React escapes by default - don't bypass with dangerouslySetInnerHTML
- Sanitize any HTML content from external sources
- Use Content Security Policy headers

## Dependencies
- Review new dependencies before adding
- Check for known vulnerabilities: `pnpm audit`
- Keep dependencies updated
