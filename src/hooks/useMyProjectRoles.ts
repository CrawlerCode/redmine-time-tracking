import { useMemo } from "react";
import { TProject, TReference, TRole } from "../types/redmine";
import useMyUser from "./useMyUser";
import useRoles from "./useRoles";

const useMyProjectRoles = (projectIds: number[], projects?: TProject[]) => {
  const myUser = useMyUser();

  const projectMembershipRoles = useMemo(
    () =>
      myUser.data?.memberships
        ?.filter((m) => projectIds.includes(m.project.id))
        .reduce<Record<string, TReference[]>>((acc, m) => {
          acc[m.project.id] = m.roles;
          return acc;
        }, {}) ?? {},
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
  const rolesQueries = useRoles(myRolesIds);

  const myProjectRoles = useMemo(
    () =>
      Object.entries(projectMembershipRoles).reduce<Record<string, TRole[]>>((acc, [projectId, myRoles]) => {
        acc[projectId] = rolesQueries.data.filter((r) => myRoles.some((role) => role.id === r.id));
        return acc;
      }, {}),
    [projectMembershipRoles, rolesQueries.data]
  );
  const nonMemberRole = rolesQueries.data.find((r) => r.id === 1);

  return {
    data: myProjectRoles,
    isLoading: myUser.isLoading || rolesQueries.isLoading,
    isError: myUser.isError || rolesQueries.isError,
    hasProjectPermission: (projectId: number, permission: TRole["permissions"][number]) =>
      // First check if user is admin, then check if user has the permission in the project roles or if the project is public and the non member role has the permission
      myUser.data?.admin ||
      (myProjectRoles[projectId] ?? (projects?.find((p) => p.id === projectId)?.is_public && nonMemberRole ? [nonMemberRole] : undefined))?.some((r) => r.permissions.includes(permission)),
  };
};

export default useMyProjectRoles;
