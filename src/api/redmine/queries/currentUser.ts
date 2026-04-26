import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query current redmine user
 */
export const redmineCurrentUserQuery = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["redmine", "currentUser"],
    queryFn: () => redmineApi.getCurrentUser(),
  });
