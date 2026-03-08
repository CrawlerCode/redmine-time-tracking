/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ["main", { name: "beta", prerelease: true }, { name: "alpha", prerelease: true }, { name: "canary", prerelease: true }],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "chore", scope: "release", hidden: true },
            { type: "feat", section: "🚀 Features" },
            { type: "fix", section: "🩹 Fixes" },
            { type: "perf", section: "🔥 Performance" },
            { type: "chore", section: "🏡 Chore" },
            { type: "refactor", section: "🛠️ Refactors" },
            { type: "docs", section: "📖 Documentation" },
            { type: "test", section: "🧪 Tests" },
            { type: "build", section: "📦 Builds" },
            { type: "ci", section: "⚡CI" },
          ],
        },
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/git",
    [
      "@semantic-release/github",
      {
        releaseBodyTemplate: `
<% if (nextRelease.channel) { %>
[![Install-Button-Chrome]][Install-Link-Chrome]

[Install-Button-Chrome]: https://img.shields.io/badge/INSTALL-PRE--RELEASE-71b500?style=for-the-badge&logoColor=white&logo=google-chrome
[Install-Link-Chrome]: https://chromewebstore.google.com/detail/redmine-time-tracking/adgcdimdkkaddeopcabokepmaihfhklb "Open in chrome web store"
<% } else { %>
[![Install-Button-Chrome]][Install-Link-Chrome]
[![Install-Button-Firefox]][Install-Link-Firefox]

[Install-Button-Chrome]: https://img.shields.io/badge/Install-Chrome-71b500?style=for-the-badge&logoColor=white&logo=google-chrome
[Install-Link-Chrome]: https://chrome.google.com/webstore/detail/redmine-time-tracking/ldcanhhkffokndenejhafhlkapflgcjg "Open in chrome web store"
[Install-Button-Firefox]: https://img.shields.io/badge/Install-Firefox-71b500?style=for-the-badge&logoColor=white&logo=firefox-browser
[Install-Link-Firefox]: https://addons.mozilla.org/de/firefox/addon/redmine-time-tracking "Open in firefox add-on store"
<% } %>

<%= nextRelease.notes %>
`,
      },
    ],
  ],
};
