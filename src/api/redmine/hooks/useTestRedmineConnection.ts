import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";

export const useTestRedmineConnection = (customRedmineApiClient?: RedmineApiClient) => {
  const defaultRedmineApi = useRedmineApi();
  const redmineApiClient = customRedmineApiClient ?? defaultRedmineApi;

  const myUserQuery = useQuery({
    queryKey: ["redmine", "testRedmineConnection", redmineApiClient.id],
    queryFn: () => redmineApiClient.getCurrentUser(),
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    meta: {
      displayErrorToast: false,
    },
  });

  return {
    data: myUserQuery.data,
    isLoading: myUserQuery.isLoading,
    isError: myUserQuery.isError,
    error: myUserQuery.error,
  };
};
