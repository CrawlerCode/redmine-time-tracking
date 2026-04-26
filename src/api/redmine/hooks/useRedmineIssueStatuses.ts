import { redmineIssueStatusesQuery } from "@/api/redmine/queries/issueStatuses";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";

export const useRedmineIssueStatuses = (queryOptions?: Omit<ReturnType<typeof redmineIssueStatusesQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useQuery({
    ...redmineIssueStatusesQuery(redmineApi),
    ...queryOptions,
  });
};
