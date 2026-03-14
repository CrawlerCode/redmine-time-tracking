<p align="center"><img src="./screenshots/chrome/thumbnail.png" alt="Redmine Time Tracking Banner"></p>

# Redmine Time Tracking (Chrome Extension / Firefox Extension)

![License](https://img.shields.io/github/license/CrawlerCode/redmine-time-tracking?logo=github)
[![Semantic-Release](https://img.shields.io/badge/semantic--release-conventional%20commits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
![Release Version](https://img.shields.io/github/v/release/CrawlerCode/redmine-time-tracking?logo=github)
![Pre-Release Version](https://img.shields.io/github/v/release/CrawlerCode/redmine-time-tracking?include_prereleases&logo=github&label=pre-release)

![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ldcanhhkffokndenejhafhlkapflgcjg?logo=google-chrome&logoColor=white)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ldcanhhkffokndenejhafhlkapflgcjg?logo=google-chrome&logoColor=white)
![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/stars/ldcanhhkffokndenejhafhlkapflgcjg?logo=google-chrome&logoColor=white)

![Mozilla Add-on Version](https://img.shields.io/amo/v/redmine-time-tracking?logo=firefox-browser&logoColor=white)
![Mozilla Add-on Users](https://img.shields.io/amo/users/redmine-time-tracking?logo=firefox-browser&logoColor=white)
![Mozilla Add-on Rating](https://img.shields.io/amo/stars/redmine-time-tracking?logo=firefox-browser&logoColor=white)

> Start-stop timer for [Redmine (open source project management web application)](https://www.redmine.org)

[![Install-Button-Chrome]][Install-Link-Chrome]
[![Install-Button-Firefox]][Install-Link-Firefox]

[Install-Button-Chrome]: https://img.shields.io/badge/Install-Chrome-71b500?style=for-the-badge&logoColor=white&logo=google-chrome
[Install-Link-Chrome]: https://chrome.google.com/webstore/detail/redmine-time-tracking/ldcanhhkffokndenejhafhlkapflgcjg "Open in chrome web store"
[Install-Button-Firefox]: https://img.shields.io/badge/Install-Firefox-71b500?style=for-the-badge&logoColor=white&logo=firefox-browser
[Install-Link-Firefox]: https://addons.mozilla.org/de/firefox/addon/redmine-time-tracking "Open in firefox add-on store"

## 🚀 Features

|                                     |                                     |                                     |
| :---------------------------------: | :---------------------------------: | :---------------------------------: |
| ![1](./screenshots/chrome/en/1.png) | ![2](./screenshots/chrome/en/2.png) | ![3](./screenshots/chrome/en/3.png) |
| ![4](./screenshots/chrome/en/4.png) | ![5](./screenshots/chrome/en/5.png) |                                     |

- View all your assigned Redmine issues grouped by projects
- Filter issues by project and status
- Group issues by target version
- Search for issues (`CTRL` + `K` or `CTRL` + `F`)
- Start, stop and edit timers for your tasks
- Create time entries (also for multiple users at once)
- Update done ratio for issues
- Pin and unpin issues (display at the top)
- Remember and forget issue (not assigned to you)
- View time entries for current and last week
- Multiple languages
- Dark & light mode (system default)

## 🌐 Supported languages

- English
- German
- Russian (thanks [@ASM-Development](https://github.com/ASM-Development))
- French (thanks [@S8N02000](https://github.com/S8N02000))

> If you want to add more languages or extend existing ones, feel free to contribute. Just create a pull request with the desired changes. The language files are located under [src/lang](src/lang) and [public/\_locales](public/_locales).

## 🛠️ Requirements

Supported browsers:

- **Chrome 122** or higher
- **Firefox 127** or higher

Supported Redmine versions:

At least **Redmine version `3.0` or higher** required. Recommended version `5.0` or higher.

### Unsupported features by Redmine versions

| Feature                                                                           | Unsupported Redmine version |
| --------------------------------------------------------------------------------- | --------------------------- |
| Show only **enabled** issue field for selected tracker when _creating new issues_ | `< 5.0.0`                   |
| Show only **allowed statuses** when _updating issue_                              | `< 5.0.0`                   |
| Show spent vs estimated hours                                                     | `< 5.0.0`                   |
| Select the **default fixed version** when _creating new issues_                   | `< 4.1.1`                   |
| Check permissions for admin users who are not members of a project                | `< 4.0.0`                   |
| Display project-available time entry activities when _adding spent time entries_  | `< 3.4.0`                   |
| Remote Redmine search                                                             | `< 3.3.0`                   |

## Credits

Logo is Copyright (C) 2009 Martin Herr and is licensed under Creative Commons ([https://www.redmine.org/projects/redmine/wiki/logo](https://www.redmine.org/projects/redmine/wiki/logo))
