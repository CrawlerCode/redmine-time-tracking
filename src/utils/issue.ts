import { GroupedIssues, IssuesData } from "../components/issues/IssuesList";
import { TIssue, TIssuesPriority } from "../types/redmine";

export const getSortedIssues = (issues: TIssue[], issuePriorities: TIssuesPriority[], issuesData: IssuesData) => {
  const issuePrioritiesIndices = issuePriorities.reduce((result: Record<number, number>, priority, index) => {
    result[priority.id] = index;
    return result;
  }, {});

  const sortedIssues = issues.sort(
    (a, b) =>
      (issuesData[b.id]?.pinned ? 1 : 0) - (issuesData[a.id]?.pinned ? 1 : 0) ||
      issuePrioritiesIndices[b.priority.id] - issuePrioritiesIndices[a.priority.id] ||
      new Date(a.updated_on).getTime() - new Date(a.updated_on).getTime()
  );

  return sortedIssues;
};

export const getGroupedIssues = (issues: TIssue[]) => {
  return Object.values(
    issues.reduce((result: Record<number, GroupedIssues>, issue) => {
      if (!(issue.project.id in result)) {
        result[issue.project.id] = {
          project: issue.project,
          issues: [],
          sort: Object.keys(result).length,
        };
      }
      result[issue.project.id].issues.push(issue);
      return result;
    }, {})
  ).sort((a, b) => a.sort - b.sort);
};
