import { useQuery } from "@tanstack/react-query";
import { TMembership, TReference } from "../api/redmine/types";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

type Options = {
  enabled?: boolean;
};

export type TUser = TMembership["user"] & {
  roles: TMembership["roles"];
  highestRole?: TMembership["roles"][0];
};

const useProjectUsers = (projectId: number, { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const membershipsQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["projectMemberships", projectId],
    queryFn: ({ pageParam }) => redmineApi.getProjectMemberships(projectId, pageParam),
    select: (data) => data?.pages.map((page) => page.memberships).flat(),
    enabled: enabled,
    autoFetchPages: true,
  });

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: () => redmineApi.getAllRoles(),
    enabled: enabled,
  });

  const rolesSortMap = buildRolesSortMap(rolesQuery.data ?? []);

  const users: TUser[] =
    membershipsQuery.data
      ?.filter((m) => m.user)
      .map((m) => ({
        ...m.user!,
        roles: m.roles,
        highestRole: getHighestRole(m.roles, rolesSortMap),
      })) ?? [];

  return {
    data: users,
    isLoading: membershipsQuery.isLoading || rolesQuery.isLoading,
    isError: membershipsQuery.isError || rolesQuery.isError,
  };
};

const buildRolesSortMap = (roles: TReference[]) => {
  const sortMap = new Map<number, number>();
  roles.forEach((role, index) => {
    sortMap.set(role.id, index);
  });
  return sortMap;
};

const getHighestRole = (roles: TReference[], rolesSortMap: Map<number, number>) => {
  return roles.reduce<TUser["highestRole"]>((highestRole, role) => {
    if (!highestRole || (rolesSortMap.get(role.id) ?? 0) < (rolesSortMap.get(highestRole.id) ?? 0)) {
      highestRole = role;
    }
    return highestRole;
  }, undefined);
};

export default useProjectUsers;
