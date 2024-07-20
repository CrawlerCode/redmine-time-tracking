![Package Version](https://img.shields.io/github/package-json/v/CrawlerCode/redmine-time-tracking?logo=github)
![License](https://img.shields.io/github/license/CrawlerCode/redmine-time-tracking?logo=github)
![GitHub Release Date](https://img.shields.io/github/release-date/CrawlerCode/redmine-time-tracking?logo=github)
![GitHub issues](https://img.shields.io/github/issues/CrawlerCode/redmine-time-tracking?logo=github)

![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/ldcanhhkffokndenejhafhlkapflgcjg?logo=google-chrome&logoColor=white)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/ldcanhhkffokndenejhafhlkapflgcjg?logo=google-chrome&logoColor=white)
![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/stars/ldcanhhkffokndenejhafhlkapflgcjg?logo=google-chrome&logoColor=white)

# Redmine Time Tracking (Chrome Extensions)

> Start-stop timer for [Redmine](https://www.redmine.org/).

[![Install Button]][Install Link]

[Install Button]: https://img.shields.io/badge/Install-71b500?style=for-the-badge&logoColor=white&logo=google-chrome
[Install Link]: https://chrome.google.com/webstore/detail/redmine-time-tracking/ldcanhhkffokndenejhafhlkapflgcjg "Open in chrome web store"

# Features

- View all your assigned Redmine issues grouped by projects
- Filter issues by projects
- Group issues by target version
- Search for issues (press `CTRL` + `K` or `CTRL` + `F`)
- Start, stop and edit the timer for your current tasks
- Create entry for time spent (and for multiple users at once)
- Update done ratio for issues
- Pin and unpin issues (display at the top of the project)
- Remember and forget issue (not assigned to you)
- View time entries for current and last week
- Multiple languages
- Dark & light mode (system default)

# Requirements

At least Redmine version `3.0` or higher required. Recommended version `5.0` or higher.

### Unsupported features by Redmine versions

| Feature                                                                           | Unsupported Redmine version |
| --------------------------------------------------------------------------------- | --------------------------- |
| Show only **enabled** issue field for selected tracker when _creating new issues_ | `< 5.0.0`                   |
| Show spent vs estimated hours                                                     | `< 5.0.0`                   |
| Select the **default fixed version** when _creating new issues_                   | `< 4.1.1`                   |
| Check permissions for admin users who are not members of a project                | `< 4.0.0`                   |
| Display project-available time entry activities when _adding spent time entries_  | `< 3.4.0`                   |
| Extended search                                                                   | `< 3.3.0`                   |

_Tested with Google Chrome Version 126_

# Supported languages

- English
- German
- Russian (thanks [@ASM-Development](https://github.com/ASM-Development))

> If you want to add more languages or extend existing ones, feel free to contribute. Just create a pull request with the desired changes. The language files are located under [src/lang](src/lang) and [public/\_locales](public/_locales).

# Screenshots

![issues](screenshots/en/dark/issues.png)
![issues-time](screenshots/en/dark/time.png)
![settings](screenshots/en/dark/settings.png)
![issues-search](screenshots/en/dark/issues-search.png)
![issues-add-spent-time](screenshots/en/dark/issues-add-spent-time.png)
![issues-context-menu](screenshots/en/dark/issues-context-menu.png)

# Credits

Logo is Copyright (C) 2009 Martin Herr and is licensed under Creative Commons (https://www.redmine.org/projects/redmine/wiki/logo)
