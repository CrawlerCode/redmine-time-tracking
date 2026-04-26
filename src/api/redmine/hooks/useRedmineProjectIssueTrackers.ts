import { redmineIssueTrackersQuery } from "@/api/redmine/queries/issueTrackers";
import { redmineProjectQuery } from "@/api/redmine/queries/projects";
import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";

export const useRedmineProjectIssueTrackers = (projectId: number) => {
  const redmineApi = useRedmineApi();

  const projectQuery = useQuery(redmineProjectQuery(redmineApi, projectId));
  const issueTrackersQuery = useQuery(redmineIssueTrackersQuery(redmineApi));

  const enabledTrackers = projectQuery.data?.trackers?.map((tracker) => tracker.id);
  const trackers = enabledTrackers ? issueTrackersQuery.data?.filter((t) => enabledTrackers.includes(t.id)) : issueTrackersQuery.data;

  return {
    trackers,
    defaultTracker: trackers?.[0],
    isPending: issueTrackersQuery.isPending || projectQuery.isPending,
  };
};
