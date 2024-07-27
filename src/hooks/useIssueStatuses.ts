import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

type Options = {
  enabled?: boolean;
};

const useIssueStatuses = ({ enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issueStatusesQuery = useQuery({
    queryKey: ["issueStatuses"],
    queryFn: () => redmineApi.getIssueStatuses(),
    enabled: enabled,
  });
  return {
    data: issueStatusesQuery.data,
    isLoading: issueStatusesQuery.isLoading,
    isError: issueStatusesQuery.isError,
  };
};
export default useIssueStatuses;
