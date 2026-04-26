import { redmineProjectVersionsQuery } from "@/api/redmine/queries/projectVersions";
import { useSuspenseQueries, UseSuspenseQueryResult } from "@tanstack/react-query";
import { useDeferredValue } from "react";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";
import { TVersion } from "../types";

type Options = {
  enabled?: boolean;
};

/**
 * Hook to get multiple project versions with suspense
 */
export const useSuspenseRedmineMultipleProjectVersions = (projectIds: number[], { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const deferredProjectIds = useDeferredValue(projectIds);
  const versionsQueries = useSuspenseQueries({
    queries: (enabled ? deferredProjectIds : []).map((id) => redmineProjectVersionsQuery(redmineApi, id)),
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
