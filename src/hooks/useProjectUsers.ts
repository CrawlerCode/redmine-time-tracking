import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { TMembership } from "../types/redmine";

type Options = {
  enabled?: boolean;
};

export type TUser = TMembership["user"] & {
  roles: TMembership["roles"];
  highestRole?: TMembership["roles"][0];
};

const useProjectUsers = (projectId: number, { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const membershipsQuery = useInfiniteQuery({
    queryKey: ["projectMemberships", projectId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => redmineApi.getProjectMemberships(projectId, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: enabled,
  });

  // auto fetch all pages
  useEffect(() => {
    if (membershipsQuery.hasNextPage && !membershipsQuery.isFetchingNextPage) membershipsQuery.fetchNextPage();
  }, [membershipsQuery]);

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => redmineApi.getAllRoles(),
    enabled: enabled,
  });

  // filter memberships => only users
  const users: TUser[] = useMemo(() => {
    const rolesIdx =
      rolesQuery.data?.reduce((result: Record<number, number>, role, i) => {
        result[role.id] = i;
        return result;
      }, {}) ?? {};

    return (
      membershipsQuery.data?.pages
        ?.flat()
        .filter((m) => m.user)
        .map(
          (m) =>
            ({
              ...m.user!,
              roles: m.roles,
              highestRole: m.roles.reduce((result: TMembership["roles"][0] | undefined, role) => {
                if (!result || rolesIdx[role.id] < rolesIdx[result.id]) {
                  result = role;
                }
                return result;
              }, undefined),
            }) satisfies TUser
        ) ?? []
    );
  }, [membershipsQuery.data, rolesQuery.data]);

  return {
    data: users,
    isLoading: membershipsQuery.isLoading || rolesQuery.isLoading,
    isError: membershipsQuery.isError || rolesQuery.isError,
  };
};

export default useProjectUsers;
