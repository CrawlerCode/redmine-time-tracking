import { useQueries } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { TVersion } from "../types/redmine";

type Options = {
  enabled?: boolean;
};

const useProjectVersions = (ids: number[], { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const versionsQuery = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["versions", id],
      queryFn: () => redmineApi.getProjectVersions(id),
      enabled: enabled && ids.length > 0,
    })),
  });

  const versions = versionsQuery.reduce((result: Record<number, TVersion[]>, query, i) => {
    if (!enabled) return {};

    result[ids[i]] = query.data ?? [];

    // Sort oldest version first. Versions without date, last
    result[ids[i]].sort(
      (a, b) =>
        (b.due_date ? 1 : 0) - (a.due_date ? 1 : 0) || new Date(a.due_date ?? 0).getTime() - new Date(b.due_date ?? 0).getTime() || (b.status === "open" ? 1 : 0) - (a.status === "open" ? 1 : 0)
    );

    return result;
  }, {});

  return {
    data: versions,
    isLoading: versionsQuery.some((q) => q.isLoading),
    isError: versionsQuery.some((q) => q.isError),
  };
};

export default useProjectVersions;
