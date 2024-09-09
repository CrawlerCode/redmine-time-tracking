import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useIssue from "./useIssue";

type Options = {
  issueStaleTime?: number;
};

const useIssueStatuses = (issueId: number, { issueStaleTime }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issueQuery = useIssue(issueId, { staleTime: issueStaleTime });

  const hasIssueNoAllowedStatuses = !!issueQuery.data && issueQuery.data.allowed_statuses === undefined;

  const issueStatusesQuery = useQuery({
    queryKey: ["issueStatuses"],
    queryFn: () => redmineApi.getIssueStatuses(),
    enabled: hasIssueNoAllowedStatuses,
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
export default useIssueStatuses;
