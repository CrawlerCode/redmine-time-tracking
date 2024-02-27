import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

const useTimeEntryActivities = () => {
  const redmineApi = useRedmineApi();

  const timeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: () => redmineApi.getTimeEntryActivities(),
  });

  const activities = timeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false) ?? [];

  return {
    data: activities,
    isLoading: timeEntryActivitiesQuery.isLoading,
    isError: timeEntryActivitiesQuery.isError,
  };
};
export default useTimeEntryActivities;
