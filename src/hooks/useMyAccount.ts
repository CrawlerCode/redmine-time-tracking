import { useQuery } from "@tanstack/react-query";
import { getMyAccount } from "../api/redmine";

const useMyAccount = () => {
  const myAccountQuery = useQuery({
    queryKey: ["myAccount"],
    queryFn: getMyAccount,
  });

  return {
    data: myAccountQuery.data,
    isLoading: myAccountQuery.isInitialLoading,
    isError: myAccountQuery.isError,
  };
};

export default useMyAccount;
