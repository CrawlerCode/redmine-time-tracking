import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

type Options = {
  enabled?: boolean;
};

const useIssue = (id: number, { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issueQuery = useQuery({
    queryKey: ["issue", id],
    queryFn: () => redmineApi.getIssue(id),
    enabled: enabled,
  });

  return {
    data: issueQuery.data,
    isLoading: issueQuery.isLoading,
    isError: issueQuery.isError,
  };
};

export default useIssue;
