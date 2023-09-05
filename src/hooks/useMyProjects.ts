import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyProjects } from "../api/redmine";

type Options = {
  enabled?: boolean;
};

const useMyProjects = ({ enabled = true }: Options = {}) => {
  const projectsQuery = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam = 0 }) => getAllMyProjects(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    staleTime: 1000 * 60 * 60,
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
