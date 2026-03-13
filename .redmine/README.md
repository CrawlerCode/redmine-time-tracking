# Redmine dev setup

This folder provides local Redmine instances for manual testing against multiple Redmine versions.

## Start a version

Run from this directory (`.redmine`):

```bash
docker compose up -d redmine-v6
```

Available services and ports:

- Redmine end-to-end tests: [http://localhost:9999](http://localhost:9999) (service `redmine-e2e-tests`)
- Redmine 6: [http://localhost:3006](http://localhost:3006) (service `redmine-v6`)
- Redmine 5: [http://localhost:3005](http://localhost:3005) (service `redmine-v5`)
- Redmine 4: [http://localhost:3004](http://localhost:3004) (service `redmine-v4`)
- Redmine 3: [http://localhost:3003](http://localhost:3003) (service `redmine-v3`)
- Redmine 2: [http://localhost:3002](http://localhost:3002) (service `redmine-v2`)

## Notes

- [Default credentials](https://hub.docker.com/_/redmine#accessing-the-application): `admin`/`admin`
- [Themes](https://www.redmine.org/projects/redmine/wiki/theme_list) are mounted from `.redmine/themes`
