# Developer Guide

## Architecture Overview
- **client/**: React + Tailwind UI, React Router, i18n translations in `client/src/locales/`.
- **server/**: Express API with Sequelize ORM, JWT auth, and structured logging.
- **docs/**: API list, RBAC matrix, security checklist, and ops guidance.

## Code Organization
- **server/src/routes**: Route registration by domain.
- **server/src/controllers**: Business logic for each domain.
- **server/src/models**: Sequelize models and relationships.
- **server/src/services**: Email, storage, payment, and notifications abstractions.
- **server/migrations** + **server/seeders**: DB migrations and seed data.

## i18n Strings
- English: `client/src/locales/en/translation.json`
- Chinese: `client/src/locales/zh/translation.json`

## Add a New Role
1. Add role enum in `server/src/models/user.js` and the migration.
2. Add RBAC handling in `server/src/middleware/rbac.js` and routes.
3. Update UI navigation and role-specific view logic as needed.

## Swap File Storage to S3
- Replace `server/src/services/storageService.js` with an S3-backed implementation.
- Keep the `saveFile()` interface so controllers remain unchanged.

## Deployment Notes
- Use managed Postgres and secure secrets.
- Enable HTTPS and set secure cookie flags in production.
