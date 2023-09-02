import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyProjects } from "../api/redmine";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 5;
const STALE_DATA_TIME = 1000 * 60;

const useMyProjects = (enabled = true) => {
  const projectsQuery = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam = 0 }) => getAllMyProjects(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
    enabled: enabled,
  });

  // auto fetch all pages
  useEffect(() => {
    if (projectsQuery.hasNextPage && !projectsQuery.isFetchingNextPage) projectsQuery.fetchNextPage();
  }, [projectsQuery]);

  const projects = projectsQuery.data?.pages?.flat() ?? [];

  return {
    data: projects,
    isLoading: projectsQuery.isInitialLoading,
    isError: projectsQuery.isError,
  };
};

export default useMyProjects;
