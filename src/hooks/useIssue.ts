import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

const STALE_DATA_TIME = 1000 * 60;

type Options = {
  enabled?: boolean;
  staleTime?: number;
};

const useIssue = (id: number, { enabled = true, staleTime = STALE_DATA_TIME }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issueQuery = useQuery({
    queryKey: ["issues", id],
    queryFn: () => redmineApi.getIssue(id),
    enabled: enabled,
    staleTime: staleTime,
  });

  return {
    data: issueQuery.data,
    isLoading: issueQuery.isLoading,
    isError: issueQuery.isError,
  };
};

export default useIssue;
