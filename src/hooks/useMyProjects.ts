import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRedmineApi } from "../provider/RedmineApiProvider";

type Options = {
  enabled?: boolean;
};

const useMyProjects = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const projectsQuery = useInfiniteQuery({
    queryKey: ["projects"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => redmineApi.getAllMyProjects(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: enabled,
  });

  // auto fetch all pages
  useEffect(() => {
    if (projectsQuery.hasNextPage && !projectsQuery.isFetchingNextPage) projectsQuery.fetchNextPage();
  }, [projectsQuery]);

  const projects = projectsQuery.data?.pages?.flat() ?? [];

  return {
    data: projects,
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
  };
};

export default useMyProjects;
