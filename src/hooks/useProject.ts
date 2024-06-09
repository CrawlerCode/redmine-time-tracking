import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

type Options = {
  enabled?: boolean;
};

const useProject = (id: number, { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => redmineApi.getProject(id),
    enabled: enabled,
  });

  return {
    data: projectQuery.data,
    isLoading: projectQuery.isLoading,
    isError: projectQuery.isError,
  };
};

export default useProject;
