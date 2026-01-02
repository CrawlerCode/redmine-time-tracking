import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useIssue from "./useIssue";

const statusesQueryOptions = (redmineApi: RedmineApiClient) =>
  queryOptions({
    queryKey: ["issueStatuses"],
    queryFn: () => redmineApi.getIssueStatuses(),
  });

export const useStatuses = ({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) => {
  const redmineApi = useRedmineApi();

  const issueStatusesQuery = useQuery({
    ...statusesQueryOptions(redmineApi),
    enabled,
  });

  return {
    data: issueStatusesQuery.data,
    isLoading: issueStatusesQuery.isLoading,
    isError: issueStatusesQuery.isError,
  };
};

type Options = {
  enabled?: boolean;
  issueStaleTime?: number;
};

export const useIssueStatuses = (issueId: number, { enabled = true, issueStaleTime }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issueQuery = useIssue(issueId, { enabled, staleTime: issueStaleTime });

  const hasIssueNoAllowedStatuses = !!issueQuery.data && issueQuery.data.allowed_statuses === undefined;

  const issueStatusesQuery = useQuery({
    ...statusesQueryOptions(redmineApi),
    enabled: enabled && hasIssueNoAllowedStatuses,
  });

  const statuses = hasIssueNoAllowedStatuses
    ? issueStatusesQuery.data // If the issue has no allowed statuses, we use all statuses
    : issueQuery.data?.allowed_statuses?.length === 0 // If the issue has empty allowed statuses, we use the current status (status change is not allowed)
      ? [issueQuery.data.status]
      : // If the issue has allowed statuses, we use them
        issueQuery.data?.allowed_statuses;

  return {
    data: statuses,
    isLoading: issueQuery.isLoading || issueStatusesQuery.isLoading,
    isError: issueQuery.isError || issueStatusesQuery.isError,
    hasIssueNoAllowedStatuses,
  };
};
