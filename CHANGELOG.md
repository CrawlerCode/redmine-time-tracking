## [2.0.0-beta.1](https://github.com/CrawlerCode/redmine-time-tracking/compare/v1.21.2...v2.0.0-beta.1) (2026-01-27)

### ⚠ BREAKING CHANGES

* The next release should be a major version bump

### 🚀 Features

* Add project info tooltip ([f2a1c80](https://github.com/CrawlerCode/redmine-time-tracking/commit/f2a1c809e57c9c73cf17b7a500219916f2054fe2))
* Allow to specify the rounding mode ([#49](https://github.com/CrawlerCode/redmine-time-tracking/issues/49)) ([2c0322b](https://github.com/CrawlerCode/redmine-time-tracking/commit/2c0322bf5bc70a07c217502c1beacc06c99f05a4))
* Display custom field values for info tooltips ([2d2bef8](https://github.com/CrawlerCode/redmine-time-tracking/commit/2d2bef89ffc3e56ec51cb80386badc6345a8ca95))
* Enhance issue grouping ([#38](https://github.com/CrawlerCode/redmine-time-tracking/issues/38)) ([e2a5a98](https://github.com/CrawlerCode/redmine-time-tracking/commit/e2a5a98f33240db32a19b3b563efd85fec7aed2a))
* Enhance search ([#51](https://github.com/CrawlerCode/redmine-time-tracking/issues/51)) ([770fa4b](https://github.com/CrawlerCode/redmine-time-tracking/commit/770fa4b9035bf6556073e49e4e1836ab12cd0312)), closes [#46](https://github.com/CrawlerCode/redmine-time-tracking/issues/46)
* **filter:** Add issue status filter ([e7807e2](https://github.com/CrawlerCode/redmine-time-tracking/commit/e7807e28a770bb2ee74719f49c75a982ed17859c))
* Multiple timers & timer tab ([bd55541](https://github.com/CrawlerCode/redmine-time-tracking/commit/bd55541bf7ccaed7cbb4668ec92a847e0d3e6db8)), closes [#39](https://github.com/CrawlerCode/redmine-time-tracking/issues/39)
* **timers:** Group timers by project and sort them by newest first ([d66aa6a](https://github.com/CrawlerCode/redmine-time-tracking/commit/d66aa6ad7e41d1561941d505644db84d4396aa14))

### 🩹 Fixes

* Display translated error message until redmine url is configured and remove errors toasts ([4c2d534](https://github.com/CrawlerCode/redmine-time-tracking/commit/4c2d53472d1152baac70f02d8813ac31601d0c80))
* Fix broken persistent comments behavior ([6121441](https://github.com/CrawlerCode/redmine-time-tracking/commit/612144169252cabf7a6417380da19e9f4b9b207b))
* Fix default time entry activity selection ([946c4b6](https://github.com/CrawlerCode/redmine-time-tracking/commit/946c4b634fdb7d842b1e5b33031f338caae34ec4))
* Fix eslint errors ([a245275](https://github.com/CrawlerCode/redmine-time-tracking/commit/a24527525f93f831bf106743f6570dfe9ab58381))
* Fix legacy settings migrations ([1336e31](https://github.com/CrawlerCode/redmine-time-tracking/commit/1336e316450d78d6addc601cfff0f1279628b41f))
* Handle issue priorities when no default is specified ([899c21a](https://github.com/CrawlerCode/redmine-time-tracking/commit/899c21aca56b74526b01d4d282135c69d74a386c))
* Implement legacy data migrations for issues and timers ([c2fd501](https://github.com/CrawlerCode/redmine-time-tracking/commit/c2fd5017b8375ac114a36b141bb1fa4b697acdf3))
* Save persistent comments per timer instead of issue ([bff5fcf](https://github.com/CrawlerCode/redmine-time-tracking/commit/bff5fcfc26e6d09432346d582b6327bac8c6d2ef))
* Skip failed mutations for multi create time spend entires ([a019c16](https://github.com/CrawlerCode/redmine-time-tracking/commit/a019c168d7534bb553604a0e895dce73313db9ea))
* **timer:** Close alert dialog on reset confirm ([9e51a23](https://github.com/CrawlerCode/redmine-time-tracking/commit/9e51a23141cf2821fc85640f33d81471a7d2b467))
* **ui:** Display deleted issues as strike-through text ([90933a9](https://github.com/CrawlerCode/redmine-time-tracking/commit/90933a99d14d2684c17dc6552058ebe0b19a0cb3))
* **ui:** Fix toaster styles inside shadow root ([0319a42](https://github.com/CrawlerCode/redmine-time-tracking/commit/0319a42d50bd77cc0feee0e19f0dda11515c6520))
* Update min browser versions to match current requirements ([bd1e7d0](https://github.com/CrawlerCode/redmine-time-tracking/commit/bd1e7d01581bfaf1943f3a926434028aa0764e0f))

### 🔥 Performance

* Add react compiler and reduce unnecessary re-renders ([acb8551](https://github.com/CrawlerCode/redmine-time-tracking/commit/acb855150e0f9a38dc8b1445bdf55751f747e835))
* Improving data loading and increasing page loading speed ([#52](https://github.com/CrawlerCode/redmine-time-tracking/issues/52)) ([6b22f6b](https://github.com/CrawlerCode/redmine-time-tracking/commit/6b22f6b3629206e18bc45dd55299cf0a8bb111eb))

### 🏡 Chore

* Enforce next release version to v2.0.0 ([fade882](https://github.com/CrawlerCode/redmine-time-tracking/commit/fade8829942707b295cc1be8d097cb1f1cd53495))
* Update npm dependencies ([6c806b9](https://github.com/CrawlerCode/redmine-time-tracking/commit/6c806b9e24c688c8b07aa688424cf04f01920cc0))

### 🛠️ Refactors

* Improve create time entry modal ([49f6eb6](https://github.com/CrawlerCode/redmine-time-tracking/commit/49f6eb6cec9bb43337fce87abd6407465e4011d4))
* Move to tanstack form + zod (removed formik + yup) ([60b9e43](https://github.com/CrawlerCode/redmine-time-tracking/commit/60b9e430fccc30567ad07dffaf367ecdb68eb195))
* Remove add notes settings option ([4c3733c](https://github.com/CrawlerCode/redmine-time-tracking/commit/4c3733c1523f6855ccedaca4b6c2ad97b3c0f185))
* Run settings migration on extension update ([840f48d](https://github.com/CrawlerCode/redmine-time-tracking/commit/840f48d890553c677f4cbef8d5eaba0d3296f8b4))
* **settings:** Redesign settings page and add testing redmine connection button ([3a65610](https://github.com/CrawlerCode/redmine-time-tracking/commit/3a6561014ddd14a04fdcef07776a18637dbc7607))
* **timer:** Refactor timer components and permission improvements ([0b32d3e](https://github.com/CrawlerCode/redmine-time-tracking/commit/0b32d3eb435be2aafe4d476070afad029a686fc1))
* **ui:** Migrate to shadcn components ([#48](https://github.com/CrawlerCode/redmine-time-tracking/issues/48)) ([274e220](https://github.com/CrawlerCode/redmine-time-tracking/commit/274e220fa43123c8f204a844b1c50c4530dcf9f8))
* **ui:** Move to shadcn base-ui components ([#57](https://github.com/CrawlerCode/redmine-time-tracking/issues/57)) ([70994f0](https://github.com/CrawlerCode/redmine-time-tracking/commit/70994f015994a2f6bdef77ca10547fce65cb0e93))
* Upgrade tailwindcss to v4 ([aa42fbb](https://github.com/CrawlerCode/redmine-time-tracking/commit/aa42fbb4eaf1a32293fc59f771ee28bf3fe1ce0f))
* Use null as form default values and update zod to v4 ([cd2f4d8](https://github.com/CrawlerCode/redmine-time-tracking/commit/cd2f4d8a97c4056ae9b53a776c287b4f6134ca73))
* Use only project id for permission check function ([b31c12f](https://github.com/CrawlerCode/redmine-time-tracking/commit/b31c12f9f2e1c2ec868da4f391bb26cee9f823d8))

### 📖 Documentation

* **license:** Update license text for consistency ([37a0ebf](https://github.com/CrawlerCode/redmine-time-tracking/commit/37a0ebf72b6e1701d26db0129385232a771e9d26))

### 🧪 Tests

* Fix all e2e tests ([c46486f](https://github.com/CrawlerCode/redmine-time-tracking/commit/c46486f666442e249c1626cb6811a654147062f3))

### 📦 Builds

* Migrate to wxt framework ([#53](https://github.com/CrawlerCode/redmine-time-tracking/issues/53)) ([a83bf30](https://github.com/CrawlerCode/redmine-time-tracking/commit/a83bf3074e9228c57c7672e00e6cf83fab670b0b))

### ⚡CI

* Add build number for canary version ([df1d96c](https://github.com/CrawlerCode/redmine-time-tracking/commit/df1d96ce75f6f623cc20ef6bfcb3fef8e12646aa))
* Add semantic release ([2ca9621](https://github.com/CrawlerCode/redmine-time-tracking/commit/2ca962157af3027b3600642d283ba45ba931d3c8))
