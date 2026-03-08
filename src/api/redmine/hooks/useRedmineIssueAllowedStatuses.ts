import { redmineIssueQuery } from "@/api/redmine/queries/issues";
import { redmineIssueStatusesQuery } from "@/api/redmine/queries/issueStatuses";
import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";

/**
 * Hook to get the allowed statuses for a redmine issue
 */
export const useRedmineIssueAllowedStatuses = (issueId: number, queryOptions?: Omit<ReturnType<typeof redmineIssueQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  const issueQuery = useQuery({
    ...redmineIssueQuery(redmineApi, issueId),
    ...queryOptions,
  });

  const hasIssueNoAllowedStatuses = !!issueQuery.data && issueQuery.data.allowed_statuses === undefined;

  const issueStatusesQuery = useQuery({
    ...redmineIssueStatusesQuery(redmineApi),
    enabled: (queryOptions?.enabled ?? true) && hasIssueNoAllowedStatuses,
  });

  const statuses = hasIssueNoAllowedStatuses
    ? issueStatusesQuery.data // If the issue has no allowed statuses, we use all statuses
    : issueQuery.data?.allowed_statuses?.length === 0 // If the issue has empty allowed statuses, we use the current status (status change is not allowed)
      ? [issueQuery.data.status]
      : // If the issue has allowed statuses, we use them
        issueQuery.data?.allowed_statuses;

  return {
    statuses,
    hasIssueNoAllowedStatuses,
  };
};
