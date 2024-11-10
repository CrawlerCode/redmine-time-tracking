import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

type Options = {
  enabled?: boolean;
};

const useMyProjects = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const projectsQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam }) => redmineApi.getAllMyProjects(pageParam),
    select: (data) => data?.pages.map((page) => page.projects).flat(),
    enabled: enabled,
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
