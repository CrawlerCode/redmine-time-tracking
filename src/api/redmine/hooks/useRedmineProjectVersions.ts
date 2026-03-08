import { redmineProjectVersionsQuery } from "@/api/redmine/queries/projectVersions";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";

export const useRedmineProjectVersions = (projectId: number, queryOptions?: Omit<ReturnType<typeof redmineProjectVersionsQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useQuery({
    ...redmineProjectVersionsQuery(redmineApi, projectId),
    ...queryOptions,
  });
};
