import { useQuery } from "@tanstack/react-query";
import { getTimeEntryActivities } from "../api/redmine";

const useTimeEntryActivities = () => {
  const timeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: getTimeEntryActivities,
  });

  const activities = timeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false) ?? [];

  return {
    data: activities,
    isLoading: timeEntryActivitiesQuery.isLoading,
    isError: timeEntryActivitiesQuery.isError,
  };
};
export default useTimeEntryActivities;
