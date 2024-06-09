import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useProject from "./useProject";

const useIssueTrackers = (projectId: number) => {
  const redmineApi = useRedmineApi();

  const issueTrackersQuery = useQuery({
    queryKey: ["issueTrackers"],
    queryFn: () => redmineApi.getIssueTrackers(),
  });

  const project = useProject(projectId);
  const enabledTrackers = project.data?.trackers?.map((tracker) => tracker.id);

  const trackers = enabledTrackers ? issueTrackersQuery.data?.filter((t) => enabledTrackers.includes(t.id)) : issueTrackersQuery.data;

  return {
    data: trackers,
    isLoading: issueTrackersQuery.isLoading || project.isLoading,
    isError: issueTrackersQuery.isError || project.isError,
    defaultTracker: trackers?.[0],
  };
};

export default useIssueTrackers;
