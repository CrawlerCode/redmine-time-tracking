import { useQueries } from "@tanstack/react-query";
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
  });

  const versions = versionsQueries.reduce((result: Record<number, TVersion[]>, query, i) => {
    if (!enabled) return {};

    result[projectIds[i]] = query.data ?? [];

    // Sort oldest version first. Versions without date, last
    result[projectIds[i]].sort(
      (a, b) =>
        (b.due_date ? 1 : 0) - (a.due_date ? 1 : 0) || new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime() || (b.status === "open" ? 1 : 0) - (a.status === "open" ? 1 : 0)
    );

    return result;
  }, {});

  return {
    data: versions,
    isLoading: versionsQueries.some((q) => q.isLoading),
    isError: versionsQueries.some((q) => q.isError),
  };
};

export default useProjectVersions;
