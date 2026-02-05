# Student Portal System

A secure, bilingual (English/中文) full-stack Student Portal web application with registration, course management, grades, finance, and admin workflows. Built with React, Tailwind, Node.js, Express, and Sequelize.

## Architecture Diagram (ASCII)

```
+---------------------+       +---------------------+       +----------------------+
|  React Client       |  HTTPS|  Express API        |  SQL  |  PostgreSQL DB        |
|  (Vite + Tailwind)  +------>+  JWT + RBAC         +------>+  Sequelize ORM        |
|  i18n EN/中文        |       |  Email/SSO/Payment  |       |  Migrations + Seed    |
+----------+----------+       +----------+----------+       +----------+-----------+
           |                             |                             |
           |                             v                             v
           |                    Local File Storage               Audit Logs
           |                    (S3-ready)                        + Metrics
```

## Tech Stack
- **Frontend**: React (hooks), React Router, Tailwind CSS, React Hook Form, i18next
- **Backend**: Node.js, Express, Sequelize ORM, PostgreSQL
- **Auth**: JWT access/refresh tokens, bcrypt
- **Docs**: Swagger UI (`/api/docs`)

## Developer Summary (Quick Reference)
- **Architecture**: React client in `client/` talks to Express API in `server/` with Sequelize models and migrations. See `docs/developer-guide.md` for full layout.
- **i18n strings**: `client/src/locales/en/translation.json` and `client/src/locales/zh/translation.json`.
- **Add new role**: Update role enum in `server/src/models/user.js`, migrations, and RBAC middleware + routes.
- **Swap file storage to S3**: Replace `server/src/services/storageService.js` with S3 adapter while keeping `saveFile()` signature.

## Quick Start (Docker)

```bash
cp sample.env.example .env

docker-compose up --build
```

Then open:
- Client: http://localhost:3000
- API docs: http://localhost:4000/api/docs

## Local Development

### Backend
```bash
cd server
npm install
npm run migrate
npm run seed
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Tests
```bash
npm --prefix server test
npm --prefix client test
```

## Environment Variables
See `sample.env.example` for the full list.

## Sample Accounts (Seeded)
- **Admin**: admin@example.edu / AdminPass123! (SystemAdmin)
- **Registrar**: registrar@example.edu / Registrar123!
- **Lecturer**: lecturer@example.edu / Lecturer123!
- **Student A**: studentA@example.edu / StudentA123! (has prereq)
- **Student B**: studentB@example.edu / StudentB123! (no prereq)

## Acceptance Test Checklist (Must-have User Stories)
- [ ] Register with email verification and login (auth + verify endpoint).
- [ ] Forgot password flow (mock email output in console).
- [ ] Optional MFA stub (enable endpoint).
- [ ] SSO stub endpoint with integration points (`/api/auth/sso-stub`).
- [ ] Profile view/edit with contact and emergency info.
- [ ] Course catalog, detail, add/drop with conflict, prereq, credit limit checks.
- [ ] Waitlist when seats are full.
- [ ] Weekly timetable and iCal export.
- [ ] Grade viewing + GPA; lecturer draft & publish workflow; student notification on publish.
- [ ] Transcript request workflow with status tracking.
- [ ] Tuition & fees statement and payment mock + webhook handling.
- [ ] Notifications center (in-app + email stub).
- [ ] Document upload (PDF/JPEG/PNG) with virus scan stub.
- [ ] Admin/Registrar search/update student records.
- [ ] Configure academic terms & course offerings.
- [ ] RBAC for Student, Lecturer, Registrar, Finance, SystemAdmin.
- [ ] Audit logs for login/data/grade/payment events.
- [ ] Backup & restore instructions documented below.
- [ ] Health endpoints `/api/health` and `/api/metrics`.

## Security Notes (OWASP Top 10 Mitigations)
- JWT with refresh tokens and bcrypt password hashing.
- Input validation using `express-validator`.
- Helmet headers, rate limiting, and CORS configuration.
- ORM-backed queries with Sequelize to prevent SQL injection.
- File upload size + MIME checks.
- Documented CSRF protection for stateful endpoints.
- Secure cookie flags recommended for production.

## Backup & Restore

### Backup
```bash
pg_dump -h localhost -U postgres student_portal > backup.sql
```

### Restore
```bash
psql -h localhost -U postgres student_portal < backup.sql
```

## Deployment Checklist
- [ ] Set production secrets (JWT, DB, SMTP) via environment variables.
- [ ] Enable HTTPS and HSTS.
- [ ] Configure SMTP provider.
- [ ] Configure file storage (swap to S3 in `server/src/services/storageService.js`).
- [ ] Run migrations and seed data as needed.
- [ ] Configure backup schedule and log retention.
- [ ] Set up monitoring for `/api/health` and `/api/metrics`.

## SSO Integration Points
- `GET /api/auth/sso-stub` provides SAML/OAuth integration placeholders.
- Replace the stub with SAML/OAuth handlers in `server/src/controllers/authController.js`.

## Documentation
- Developer Guide: `docs/developer-guide.md`
- API List: `docs/api-list.md`
- RBAC Matrix: `docs/rbac-matrix.md`
- Security Checklist: `docs/security-checklist.md`
- Curl Examples: `docs/curl-examples.md`

## HTTPS Requirement
Use HTTPS in production. Set secure cookie flags and CSRF tokens for any stateful endpoints.
