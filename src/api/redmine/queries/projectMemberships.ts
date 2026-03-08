import { redminePaginatedInfiniteQueryOptions } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";

/**
 * Query redmine project memberships
 */
export const redmineProjectMembershipsQuery = (redmineApi: RedmineApiClient, projectId: number) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["redmine", "projectMemberships", projectId],
    queryFn: ({ pageParam }) => redmineApi.getProjectMemberships(projectId, pageParam),
    select: (data) => data.pages.map((page) => page.memberships).flat(),
  });
