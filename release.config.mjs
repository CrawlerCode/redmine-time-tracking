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
    "@semantic-release/github",
  ],
};
