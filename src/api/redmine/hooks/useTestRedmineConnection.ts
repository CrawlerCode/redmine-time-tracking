import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";

export const useTestRedmineConnection = () => {
  const defaultRedmineApi = useRedmineApi();
  const [customRedmineApiClient, setRedmineApiClient] = useState<RedmineApiClient | undefined>(undefined);
  const redmineApiClient = customRedmineApiClient ?? defaultRedmineApi;

  const myUserQuery = useQuery({
    queryKey: ["redmine", "testRedmineConnection", redmineApiClient],
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
    refresh: myUserQuery.refetch,
    redmineApiClient,
    setRedmineApiClient,
  };
};
