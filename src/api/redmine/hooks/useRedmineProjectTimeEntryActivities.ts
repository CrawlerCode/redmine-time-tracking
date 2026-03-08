import { redmineProjectQuery } from "@/api/redmine/queries/projects";
import { redmineTimeEntryActivitiesQuery } from "@/api/redmine/queries/timeEntryActivities";
import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";

export const useRedmineProjectTimeEntryActivities = (projectId: number) => {
  const redmineApi = useRedmineApi();

  const projectQuery = useQuery(redmineProjectQuery(redmineApi, projectId));
  const systemTimeEntryActivitiesQuery = useQuery(redmineTimeEntryActivitiesQuery(redmineApi));

  const projectTimeEntryActivities = projectQuery.data?.time_entry_activities;
  const activities = projectTimeEntryActivities
    ? projectTimeEntryActivities?.map((activity) => ({
        ...systemTimeEntryActivitiesQuery.data?.find((systemActivity) => systemActivity.id === activity.id),
        ...activity,
      }))
    : systemTimeEntryActivitiesQuery.data?.filter((activity) => activity.active !== false);

  return {
    activities,
    defaultActivity: activities?.find((entry) => entry.is_default),
    isPending: projectQuery.isPending || systemTimeEntryActivitiesQuery.isPending,
  };
};
