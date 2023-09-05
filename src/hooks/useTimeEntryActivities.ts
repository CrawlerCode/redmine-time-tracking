import { useQuery } from "@tanstack/react-query";
import { getTimeEntryActivities } from "../api/redmine";

const useTimeEntryActivities = () => {
  const timeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: getTimeEntryActivities,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });

  const activities = timeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false) ?? [];

  return {
    data: activities,
    isLoading: timeEntryActivitiesQuery.isInitialLoading,
    isError: timeEntryActivitiesQuery.isError,
  };
};
export default useTimeEntryActivities;
