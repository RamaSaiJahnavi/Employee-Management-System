# EMS Backend

Spring Boot backend for the Employee Management System.

## Run locally

```bash
./mvnw spring-boot:run
```

Default URL: `http://localhost:8080`

## Deploy on Railway

1. Create a Railway service for the backend and set **Root Directory** to `ems`.
2. Set the **Config as Code** path to `/ems/railway.toml`.
3. Set env var `RAILPACK_JDK_VERSION=25` in Railway (required because the project targets Java 25).
4. Deploy.
