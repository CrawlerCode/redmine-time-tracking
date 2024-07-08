import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useSettings from "./useSettings";

type Options = {
  staleTime?: number;
};

const useMyAccount = ({ staleTime }: Options = {}) => {
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();

  const myAccountQuery = useQuery({
    queryKey: ["myAccount", settings.redmineURL, settings.redmineApiKey],
    queryFn: () => redmineApi.getMyAccount(),
    retry: 1,
    ...(staleTime && { staleTime }),
  });

  return {
    data: myAccountQuery.data,
    isLoading: myAccountQuery.isLoading,
    isError: myAccountQuery.isError,
  };
};

export default useMyAccount;
