## [2.0.1](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0...v2.0.1) (2026-04-27)

### 🩹 Fixes

* **ui:** Fix broken layout shift on checkbox/switch label click ([5d12808](https://github.com/CrawlerCode/redmine-time-tracking/commit/5d12808476321d95848917cf6d3124eee04df97d))

### 📦 Builds

* **deps:** Update npm dependencies ([5715726](https://github.com/CrawlerCode/redmine-time-tracking/commit/5715726f8ea821e4ad5aa6637cbecfa5016c2bc8))

### ⚡CI

* Fix firefox publishing ([d3da423](https://github.com/CrawlerCode/redmine-time-tracking/commit/d3da4235cbb95599795ebcf8994628c3132cdefe))

## [2.0.0](https://github.com/CrawlerCode/redmine-time-tracking/compare/v1.21.2...v2.0.0) (2026-04-26)

### ⚠ BREAKING CHANGES

* The next release should be a major version bump

### 🚀 Features

* Add full-screen project sidebar (experimental) ([#64](https://github.com/CrawlerCode/redmine-time-tracking/issues/64)) ([2f4c065](https://github.com/CrawlerCode/redmine-time-tracking/commit/2f4c065f6f0d4e51145318bd41e44f3958217d8e))
* Add issue status badge ([6c5e447](https://github.com/CrawlerCode/redmine-time-tracking/commit/6c5e447c919b35168e0eda61fe5644a6723865d1))
* Add project info tooltip ([f2a1c80](https://github.com/CrawlerCode/redmine-time-tracking/commit/f2a1c809e57c9c73cf17b7a500219916f2054fe2))
* Add side panel entrypoint ([3731d5d](https://github.com/CrawlerCode/redmine-time-tracking/commit/3731d5da1c18806e921699b99c669ae662316cd5))
* Allow to specify the rounding mode ([#49](https://github.com/CrawlerCode/redmine-time-tracking/issues/49)) ([2c0322b](https://github.com/CrawlerCode/redmine-time-tracking/commit/2c0322bf5bc70a07c217502c1beacc06c99f05a4))
* Display custom field values for info tooltips ([2d2bef8](https://github.com/CrawlerCode/redmine-time-tracking/commit/2d2bef89ffc3e56ec51cb80386badc6345a8ca95))
* Enhance issue grouping ([#38](https://github.com/CrawlerCode/redmine-time-tracking/issues/38)) ([e2a5a98](https://github.com/CrawlerCode/redmine-time-tracking/commit/e2a5a98f33240db32a19b3b563efd85fec7aed2a))
* Enhance search ([#51](https://github.com/CrawlerCode/redmine-time-tracking/issues/51)) ([770fa4b](https://github.com/CrawlerCode/redmine-time-tracking/commit/770fa4b9035bf6556073e49e4e1836ab12cd0312)), closes [#46](https://github.com/CrawlerCode/redmine-time-tracking/issues/46)
* **filter:** Add issue status filter ([e7807e2](https://github.com/CrawlerCode/redmine-time-tracking/commit/e7807e28a770bb2ee74719f49c75a982ed17859c))
* Multiple timers & timer tab ([bd55541](https://github.com/CrawlerCode/redmine-time-tracking/commit/bd55541bf7ccaed7cbb4668ec92a847e0d3e6db8)), closes [#39](https://github.com/CrawlerCode/redmine-time-tracking/issues/39)
* **settings:** Add option to show/hide issue done ratio ([bc9b6c3](https://github.com/CrawlerCode/redmine-time-tracking/commit/bc9b6c3c597ff1dca6ebdaa06dc31aba45e07762))
* **settings:** Add option to show/hide timer sessions ([6022751](https://github.com/CrawlerCode/redmine-time-tracking/commit/602275185fbad50d34cfe1406089842d1ae0cfee))
* **timers:** Add timer sessions ([#69](https://github.com/CrawlerCode/redmine-time-tracking/issues/69)) ([#71](https://github.com/CrawlerCode/redmine-time-tracking/issues/71)) ([ed42990](https://github.com/CrawlerCode/redmine-time-tracking/commit/ed42990c135ec1c3a577ed372d31bf8715804005))
* **timers:** Group timers by project and sort them by newest first ([d66aa6a](https://github.com/CrawlerCode/redmine-time-tracking/commit/d66aa6ad7e41d1561941d505644db84d4396aa14))

### 🩹 Fixes

* Cleanup local issue data on reset to default data ([9a7adc1](https://github.com/CrawlerCode/redmine-time-tracking/commit/9a7adc1e73be2a11302b579f7f1a15db288e2fd3))
* Display translated error message until redmine url is configured and remove errors toasts ([4c2d534](https://github.com/CrawlerCode/redmine-time-tracking/commit/4c2d53472d1152baac70f02d8813ac31601d0c80))
* Enforce next release ([1d7d37c](https://github.com/CrawlerCode/redmine-time-tracking/commit/1d7d37c099aa1de809d5f143eabb9f75bb24950a))
* Fire toast after query reset ([f051446](https://github.com/CrawlerCode/redmine-time-tracking/commit/f051446513f00e4af352e28d46ce10e4c041d2fb))
* Fix 0 value selection for select field ([35af5e4](https://github.com/CrawlerCode/redmine-time-tracking/commit/35af5e4a145a39cf6862120cebaa9b0c6b70fb04))
* Fix autoFetchPages for redmine paginated queries ([a925baa](https://github.com/CrawlerCode/redmine-time-tracking/commit/a925baa79ec4c5575dbf81072ead535d09b9e5c2))
* Fix broken persistent comments behavior ([6121441](https://github.com/CrawlerCode/redmine-time-tracking/commit/612144169252cabf7a6417380da19e9f4b9b207b))
* Fix context menu dialog actions ([66cbc7a](https://github.com/CrawlerCode/redmine-time-tracking/commit/66cbc7a9dcb4dd08276eb862c836997c4e73a5a7))
* Fix default time entry activity ([0f316ae](https://github.com/CrawlerCode/redmine-time-tracking/commit/0f316aefdcb0c72f9283c893812a1d473c753567))
* Fix default time entry activity selection ([946c4b6](https://github.com/CrawlerCode/redmine-time-tracking/commit/946c4b634fdb7d842b1e5b33031f338caae34ec4))
* Fix eslint errors ([a245275](https://github.com/CrawlerCode/redmine-time-tracking/commit/a24527525f93f831bf106743f6570dfe9ab58381))
* Fix install listener registration ([8b9b125](https://github.com/CrawlerCode/redmine-time-tracking/commit/8b9b125d37d3360afceabc045e45613001d845f2))
* Fix legacy settings migrations ([1336e31](https://github.com/CrawlerCode/redmine-time-tracking/commit/1336e316450d78d6addc601cfff0f1279628b41f))
* Fix suspense settings provider ([#60](https://github.com/CrawlerCode/redmine-time-tracking/issues/60)) ([cfc47f3](https://github.com/CrawlerCode/redmine-time-tracking/commit/cfc47f33f42a0089f5fa1440ab428d5ba8aa9a32))
* Handle issue priorities when no default is specified ([899c21a](https://github.com/CrawlerCode/redmine-time-tracking/commit/899c21aca56b74526b01d4d282135c69d74a386c))
* Implement legacy data migrations for issues and timers ([c2fd501](https://github.com/CrawlerCode/redmine-time-tracking/commit/c2fd5017b8375ac114a36b141bb1fa4b697acdf3))
* Prevent empty issues fetch request ([#65](https://github.com/CrawlerCode/redmine-time-tracking/issues/65)) ([6616c64](https://github.com/CrawlerCode/redmine-time-tracking/commit/6616c6430da8649af0f9ccccdd6ab064ff0d402b))
* Save persistent comments per timer instead of issue ([bff5fcf](https://github.com/CrawlerCode/redmine-time-tracking/commit/bff5fcfc26e6d09432346d582b6327bac8c6d2ef))
* Skip failed mutations for multi create time spend entires ([a019c16](https://github.com/CrawlerCode/redmine-time-tracking/commit/a019c168d7534bb553604a0e895dce73313db9ea))
* **timer:** Close alert dialog on reset confirm ([9e51a23](https://github.com/CrawlerCode/redmine-time-tracking/commit/9e51a23141cf2821fc85640f33d81471a7d2b467))
* **timer:** Fix timer name cursor focus ([dee98ec](https://github.com/CrawlerCode/redmine-time-tracking/commit/dee98ecabeaa2caccc83949f740dd5eae4d37d82))
* **ui:** Display deleted issues as strike-through text ([90933a9](https://github.com/CrawlerCode/redmine-time-tracking/commit/90933a99d14d2684c17dc6552058ebe0b19a0cb3))
* **ui:** Enhance skeleton components ([d89a901](https://github.com/CrawlerCode/redmine-time-tracking/commit/d89a901413cc12f5411277b883a96a48c07e633f))
* **ui:** Fix dark mode for firefox options and sidepanel ([ba6b406](https://github.com/CrawlerCode/redmine-time-tracking/commit/ba6b4065eac518c3b2d4724ceefee7aa3dd57b3a))
* **ui:** Fix layout inconsistencies depending on style settings ([6cef7e3](https://github.com/CrawlerCode/redmine-time-tracking/commit/6cef7e3a70316e10e9dfae210a998bae2f19c336))
* **ui:** Fix toaster styles inside shadow root ([0319a42](https://github.com/CrawlerCode/redmine-time-tracking/commit/0319a42d50bd77cc0feee0e19f0dda11515c6520))
* **ui:** Improve combobox clear button position ([932d36d](https://github.com/CrawlerCode/redmine-time-tracking/commit/932d36d319515bbdfc0300e1325a6ae886f58ef7))
* **ui:** Polished various ui elements ([c095c5c](https://github.com/CrawlerCode/redmine-time-tracking/commit/c095c5c0338832d1f73b95ec8f1bcd8a062d25a6))
* **ui:** Truncate field labels ([e779018](https://github.com/CrawlerCode/redmine-time-tracking/commit/e779018f048e6b90833f309fcfceab12797311b0))
* Update min browser versions to match current requirements ([bd1e7d0](https://github.com/CrawlerCode/redmine-time-tracking/commit/bd1e7d01581bfaf1943f3a926434028aa0764e0f))

### 🔥 Performance

* Add query client restoring gate instead of restoring twice ([30b9aeb](https://github.com/CrawlerCode/redmine-time-tracking/commit/30b9aeb2818f0e58c0ea749d22b1e2cfc7de0d80))
* Add react compiler and reduce unnecessary re-renders ([acb8551](https://github.com/CrawlerCode/redmine-time-tracking/commit/acb855150e0f9a38dc8b1445bdf55751f747e835))
* Improve performance by moving stuff to dedicated components ([f2f7fab](https://github.com/CrawlerCode/redmine-time-tracking/commit/f2f7fab23df7075946090df41288a1e5b941e4e1))
* Improving data loading and increasing page loading speed ([#52](https://github.com/CrawlerCode/redmine-time-tracking/issues/52)) ([6b22f6b](https://github.com/CrawlerCode/redmine-time-tracking/commit/6b22f6b3629206e18bc45dd55299cf0a8bb111eb))
* Set NODE_ENV=production for release & pre-release builds ([4a922ff](https://github.com/CrawlerCode/redmine-time-tracking/commit/4a922ff9fedd001671c000a16ef1876935b35738))
* Use react context for permissions management ([#63](https://github.com/CrawlerCode/redmine-time-tracking/issues/63)) ([23f25f0](https://github.com/CrawlerCode/redmine-time-tracking/commit/23f25f00d628bdd1f910b6238aef5a9287538e7c))

### 🏡 Chore

* Add docker compose for dev setup ([bb79a02](https://github.com/CrawlerCode/redmine-time-tracking/commit/bb79a021a9b3c0f65465a2473b69883d8ddb1039))
* Add install buttons to github releases ([3c97a80](https://github.com/CrawlerCode/redmine-time-tracking/commit/3c97a80ef1046608168c8f927bc47d7a58eb61ff))
* **deps:** Update dependencies ([2a3f1fb](https://github.com/CrawlerCode/redmine-time-tracking/commit/2a3f1fbdab6fb67da33f91c821bb5e0b0b18885c))
* **deps:** Update dependencies ([6f800bd](https://github.com/CrawlerCode/redmine-time-tracking/commit/6f800bd82bd7fcb3cf806fddc372b3ff20ef4cc0))
* **deps:** Update npm dependencies ([0132802](https://github.com/CrawlerCode/redmine-time-tracking/commit/01328027f5e027e959165645351d0ea9c39c9c99))
* **deps:** Update npm dependencies ([b0256f0](https://github.com/CrawlerCode/redmine-time-tracking/commit/b0256f06df6f97353708d2aba7a81bc1eff3d347))
* **deps:** Update npm dependencies ([e966f7e](https://github.com/CrawlerCode/redmine-time-tracking/commit/e966f7e6803f335260b7a3d68fd0023a79fe6ad3))
* Enforce next release version to v2.0.0 ([fade882](https://github.com/CrawlerCode/redmine-time-tracking/commit/fade8829942707b295cc1be8d097cb1f1cd53495))
* Fix eslint errors ([9ec1e07](https://github.com/CrawlerCode/redmine-time-tracking/commit/9ec1e07ee3895d36d0433ff3a899370b58659b46))
* Introduced script to automate chrome store screenshot generation ([#67](https://github.com/CrawlerCode/redmine-time-tracking/issues/67)) ([c34baa2](https://github.com/CrawlerCode/redmine-time-tracking/commit/c34baa265578f22b6ea46cae13cfd1d6bacb3b63))
* **lint:** Fix htmlhint errors ([07604c3](https://github.com/CrawlerCode/redmine-time-tracking/commit/07604c351d4645489529c65e861bd259d1ae81b8))
* **security:** Set pnpm minimum release age to 1 days ([0d595c2](https://github.com/CrawlerCode/redmine-time-tracking/commit/0d595c2ab4e2206d9b6b5b58632a46844aca3580))
* Update dependencies ([891fd66](https://github.com/CrawlerCode/redmine-time-tracking/commit/891fd662232a49099abf96a71a8ed4a053eb2fc7))
* Update npm dependencies ([a9bb249](https://github.com/CrawlerCode/redmine-time-tracking/commit/a9bb2494a5369159ab24a8c2babd2e72fc8ed5a4))
* Update npm dependencies ([6c806b9](https://github.com/CrawlerCode/redmine-time-tracking/commit/6c806b9e24c688c8b07aa688424cf04f01920cc0))
* Update shadcn components ([4f9bb88](https://github.com/CrawlerCode/redmine-time-tracking/commit/4f9bb883c8f68977c67e39838e5dbd5f242d4b7c))
* Upgrade to typescript 6 and hardened  ts config ([5e34a03](https://github.com/CrawlerCode/redmine-time-tracking/commit/5e34a039d764a0c482529f9bdb334931b1cebfc0))
* Upgrade to vite v8 ([8210cb5](https://github.com/CrawlerCode/redmine-time-tracking/commit/8210cb5c64a6dafc2ef0f15cf748bdcae80c5162))

### 🛠️ Refactors

* Fix some warnings and errors from react-doctor ([c4d9c84](https://github.com/CrawlerCode/redmine-time-tracking/commit/c4d9c8493f29ee162e7ae36417aeb63c7b94a261))
* Improve create time entry modal ([49f6eb6](https://github.com/CrawlerCode/redmine-time-tracking/commit/49f6eb6cec9bb43337fce87abd6407465e4011d4))
* Move to tanstack form + zod (removed formik + yup) ([60b9e43](https://github.com/CrawlerCode/redmine-time-tracking/commit/60b9e430fccc30567ad07dffaf367ecdb68eb195))
* Refactor redmine api hooks ([6642499](https://github.com/CrawlerCode/redmine-time-tracking/commit/66424994e80f76c826a518967bc5d6b117b98523))
* Remove add notes settings option ([4c3733c](https://github.com/CrawlerCode/redmine-time-tracking/commit/4c3733c1523f6855ccedaca4b6c2ad97b3c0f185))
* Run settings migration on extension update ([840f48d](https://github.com/CrawlerCode/redmine-time-tracking/commit/840f48d890553c677f4cbef8d5eaba0d3296f8b4))
* **settings:** Redesign settings page and add testing redmine connection button ([3a65610](https://github.com/CrawlerCode/redmine-time-tracking/commit/3a6561014ddd14a04fdcef07776a18637dbc7607))
* **timer:** Refactor timer components and permission improvements ([0b32d3e](https://github.com/CrawlerCode/redmine-time-tracking/commit/0b32d3eb435be2aafe4d476070afad029a686fc1))
* **timer:** Remove the reset timer button ([26e0f2f](https://github.com/CrawlerCode/redmine-time-tracking/commit/26e0f2fe898b6fb9d5d317f28fdec095e4d93864))
* **ui:** Migrate to shadcn components ([#48](https://github.com/CrawlerCode/redmine-time-tracking/issues/48)) ([274e220](https://github.com/CrawlerCode/redmine-time-tracking/commit/274e220fa43123c8f204a844b1c50c4530dcf9f8))
* **ui:** Move to shadcn base-ui components ([#57](https://github.com/CrawlerCode/redmine-time-tracking/issues/57)) ([70994f0](https://github.com/CrawlerCode/redmine-time-tracking/commit/70994f015994a2f6bdef77ca10547fce65cb0e93))
* **ui:** Refactor time entry week overview ([2710d3b](https://github.com/CrawlerCode/redmine-time-tracking/commit/2710d3be7012217ea79b0b23bcef546f7e7ceb69))
* Upgrade tailwindcss to v4 ([aa42fbb](https://github.com/CrawlerCode/redmine-time-tracking/commit/aa42fbb4eaf1a32293fc59f771ee28bf3fe1ce0f))
* Use null as form default values and update zod to v4 ([cd2f4d8](https://github.com/CrawlerCode/redmine-time-tracking/commit/cd2f4d8a97c4056ae9b53a776c287b4f6134ca73))
* Use only project id for permission check function ([b31c12f](https://github.com/CrawlerCode/redmine-time-tracking/commit/b31c12f9f2e1c2ec868da4f391bb26cee9f823d8))

### 📖 Documentation

* **github:** Enhance issue and feature request templates ([#68](https://github.com/CrawlerCode/redmine-time-tracking/issues/68)) ([e70f419](https://github.com/CrawlerCode/redmine-time-tracking/commit/e70f4192ef8032137d1831568622f249cd0d8913))
* **license:** Update license text for consistency ([37a0ebf](https://github.com/CrawlerCode/redmine-time-tracking/commit/37a0ebf72b6e1701d26db0129385232a771e9d26))
* Update README ([8011225](https://github.com/CrawlerCode/redmine-time-tracking/commit/801122541f2d5590eff14949d5726068b680cb38))
* Update store screenshots ([702a2c4](https://github.com/CrawlerCode/redmine-time-tracking/commit/702a2c4de603b8cf913aae2bd361112c963558fa))
* Update store screenshots ([cd60ec7](https://github.com/CrawlerCode/redmine-time-tracking/commit/cd60ec707cc67fc87f6c31011ef61dc558967758))

### 🧪 Tests

* Fix all e2e tests ([c46486f](https://github.com/CrawlerCode/redmine-time-tracking/commit/c46486f666442e249c1626cb6811a654147062f3))
* Fix flaky tests ([1e0a7a2](https://github.com/CrawlerCode/redmine-time-tracking/commit/1e0a7a2c6ef7b23e460b4ea8f3e04c665feae843))
* Fix flaky time drift tests ([cadd015](https://github.com/CrawlerCode/redmine-time-tracking/commit/cadd01521f55b272046d575a0d9e96d198442b32))
* Introduce snapshot-based e2e tests ([#66](https://github.com/CrawlerCode/redmine-time-tracking/issues/66)) ([dfcb7fb](https://github.com/CrawlerCode/redmine-time-tracking/commit/dfcb7fbcb1f6a76c3fb3c628945591b6f7a48ca1))

### 📦 Builds

* **deps-dev:** bump vite from 8.0.3 to 8.0.5 ([#70](https://github.com/CrawlerCode/redmine-time-tracking/issues/70)) ([aed8cdc](https://github.com/CrawlerCode/redmine-time-tracking/commit/aed8cdccb08246745788943193cd755266d59888))
* **deps:** bump axios from 1.14.0 to 1.15.0 ([#72](https://github.com/CrawlerCode/redmine-time-tracking/issues/72)) ([057ad2c](https://github.com/CrawlerCode/redmine-time-tracking/commit/057ad2c4c63912b58ee747d68e2e3429eb00a508))
* Migrate to wxt framework ([#53](https://github.com/CrawlerCode/redmine-time-tracking/issues/53)) ([a83bf30](https://github.com/CrawlerCode/redmine-time-tracking/commit/a83bf3074e9228c57c7672e00e6cf83fab670b0b))

### ⚡CI

* Add build number for canary version ([df1d96c](https://github.com/CrawlerCode/redmine-time-tracking/commit/df1d96ce75f6f623cc20ef6bfcb3fef8e12646aa))
* Add semantic release ([2ca9621](https://github.com/CrawlerCode/redmine-time-tracking/commit/2ca962157af3027b3600642d283ba45ba931d3c8))
* Add super-linter for pull requests ([#59](https://github.com/CrawlerCode/redmine-time-tracking/issues/59)) ([9db6385](https://github.com/CrawlerCode/redmine-time-tracking/commit/9db6385931fcb6604368514f8d7fcfe0824b1efc))
* Fix pre-release asset upload ([ac8f132](https://github.com/CrawlerCode/redmine-time-tracking/commit/ac8f1327ef3636142c112d57a7912d8fdea7c7d3))
* Fix wxt submit ([74fe75d](https://github.com/CrawlerCode/redmine-time-tracking/commit/74fe75d9b951b42cc049c4cc41273cc4f8ddcc07))
* Publish production only for real releases not for pre-releases ([9855905](https://github.com/CrawlerCode/redmine-time-tracking/commit/9855905c077172cec3c3c39853b309d0cb400179))
* Use pat for release creation to trigger publish pipeline ([7b15071](https://github.com/CrawlerCode/redmine-time-tracking/commit/7b15071bc083630ac0d7cbf45756e1edc87f7db0))

## [2.0.0-beta.7](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2026-04-19)

### 🚀 Features

* Add issue status badge ([6c5e447](https://github.com/CrawlerCode/redmine-time-tracking/commit/6c5e447c919b35168e0eda61fe5644a6723865d1))
* Add side panel entrypoint ([3731d5d](https://github.com/CrawlerCode/redmine-time-tracking/commit/3731d5da1c18806e921699b99c669ae662316cd5))
* **settings:** Add option to show/hide issue done ratio ([bc9b6c3](https://github.com/CrawlerCode/redmine-time-tracking/commit/bc9b6c3c597ff1dca6ebdaa06dc31aba45e07762))
* **settings:** Add option to show/hide timer sessions ([6022751](https://github.com/CrawlerCode/redmine-time-tracking/commit/602275185fbad50d34cfe1406089842d1ae0cfee))

### 🩹 Fixes

* Fix install listener registration ([8b9b125](https://github.com/CrawlerCode/redmine-time-tracking/commit/8b9b125d37d3360afceabc045e45613001d845f2))
* **ui:** Fix dark mode for firefox options and sidepanel ([ba6b406](https://github.com/CrawlerCode/redmine-time-tracking/commit/ba6b4065eac518c3b2d4724ceefee7aa3dd57b3a))

### 🏡 Chore

* **deps:** Update npm dependencies ([0132802](https://github.com/CrawlerCode/redmine-time-tracking/commit/01328027f5e027e959165645351d0ea9c39c9c99))
* **deps:** Update npm dependencies ([b0256f0](https://github.com/CrawlerCode/redmine-time-tracking/commit/b0256f06df6f97353708d2aba7a81bc1eff3d347))
* **lint:** Fix htmlhint errors ([07604c3](https://github.com/CrawlerCode/redmine-time-tracking/commit/07604c351d4645489529c65e861bd259d1ae81b8))

### 📖 Documentation

* Update store screenshots ([702a2c4](https://github.com/CrawlerCode/redmine-time-tracking/commit/702a2c4de603b8cf913aae2bd361112c963558fa))

### 🧪 Tests

* Fix flaky time drift tests ([cadd015](https://github.com/CrawlerCode/redmine-time-tracking/commit/cadd01521f55b272046d575a0d9e96d198442b32))

## [2.0.0-beta.6](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2026-04-12)

### 🚀 Features

* **timers:** Add timer sessions ([#69](https://github.com/CrawlerCode/redmine-time-tracking/issues/69)) ([#71](https://github.com/CrawlerCode/redmine-time-tracking/issues/71)) ([ed42990](https://github.com/CrawlerCode/redmine-time-tracking/commit/ed42990c135ec1c3a577ed372d31bf8715804005))

### 🩹 Fixes

* **timer:** Fix timer name cursor focus ([dee98ec](https://github.com/CrawlerCode/redmine-time-tracking/commit/dee98ecabeaa2caccc83949f740dd5eae4d37d82))

### 🏡 Chore

* **deps:** Update npm dependencies ([e966f7e](https://github.com/CrawlerCode/redmine-time-tracking/commit/e966f7e6803f335260b7a3d68fd0023a79fe6ad3))
* **security:** Set pnpm minimum release age to 1 days ([0d595c2](https://github.com/CrawlerCode/redmine-time-tracking/commit/0d595c2ab4e2206d9b6b5b58632a46844aca3580))

### 📖 Documentation

* Update store screenshots ([cd60ec7](https://github.com/CrawlerCode/redmine-time-tracking/commit/cd60ec707cc67fc87f6c31011ef61dc558967758))

### 📦 Builds

* **deps-dev:** bump vite from 8.0.3 to 8.0.5 ([#70](https://github.com/CrawlerCode/redmine-time-tracking/issues/70)) ([aed8cdc](https://github.com/CrawlerCode/redmine-time-tracking/commit/aed8cdccb08246745788943193cd755266d59888))
* **deps:** bump axios from 1.14.0 to 1.15.0 ([#72](https://github.com/CrawlerCode/redmine-time-tracking/issues/72)) ([057ad2c](https://github.com/CrawlerCode/redmine-time-tracking/commit/057ad2c4c63912b58ee747d68e2e3429eb00a508))

## [2.0.0-beta.5](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2026-03-30)

### 🩹 Fixes

* Fix autoFetchPages for redmine paginated queries ([a925baa](https://github.com/CrawlerCode/redmine-time-tracking/commit/a925baa79ec4c5575dbf81072ead535d09b9e5c2))
* **ui:** Enhance skeleton components ([d89a901](https://github.com/CrawlerCode/redmine-time-tracking/commit/d89a901413cc12f5411277b883a96a48c07e633f))
* **ui:** Fix layout inconsistencies depending on style settings ([6cef7e3](https://github.com/CrawlerCode/redmine-time-tracking/commit/6cef7e3a70316e10e9dfae210a998bae2f19c336))
* **ui:** Improve combobox clear button position ([932d36d](https://github.com/CrawlerCode/redmine-time-tracking/commit/932d36d319515bbdfc0300e1325a6ae886f58ef7))
* **ui:** Truncate field labels ([e779018](https://github.com/CrawlerCode/redmine-time-tracking/commit/e779018f048e6b90833f309fcfceab12797311b0))

### 🏡 Chore

* Fix eslint errors ([9ec1e07](https://github.com/CrawlerCode/redmine-time-tracking/commit/9ec1e07ee3895d36d0433ff3a899370b58659b46))
* Introduced script to automate chrome store screenshot generation ([#67](https://github.com/CrawlerCode/redmine-time-tracking/issues/67)) ([c34baa2](https://github.com/CrawlerCode/redmine-time-tracking/commit/c34baa265578f22b6ea46cae13cfd1d6bacb3b63))
* Update npm dependencies ([a9bb249](https://github.com/CrawlerCode/redmine-time-tracking/commit/a9bb2494a5369159ab24a8c2babd2e72fc8ed5a4))
* Update shadcn components ([4f9bb88](https://github.com/CrawlerCode/redmine-time-tracking/commit/4f9bb883c8f68977c67e39838e5dbd5f242d4b7c))
* Upgrade to typescript 6 and hardened  ts config ([5e34a03](https://github.com/CrawlerCode/redmine-time-tracking/commit/5e34a039d764a0c482529f9bdb334931b1cebfc0))
* Upgrade to vite v8 ([8210cb5](https://github.com/CrawlerCode/redmine-time-tracking/commit/8210cb5c64a6dafc2ef0f15cf748bdcae80c5162))

### 🛠️ Refactors

* Fix some warnings and errors from react-doctor ([c4d9c84](https://github.com/CrawlerCode/redmine-time-tracking/commit/c4d9c8493f29ee162e7ae36417aeb63c7b94a261))
* **ui:** Refactor time entry week overview ([2710d3b](https://github.com/CrawlerCode/redmine-time-tracking/commit/2710d3be7012217ea79b0b23bcef546f7e7ceb69))

### 📖 Documentation

* **github:** Enhance issue and feature request templates ([#68](https://github.com/CrawlerCode/redmine-time-tracking/issues/68)) ([e70f419](https://github.com/CrawlerCode/redmine-time-tracking/commit/e70f4192ef8032137d1831568622f249cd0d8913))

### 🧪 Tests

* Fix flaky tests ([1e0a7a2](https://github.com/CrawlerCode/redmine-time-tracking/commit/1e0a7a2c6ef7b23e460b4ea8f3e04c665feae843))
* Introduce snapshot-based e2e tests ([#66](https://github.com/CrawlerCode/redmine-time-tracking/issues/66)) ([dfcb7fb](https://github.com/CrawlerCode/redmine-time-tracking/commit/dfcb7fbcb1f6a76c3fb3c628945591b6f7a48ca1))

## [2.0.0-beta.4](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2026-03-09)

### 🩹 Fixes

* Cleanup local issue data on reset to default data ([9a7adc1](https://github.com/CrawlerCode/redmine-time-tracking/commit/9a7adc1e73be2a11302b579f7f1a15db288e2fd3))
* Fire toast after query reset ([f051446](https://github.com/CrawlerCode/redmine-time-tracking/commit/f051446513f00e4af352e28d46ce10e4c041d2fb))
* Prevent empty issues fetch request ([#65](https://github.com/CrawlerCode/redmine-time-tracking/issues/65)) ([6616c64](https://github.com/CrawlerCode/redmine-time-tracking/commit/6616c6430da8649af0f9ccccdd6ab064ff0d402b))

## [2.0.0-beta.3](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2026-03-08)

### 🚀 Features

* Add full-screen project sidebar (experimental) ([#64](https://github.com/CrawlerCode/redmine-time-tracking/issues/64)) ([2f4c065](https://github.com/CrawlerCode/redmine-time-tracking/commit/2f4c065f6f0d4e51145318bd41e44f3958217d8e))

### 🩹 Fixes

* Fix 0 value selection for select field ([35af5e4](https://github.com/CrawlerCode/redmine-time-tracking/commit/35af5e4a145a39cf6862120cebaa9b0c6b70fb04))
* Fix context menu dialog actions ([66cbc7a](https://github.com/CrawlerCode/redmine-time-tracking/commit/66cbc7a9dcb4dd08276eb862c836997c4e73a5a7))
* Fix default time entry activity ([0f316ae](https://github.com/CrawlerCode/redmine-time-tracking/commit/0f316aefdcb0c72f9283c893812a1d473c753567))
* Fix suspense settings provider ([#60](https://github.com/CrawlerCode/redmine-time-tracking/issues/60)) ([cfc47f3](https://github.com/CrawlerCode/redmine-time-tracking/commit/cfc47f33f42a0089f5fa1440ab428d5ba8aa9a32))
* **ui:** Polished various ui elements ([c095c5c](https://github.com/CrawlerCode/redmine-time-tracking/commit/c095c5c0338832d1f73b95ec8f1bcd8a062d25a6))

### 🔥 Performance

* Add query client restoring gate instead of restoring twice ([30b9aeb](https://github.com/CrawlerCode/redmine-time-tracking/commit/30b9aeb2818f0e58c0ea749d22b1e2cfc7de0d80))
* Improve performance by moving stuff to dedicated components ([f2f7fab](https://github.com/CrawlerCode/redmine-time-tracking/commit/f2f7fab23df7075946090df41288a1e5b941e4e1))
* Set NODE_ENV=production for release & pre-release builds ([4a922ff](https://github.com/CrawlerCode/redmine-time-tracking/commit/4a922ff9fedd001671c000a16ef1876935b35738))
* Use react context for permissions management ([#63](https://github.com/CrawlerCode/redmine-time-tracking/issues/63)) ([23f25f0](https://github.com/CrawlerCode/redmine-time-tracking/commit/23f25f00d628bdd1f910b6238aef5a9287538e7c))

### 🏡 Chore

* Add docker compose for dev setup ([bb79a02](https://github.com/CrawlerCode/redmine-time-tracking/commit/bb79a021a9b3c0f65465a2473b69883d8ddb1039))
* Add install buttons to github releases ([3c97a80](https://github.com/CrawlerCode/redmine-time-tracking/commit/3c97a80ef1046608168c8f927bc47d7a58eb61ff))
* **deps:** Update dependencies ([2a3f1fb](https://github.com/CrawlerCode/redmine-time-tracking/commit/2a3f1fbdab6fb67da33f91c821bb5e0b0b18885c))
* Update dependencies ([891fd66](https://github.com/CrawlerCode/redmine-time-tracking/commit/891fd662232a49099abf96a71a8ed4a053eb2fc7))

### 🛠️ Refactors

* Refactor redmine api hooks ([6642499](https://github.com/CrawlerCode/redmine-time-tracking/commit/66424994e80f76c826a518967bc5d6b117b98523))
* **timer:** Remove the reset timer button ([26e0f2f](https://github.com/CrawlerCode/redmine-time-tracking/commit/26e0f2fe898b6fb9d5d317f28fdec095e4d93864))

### ⚡CI

* Add super-linter for pull requests ([#59](https://github.com/CrawlerCode/redmine-time-tracking/issues/59)) ([9db6385](https://github.com/CrawlerCode/redmine-time-tracking/commit/9db6385931fcb6604368514f8d7fcfe0824b1efc))
* Fix wxt submit ([74fe75d](https://github.com/CrawlerCode/redmine-time-tracking/commit/74fe75d9b951b42cc049c4cc41273cc4f8ddcc07))
* Use pat for release creation to trigger publish pipeline ([7b15071](https://github.com/CrawlerCode/redmine-time-tracking/commit/7b15071bc083630ac0d7cbf45756e1edc87f7db0))

## [2.0.0-beta.2](https://github.com/CrawlerCode/redmine-time-tracking/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2026-01-27)

### 🩹 Fixes

* Enforce next release ([1d7d37c](https://github.com/CrawlerCode/redmine-time-tracking/commit/1d7d37c099aa1de809d5f143eabb9f75bb24950a))

### 🏡 Chore

* **deps:** Update dependencies ([6f800bd](https://github.com/CrawlerCode/redmine-time-tracking/commit/6f800bd82bd7fcb3cf806fddc372b3ff20ef4cc0))

### 📖 Documentation

* Update README ([8011225](https://github.com/CrawlerCode/redmine-time-tracking/commit/801122541f2d5590eff14949d5726068b680cb38))

### ⚡CI

* Fix pre-release asset upload ([ac8f132](https://github.com/CrawlerCode/redmine-time-tracking/commit/ac8f1327ef3636142c112d57a7912d8fdea7c7d3))
* Publish production only for real releases not for pre-releases ([9855905](https://github.com/CrawlerCode/redmine-time-tracking/commit/9855905c077172cec3c3c39853b309d0cb400179))

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
