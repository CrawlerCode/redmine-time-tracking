import { redmineProjectQuery } from "@/api/redmine/queries/projects";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";

export const useRedmineProject = (projectId: number, queryOptions?: Omit<ReturnType<typeof redmineProjectQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useQuery({
    ...redmineProjectQuery(redmineApi, projectId),
    ...queryOptions,
  });
};
