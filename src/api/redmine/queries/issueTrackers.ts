import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query redmine issue trackers
 */
export const redmineIssueTrackersQuery = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["redmine", "issueTrackers"],
    queryFn: () => redmineApi.getIssueTrackers(),
  });
