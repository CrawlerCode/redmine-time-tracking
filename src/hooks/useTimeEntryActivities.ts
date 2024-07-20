import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useProject from "./useProject";

const useTimeEntryActivities = (projectId: number) => {
  const redmineApi = useRedmineApi();

  const systemTimeEntryActivitiesQuery = useQuery({
    queryKey: ["timeEntryActivities"],
    queryFn: () => redmineApi.getTimeEntryActivities(),
  });

  const project = useProject(projectId);
  const projectTimeEntryActivities = project.data?.time_entry_activities;

  const activities = projectTimeEntryActivities
    ? projectTimeEntryActivities?.map((activity) => ({
        ...systemTimeEntryActivitiesQuery.data?.find((systemActivity) => systemActivity.id === activity.id),
        ...activity,
      }))
    : systemTimeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false);

  return {
    data: activities,
    isLoading: systemTimeEntryActivitiesQuery.isLoading,
    isError: systemTimeEntryActivitiesQuery.isError,
    defaultActivity: activities?.find((entry) => entry.is_default),
  };
};
export default useTimeEntryActivities;
