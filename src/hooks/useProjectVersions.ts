import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions, useQuery, useSuspenseQueries, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { TVersion } from "../api/redmine/types";
import { useRedmineApi } from "../provider/RedmineApiProvider";

type Options = {
  enabled?: boolean;
};

/**
 * Query options for project versions
 */
const projectVersionsQueryOptions = (redmineApi: RedmineApiClient, projectId: number) =>
  queryOptions({
    queryKey: ["projectVersions", projectId],
    queryFn: () => redmineApi.getProjectVersions(projectId),
    select: (data) => sortVersions(data),
  });

/**
 * Hook to get project versions
 */
export const useProjectVersions = (projectId: number, { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const versionsQuery = useQuery({
    ...projectVersionsQueryOptions(redmineApi, projectId),
    enabled,
  });

  return {
    isLoading: versionsQuery.isLoading,
    projectVersions: versionsQuery.data ?? [],
  };
};

/**
 * Hook to get multiple project versions with suspense
 */
export const useSuspenseMultipleProjectVersions = (projectIds: number[], { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const deferredProjectIds = useDeferredValue(projectIds);
  const versionsQueries = useSuspenseQueries({
    queries: (enabled ? deferredProjectIds : []).map((id) => projectVersionsQueryOptions(redmineApi, id)),
    combine: combineSuspenseMultipleVersions,
  });

  return {
    projectVersionsMap: versionsQueries.data,
  };
};

const combineSuspenseMultipleVersions = (results: UseSuspenseQueryResult<TVersion[], Error>[]) => ({
  data: results.reduce<Record<string, TVersion[]>>((result, query) => {
    if (query.data && query.data[0]) {
      result[query.data[0].project.id] = query.data;
    }
    return result;
  }, {}),
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
