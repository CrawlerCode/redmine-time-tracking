import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useSettings from "./useSettings";

type Options = {
  staleTime?: number;
};

const useMyUser = ({ staleTime }: Options = {}) => {
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();

  const myUserQuery = useQuery({
    queryKey: ["myUser", settings.redmineURL, settings.redmineApiKey],
    queryFn: () => redmineApi.getMyUser(),
    retry: 1,
    ...(staleTime && { staleTime }),
  });

  return {
    data: myUserQuery.data,
    isLoading: myUserQuery.isLoading,
    isError: myUserQuery.isError,
    error: myUserQuery.error,
  };
};

export default useMyUser;
