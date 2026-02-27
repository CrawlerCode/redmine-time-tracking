import useMyProjects from "@/hooks/useMyProjects";
import useMyUser from "@/hooks/useMyUser";
import useRoles from "@/hooks/useRoles";
import { ReactNode, createContext, use } from "react";
import { TProject, TRole, TUser } from "../api/redmine/types";

type PermissionContextType = {
  hasProjectPermission: (projectId: number, permission: TRole["permissions"][number]) => boolean;
};

const PermissionContext = createContext<PermissionContextType | null>(null);

const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const myUser = useMyUser();

  const roles = useRoles([
    ...new Set((myUser.data?.memberships ?? []).flatMap((m) => m.roles).map((r) => r.id)),
    1, // Non member (system role)
  ]);

  const projects = useMyProjects();

  const projectRolesMap = buildProjectRolesMap({ user: myUser.data, roles: roles.data, projects: projects.data });

  const hasProjectPermission = (projectId: number, permission: TRole["permissions"][number]): boolean =>
    myUser.data?.admin || projectRolesMap.get(projectId)?.some((r) => r.permissions.includes(permission)) || false;

  return (
    <PermissionContext
      value={{
        hasProjectPermission,
      }}
    >
      {children}
    </PermissionContext>
  );
};

const buildProjectRolesMap = ({ user, roles, projects }: { user?: TUser; roles: TRole[]; projects: TProject[] }): Map<number, TRole[]> => {
  const result = new Map<number, TRole[]>();

  // For each project the user is a member of, find the corresponding roles and store them in a map
  for (const membership of user?.memberships ?? []) {
    result.set(
      membership.project.id,
      roles.filter((r) => membership.roles.some((role) => role.id === r.id))
    );
  }

  // For public projects the user is not a member of, add the non member role if it exists
  const nonMemberRole = roles.find((r) => r.id === 1);
  if (nonMemberRole) {
    for (const project of projects) {
      if (project.is_public && !result.has(project.id)) {
        result.set(project.id, [nonMemberRole]);
      }
    }
  }

  return result;
};

export const usePermissions = () => {
  const context = use(PermissionContext);
  if (!context) throw new Error("usePermissions must be used within a PermissionProvider");

  return context;
};

export default PermissionProvider;
