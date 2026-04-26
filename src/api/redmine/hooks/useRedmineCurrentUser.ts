import { redmineCurrentUserQuery } from "@/api/redmine/queries/currentUser";
import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { useQuery } from "@tanstack/react-query";

export const useRedmineCurrentUser = (queryOptions?: Omit<ReturnType<typeof redmineCurrentUserQuery>, "queryKey" | "queryFn">) => {
  const redmineApi = useRedmineApi();

  return useQuery({
    ...redmineCurrentUserQuery(redmineApi),
    ...queryOptions,
  });
};
