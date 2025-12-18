import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { redminePaginatedInfiniteQueryOptions, useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

type Options = {
  enabled?: boolean;
};

const myProjectsQueryOptions = (redmineApi: RedmineApiClient) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["projects"],
    queryFn: ({ pageParam }) => redmineApi.getAllMyProjects(pageParam),
    select: (data) => data?.pages.map((page) => page.projects).flat(),
  });

const useMyProjects = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const projectsQuery = useRedminePaginatedInfiniteQuery({
    ...myProjectsQueryOptions(redmineApi),
    enabled,
    autoFetchPages: true,
  });

  const projects = projectsQuery.data ?? [];

  return {
    data: projects,
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
  };
};

export default useMyProjects;
