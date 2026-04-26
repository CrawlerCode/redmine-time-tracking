import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query redmine issue statuses
 */
export const redmineIssueStatusesQuery = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["redmine", "issueStatuses"],
    queryFn: () => redmineApi.getIssueStatuses(),
  });
