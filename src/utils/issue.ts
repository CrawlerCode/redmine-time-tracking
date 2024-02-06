import { IssuesData } from "../components/issues/IssuesList";
import { TIssue, TIssuesPriority, TReference, TVersion } from "../types/redmine";

type GroupedIssues = Record<
  number,
  {
    project: TReference;
    versions: Record<
      number,
      {
        version: TVersion;
        issues: TIssue[]; // Issues of this version
        sort: number;
      }
    >;
    issues: TIssue[]; // Issues without version
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

export const getGroupedIssues = (issues: TIssue[], projectVersions: Record<number, TVersion[]>) => {
  const grouped = issues.reduce((result: GroupedIssues, issue) => {
    if (!(issue.project.id in result)) {
      result[issue.project.id] = {
        project: issue.project,
        versions: {},
        issues: [],
        sort: Object.keys(result).length,
      };
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
    .map((groupedByProject) => ({
      ...groupedByProject,
      versions: Object.values(groupedByProject.versions).sort((a, b) => a.sort - b.sort),
    }))
    .sort((a, b) => a.sort - b.sort);
};
