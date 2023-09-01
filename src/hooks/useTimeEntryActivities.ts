import { useQuery } from "@tanstack/react-query";
import { getTimeEntryActivities } from "../api/redmine";

const useTimeEntryActivities = () => {
  const timeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: getTimeEntryActivities,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60,
  });
  return timeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false) ?? [];
};
export default useTimeEntryActivities;
