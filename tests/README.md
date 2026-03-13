# End-to-end Tests

These end-to-end tests run against a dedicated Redmine Docker service (`redmine-e2e-tests`).
The service uses a prepared database from this repository with example data, so test scenarios are always based on the same dataset.
In addition, tests are frozen to a specific date to keep date-dependent behavior stable.
This makes test runs deterministic and reproducible.

## How To Run Tests

1. Build the extension:

```bash
pnpm run build:chrome
```

2. Start the Redmine service:

```bash
cd .redmine
docker compose up -d redmine-e2e-tests
```

3. Run tests:

```bash
pnpm test
```

## Test Redmine Credentials

- URL: `http://127.0.0.1:9999`
- User: `admin`
- Password: `password`
