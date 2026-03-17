# Deployment Checklist (Railway)

Backend service (ems):
- Create a Railway service from this repo.
- Set Root Directory to `ems`.
- Set Config as Code path to `/ems/railway.yaml`.
- If Java 25 build fails, set `RAILPACK_JDK_VERSION=25` or lower `java.version` in `ems/pom.xml`.

Frontend service (employee-frontend):
- Create a Railway service from this repo.
- Set Root Directory to `employee-frontend`.
- Set Config as Code path to `/employee-frontend/railway.yaml`.
- Set env var `VITE_API_BASE_URL` to the backend public URL.

Smoke checks:
- Backend: open the service URL and verify endpoints like `/employees` respond.
- Frontend: load the site, verify lists load and create/update/delete works.
