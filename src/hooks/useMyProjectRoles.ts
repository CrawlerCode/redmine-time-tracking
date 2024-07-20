import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { TProject, TReference, TRole } from "../types/redmine";
import useMyUser from "./useMyUser";

const useMyProjectRoles = (projectIds: number[]) => {
  const redmineApi = useRedmineApi();

  const myUser = useMyUser();

  const projectMembershipRoles = useMemo(
    () =>
      myUser.data?.memberships
        ?.filter((m) => projectIds.includes(m.project.id))
        .reduce(
          (acc, m) => {
            acc[m.project.id] = m.roles;
            return acc;
          },
          {} as Record<number, TReference[]>
        ) ?? {},
    [myUser.data, projectIds]
  );

  const myRolesIds = [
    1, // Non member (system role)
    ...new Set(
      Object.values(projectMembershipRoles)
        .flat()
        .map((r) => r.id)
    ),
  ];
  const rolesQueries = useQueries({
    queries: myRolesIds.map((id) => ({
      queryKey: ["role", id],
      queryFn: () => redmineApi.getRole(id),
    })),
    combine: (results) => ({
      isLoading: results.some((r) => r.isLoading),
      isError: results.some((r) => r.isError),
      data: results.map((r) => r.data).filter((r) => r !== undefined),
    }),
  });

  const projectRoles = useMemo(
    () =>
      Object.entries(projectMembershipRoles).reduce(
        (acc, [projectId, roles]) => {
          acc[projectId as unknown as number] = rolesQueries.data.filter((r) => roles.some((role) => role.id === r.id));
          return acc;
        },
        {} as Record<number, TRole[]>
      ),
    [projectMembershipRoles, rolesQueries.data]
  );
  const nonMemberRole = rolesQueries.data.find((r) => r.id === 1);

  return {
    data: projectRoles,
    isLoading: myUser.isLoading || rolesQueries.isLoading,
    isError: myUser.isError || rolesQueries.isError,
    hasProjectPermission: (project: TProject | TReference, permission: TRole["permissions"][number]) =>
      // First check if user is admin, then check if user has the permission in the project roles or if the project is public and the non member role has the permission
      myUser.data?.admin || (projectRoles[project.id] ?? ("is_public" in project && project.is_public && nonMemberRole ? [nonMemberRole] : undefined))?.some((r) => r.permissions.includes(permission)),
  };
};

export default useMyProjectRoles;
