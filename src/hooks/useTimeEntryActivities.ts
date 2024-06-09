import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useProject from "./useProject";

const useTimeEntryActivities = (projectId: number) => {
  const redmineApi = useRedmineApi();

  const timeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: () => redmineApi.getTimeEntryActivities(),
  });

  const project = useProject(projectId);
  const enabledActivities = project.data?.time_entry_activities?.map((activity) => activity.id);

  const activities = enabledActivities ? timeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false && enabledActivities.includes(activity.id)) : timeEntryActivitiesQuery.data;

  return {
    data: activities,
    isLoading: timeEntryActivitiesQuery.isLoading,
    isError: timeEntryActivitiesQuery.isError,
    defaultActivity: activities?.find((entry) => entry.is_default),
  };
};
export default useTimeEntryActivities;
