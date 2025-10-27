import { useRedmineApi } from "@/provider/RedmineApiProvider";
import { TRole } from "@/types/redmine";
import { useQueries, UseQueryResult } from "@tanstack/react-query";

const useRoles = (roleIds: number[]) => {
  const redmineApi = useRedmineApi();

  return useQueries({
    queries: roleIds.map((id) => ({
      queryKey: ["role", id],
      queryFn: () => redmineApi.getRole(id),
    })),
    combine: combineRolesQueries,
  });
};

const combineRolesQueries = (results: UseQueryResult<TRole, Error>[]) => ({
  isLoading: results.some((r) => r.isLoading),
  isError: results.some((r) => r.isError),
  data: results.map((r) => r.data).filter((r) => r !== undefined),
});

export default useRoles;
