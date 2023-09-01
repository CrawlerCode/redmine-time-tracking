import { useQuery } from "@tanstack/react-query";
import { getMyAccount } from "../api/redmine";
import useSettings from "./useSettings";

const useMyAccount = () => {
  const { settings } = useSettings();

  const myAccountQuery = useQuery({
    queryKey: ["myAccount", settings.redmineURL, settings.redmineApiKey],
    queryFn: getMyAccount,
    staleTime: 1000 * 60 * 60,
  });

  return {
    data: myAccountQuery.data,
    isLoading: myAccountQuery.isInitialLoading,
    isError: myAccountQuery.isError,
  };
};

export default useMyAccount;
