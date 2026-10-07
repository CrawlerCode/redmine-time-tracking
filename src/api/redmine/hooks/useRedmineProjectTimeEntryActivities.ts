import { redmineProjectQuery } from "@/api/redmine/queries/projects";
import { redmineTimeEntryActivitiesQuery } from "@/api/redmine/queries/timeEntryActivities";
import { TProject, TTimeEntryActivity } from "@/api/redmine/types";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";

export const useRedmineProjectTimeEntryActivities = (projectId: number) => {
  const redmineApi = useRedmineApi();

  const projectQuery = useQuery(redmineProjectQuery(redmineApi, projectId));
  const systemTimeEntryActivitiesQuery = useQuery(redmineTimeEntryActivitiesQuery(redmineApi));

  const activities = resolveProjectTimeEntryActivities(projectQuery.data, systemTimeEntryActivitiesQuery.data);

  return {
    activities,
    defaultActivity: activities?.find((entry) => entry.is_default),
    isPending: projectQuery.isPending || systemTimeEntryActivitiesQuery.isPending,
  };
};

export const useRedmineMultipleProjectTimeEntryActivities = (projectIds: number[]) => {
  const redmineApi = useRedmineApi();

  const projectsQueries = useQueries({
    queries: projectIds.map((id) => redmineProjectQuery(redmineApi, id)),
    combine: combineMultipleProjects,
  });
  const systemTimeEntryActivitiesQuery = useQuery(redmineTimeEntryActivitiesQuery(redmineApi));

  const projectTimeEntryActivitiesMap = Object.fromEntries(
    projectIds.map((projectId) => {
      const activities = resolveProjectTimeEntryActivities(projectsQueries.data[projectId], systemTimeEntryActivitiesQuery.data);
      return [projectId, { activities, defaultActivity: activities?.find((activity) => activity.is_default) }];
    })
  );

  return {
    projectTimeEntryActivitiesMap,
  };
};

const combineMultipleProjects = (results: UseQueryResult<TProject, Error>[]) => ({
  data: results.reduce<Record<number, TProject>>((result, query) => {
    if (query.data) {
      result[query.data.id] = query.data;
    }
    return result;
  }, {}),
});

const resolveProjectTimeEntryActivities = (project: TProject | undefined, systemActivities: TTimeEntryActivity[] | undefined) => {
  const projectTimeEntryActivities = project?.time_entry_activities;
  return projectTimeEntryActivities
    ? projectTimeEntryActivities?.map((activity) => ({
        ...systemActivities?.find((systemActivity) => systemActivity.id === activity.id),
        ...activity,
      }))
    : systemActivities?.filter((activity) => activity.active !== false);
};
