import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query redmine issue priorities
 */
export const redmineIssuePrioritiesQuery = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["redmine", "issuePriorities"],
    queryFn: () => redmineApi.getIssuePriorities(),
    select: (data) => data.filter((priority) => priority.active !== false),
  });
