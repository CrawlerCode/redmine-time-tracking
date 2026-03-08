import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { TVersion } from "@/api/redmine/types";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query redmine project versions
 */
export const redmineProjectVersionsQuery = (redmineApi: RedmineApiClient, projectId: number) =>
  queryOptions({
    queryKey: ["redmine", "projectVersions", projectId],
    queryFn: () => redmineApi.getProjectVersions(projectId),
    select: (data) => sortVersions(data),
  });

/**
 * Sort project versions
 */
const sortVersions = (versions: TVersion[]) => {
  return versions.sort(
    // Sort oldest version first. Versions without date, last
    (a, b) => (b.due_date ? 1 : 0) - (a.due_date ? 1 : 0) || new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime() || (b.status === "open" ? 1 : 0) - (a.status === "open" ? 1 : 0)
  );
};
