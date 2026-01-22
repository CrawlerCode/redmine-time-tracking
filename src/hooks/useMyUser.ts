import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

const useMyUser = () => {
  const redmineApi = useRedmineApi();

  const myUserQuery = useQuery({
    queryKey: ["myUser"],
    queryFn: () => redmineApi.getMyUser(),
  });

  return {
    data: myUserQuery.data,
    isLoading: myUserQuery.isLoading,
    isError: myUserQuery.isError,
    error: myUserQuery.error,
  };
};

export default useMyUser;
