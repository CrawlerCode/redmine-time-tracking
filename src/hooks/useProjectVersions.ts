import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { TVersion } from "../types/redmine";

type Options = {
  enabled?: boolean;
};

const useProjectVersions = (projectIds: number[], { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const versionsQueries = useQueries({
    queries: projectIds.map((id) => ({
      queryKey: ["projectVersions", id],
      queryFn: () => redmineApi.getProjectVersions(id),
      enabled: enabled,
    })),
    combine: combineVersionsQueries,
  });

  return {
    data: versionsQueries.data,
    isLoading: versionsQueries.isLoading,
    isError: versionsQueries.isError,
  };
};

const combineVersionsQueries = (results: UseQueryResult<TVersion[], Error>[]) => ({
  isLoading: results.some((r) => r.isLoading),
  isError: results.some((r) => r.isError),
  data: results.reduce<Record<string, TVersion[]>>((result, query) => {
    if (query.data) {
      result[query.data[0].project.id] = query.data.sort(
        // Sort oldest version first. Versions without date, last
        (a, b) =>
          (b.due_date ? 1 : 0) - (a.due_date ? 1 : 0) || new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime() || (b.status === "open" ? 1 : 0) - (a.status === "open" ? 1 : 0)
      );
    }
    return result;
  }, {}),
});

export default useProjectVersions;
