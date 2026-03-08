import { redmineIssueQuery } from "@/api/redmine/queries/issues";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";

export const useRedmineIssue = (issueId: number, queryOptions?: Omit<ReturnType<typeof redmineIssueQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useQuery({
    ...redmineIssueQuery(redmineApi, issueId),
    ...queryOptions,
  });
};
