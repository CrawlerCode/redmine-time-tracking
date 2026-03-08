import { redmineProjectMembershipsQuery } from "@/api/redmine/queries/projectMemberships";
import { redmineRolesQuery } from "@/api/redmine/queries/roles";
import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";
import { TMembership, TReference } from "../types";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

type Options = {
  enabled?: boolean;
};

export type TProjectMember = TMembership["user"] & {
  roles: TMembership["roles"];
  highestRole?: TMembership["roles"][0];
};

export const useRedmineProjectMembers = (projectId: number, { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const membershipsQuery = useRedminePaginatedInfiniteQuery({
    ...redmineProjectMembershipsQuery(redmineApi, projectId),
    enabled: enabled,
    autoFetchPages: true,
  });

  const rolesQuery = useQuery({
    ...redmineRolesQuery(redmineApi),
    enabled: enabled,
  });

  const rolesSortMap = buildRolesSortMap(rolesQuery.data ?? []);

  const members: TProjectMember[] =
    membershipsQuery.data
      ?.filter((m) => m.user)
      .map((m) => ({
        ...m.user!,
        roles: m.roles,
        highestRole: getHighestRole(m.roles, rolesSortMap),
      })) ?? [];

  return {
    members,
    isPending: membershipsQuery.isPending || rolesQuery.isPending,
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
  return roles.reduce<TProjectMember["highestRole"]>((highestRole, role) => {
    if (!highestRole || (rolesSortMap.get(role.id) ?? 0) < (rolesSortMap.get(highestRole.id) ?? 0)) {
      highestRole = role;
    }
    return highestRole;
  }, undefined);
};
