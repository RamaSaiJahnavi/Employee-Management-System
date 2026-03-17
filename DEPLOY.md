# Deployment Checklist (Railway)

Backend service (ems):
- Create a Railway service from this repo.
- Set Root Directory to `ems`.
- Set Config as Code path to `/ems/railway.toml`.
- Set env var `RAILPACK_JDK_VERSION=25` in Railway (required because the project targets Java 25).

Frontend service (employee-frontend):
- Create a Railway service from this repo.
- Set Root Directory to `employee-frontend`.
- Set Config as Code path to `/employee-frontend/railway.toml`.
- Set env var `VITE_API_BASE_URL` to the backend public URL.

Smoke checks:
- Backend: open the service URL and verify endpoints like `/employees` respond.
- Frontend: load the site, verify lists load and create/update/delete works.
