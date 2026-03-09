import { useRedminePaginatedInfiniteQuery, useSuspenseRedminePaginatedInfiniteQuery } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { redmineTimeEntriesQuery } from "@/api/redmine/queries/timeEntries";
import { useRedmineApi } from "@/provider/RedmineApiProvider";

export const useRedmineTimeEntries = (options: Parameters<typeof redmineTimeEntriesQuery>[1], queryOptions?: Omit<ReturnType<typeof redmineTimeEntriesQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useRedminePaginatedInfiniteQuery({
    ...redmineTimeEntriesQuery(redmineApi, options),
    ...queryOptions,
    autoFetchPages: true,
  });
};

export const useSuspenseRedmineTimeEntries = (
  options: Parameters<typeof redmineTimeEntriesQuery>[1],
  queryOptions?: Omit<ReturnType<typeof redmineTimeEntriesQuery>, "queryKey" | "queryFn" | "enabled" | "throwOnError" | "placeholderData">
) => {
  const redmineApi = useRedmineApi();

  return useSuspenseRedminePaginatedInfiniteQuery({
    ...redmineTimeEntriesQuery(redmineApi, options),
    ...queryOptions,
    autoFetchPages: true,
  });
};
