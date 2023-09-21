import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getProjectMemberships } from "../api/redmine";

type Options = {
  enabled?: boolean;
};

const useProjectUsers = (id: number, { enabled = true }: Options = {}) => {
  const usersQuery = useInfiniteQuery({
    queryKey: ["memberships", id],
    queryFn: ({ pageParam = 0 }) => getProjectMemberships(id, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: enabled,
  });

  // auto fetch all pages
  useEffect(() => {
    if (usersQuery.hasNextPage && !usersQuery.isFetchingNextPage) usersQuery.fetchNextPage();
  }, [usersQuery]);

  // filter memberships => only users
  const users =
    usersQuery.data?.pages
      ?.flat()
      .filter((m) => m.user)
      .map((m) => m.user!) ?? [];

  return {
    data: users,
    isLoading: usersQuery.isInitialLoading,
    isError: usersQuery.isError,
  };
};

export default useProjectUsers;
