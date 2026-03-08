import { useRedminePaginatedInfiniteQuery } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { redmineProjectsQuery } from "@/api/redmine/queries/projects";
import { useRedmineApi } from "@/provider/RedmineApiProvider";

export const useRedmineProjects = (queryOptions?: Omit<ReturnType<typeof redmineProjectsQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useRedminePaginatedInfiniteQuery({
    ...redmineProjectsQuery(redmineApi),
    ...queryOptions,
    autoFetchPages: true,
  });
};
