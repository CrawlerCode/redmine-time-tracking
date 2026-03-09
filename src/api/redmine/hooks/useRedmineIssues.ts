import { useSuspenseRedminePaginatedInfiniteQuery } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { redmineIssuesQuery } from "@/api/redmine/queries/issues";
import { useRedmineApi } from "@/provider/RedmineApiProvider";

export const useSuspenseRedmineIssues = (
  options: Parameters<typeof redmineIssuesQuery>[1],
  queryOptions?: Omit<ReturnType<typeof redmineIssuesQuery>, "queryKey" | "queryFn" | "enabled" | "throwOnError" | "placeholderData">
) => {
  const redmineApi = useRedmineApi();

  return useSuspenseRedminePaginatedInfiniteQuery({
    ...redmineIssuesQuery(redmineApi, options),
    ...queryOptions,
    autoFetchPages: true,
  });
};
