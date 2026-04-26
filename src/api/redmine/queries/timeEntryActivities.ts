import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query redmine time entry activities
 */
export const redmineTimeEntryActivitiesQuery = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["redmine", "timeEntryActivities"],
    queryFn: () => redmineApi.getTimeEntryActivities(),
  });
