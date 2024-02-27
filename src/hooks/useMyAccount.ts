import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useSettings from "./useSettings";

const useMyAccount = () => {
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();

  const myAccountQuery = useQuery({
    queryKey: ["myAccount", settings.redmineURL, settings.redmineApiKey],
    queryFn: () => redmineApi.getMyAccount(),
    retryOnMount: false,
  });

  return {
    data: myAccountQuery.data,
    isLoading: myAccountQuery.isLoading,
    isError: myAccountQuery.isError,
  };
};

export default useMyAccount;
