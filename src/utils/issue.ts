import { IssuesData } from "../components/issues/IssuesList";
import { Settings } from "../provider/SettingsProvider";
import { TIssue, TIssuesPriority, TReference, TVersion } from "../types/redmine";

type GroupType = "active" | "paused" | "pinned" | "version" | "no-version";

type IssueGroup = {
  type: GroupType;
  version?: TVersion;
  issues: TIssue[];
};

type GroupedIssues = {
  project: TReference;
  versions: TVersion[];
  groups: {
    type: GroupType;
    version?: TVersion;
    issues: TIssue[];
  }[];
}[];

type GroupedIssuesHelper = Record<
  number,
  {
    // The project reference
    project: TReference;
    // Pinned issues
    activeIssues: TIssue[];
    // Pinned issues
    pausedIssues: TIssue[];
    // Pinned issues
    pinnedIssues: TIssue[];
    // All versions of project
    versions: Record<
      number,
      {
        // The version reference
        version: TVersion;
        // Issues of this version
        issues: TIssue[];
        // Index for sorting
        sort: number;
      }
    >;
    // Issues without version
    issues: TIssue[];
    // Index for sorting
    sort: number;
  }
>;

export const getSortedIssues = (issues: TIssue[], issuePriorities: TIssuesPriority[], issuesData: IssuesData) => {
  const issuePrioritiesIndices = issuePriorities.reduce((result: Record<number, number>, priority, index) => {
    result[priority.id] = index;
    return result;
  }, {});

  const sortedIssues = issues.sort(
    (a, b) =>
      (issuesData[b.id]?.pinned ? 1 : 0) - (issuesData[a.id]?.pinned ? 1 : 0) ||
      issuePrioritiesIndices[b.priority.id] - issuePrioritiesIndices[a.priority.id] ||
      (b.due_date ? 1 : 0) - (a.due_date ? 1 : 0) ||
      new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime() ||
      new Date(b.updated_on).getTime() - new Date(a.updated_on).getTime()
  );

  return sortedIssues;
};

/**
 * Group issues
 * - group issues by project
 * - group pinned issues
 * - group issues by version
 */
export const getGroupedIssues = (issues: TIssue[], projectVersions: Record<number, TVersion[]>, issuesData: IssuesData, settings: Settings): GroupedIssues => {
  const grouped = issues.reduce((result: GroupedIssuesHelper, issue) => {
    if (!(issue.project.id in result)) {
      result[issue.project.id] = {
        project: issue.project,
        pinnedIssues: [],
        activeIssues: [],
        pausedIssues: [],
        versions: {},
        issues: [],
        sort: Object.keys(result).length,
      };
    }

    if (settings.style.pinTrackedIssues) {
      if (issuesData[issue.id]?.active) {
        result[issue.project.id].activeIssues.push(issue);
        return result;
      }

      if (issuesData[issue.id]?.time) {
        result[issue.project.id].pausedIssues.push(issue);
        return result;
      }
    }

    if (issuesData[issue.id]?.pinned) {
      result[issue.project.id].pinnedIssues.push(issue);
      return result;
    }

    if (issue.fixed_version && projectVersions[issue.project.id]) {
      if (!(issue.fixed_version.id in result[issue.project.id].versions)) {
        const version = projectVersions[issue.project.id].find((v) => v.id === issue.fixed_version?.id);

        if (!version) {
          // This should never be happened
          result[issue.project.id].issues.push(issue);
          return result;
        }

        result[issue.project.id].versions[issue.fixed_version.id] = {
          version: version,
          issues: [],
          sort: projectVersions[issue.project.id].indexOf(version),
        };
      }

      result[issue.project.id].versions[issue.fixed_version.id].issues.push(issue);
    } else {
      result[issue.project.id].issues.push(issue);
    }

    return result;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => a.sort - b.sort)
    .map(({ project, activeIssues, pausedIssues, pinnedIssues, versions, issues }) => ({
      project: project,
      versions: projectVersions[project.id] ?? [],
      groups: [
        ...(activeIssues.length > 0
          ? [
              {
                type: "active",
                issues: activeIssues,
              } satisfies IssueGroup,
            ]
          : []),
        ...(pausedIssues.length > 0
          ? [
              {
                type: "paused",
                issues: pausedIssues,
              } satisfies IssueGroup,
            ]
          : []),
        ...(pinnedIssues.length > 0
          ? [
              {
                type: "pinned",
                issues: pinnedIssues,
              } satisfies IssueGroup,
            ]
          : []),
        ...Object.values(versions)
          .sort((a, b) => a.sort - b.sort)
          .map(
            (version) =>
              ({
                type: "version",
                version: version.version,
                issues: version.issues,
              }) satisfies IssueGroup
          ),
        ...(issues.length > 0
          ? [
              {
                type: "no-version",
                issues: issues,
              } satisfies IssueGroup,
            ]
          : []),
      ],
    }));
};
