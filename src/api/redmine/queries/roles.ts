import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query all redmine roles
 */
export const redmineRolesQuery = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["redmine", "roles"],
    queryFn: () => redmineApi.getRoles(),
  });

/**
 * Query single redmine role
 */
export const redmineRoleQuery = (redmineApi: RedmineApiClient, roleId: number) =>
  queryOptions({
    queryKey: ["redmine", "roles", roleId],
    queryFn: () => redmineApi.getRole(roleId),
  });
