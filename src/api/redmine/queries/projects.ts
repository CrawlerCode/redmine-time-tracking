import { redminePaginatedInfiniteQueryOptions } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { queryOptions } from "@tanstack/react-query";

/**
 * Query single redmine project
 */
export const redmineProjectQuery = (redmineApi: RedmineApiClient, projectId: number) =>
  queryOptions({
    queryKey: ["redmine", "projects", projectId],
    queryFn: () => redmineApi.getProject(projectId),
  });

/**
 * Query all redmine projects
 */
export const redmineProjectsQuery = (redmineApi: RedmineApiClient) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["redmine", "projects"],
    queryFn: ({ pageParam }) => redmineApi.getProjects(pageParam),
    select: (data) => data.pages.map((page) => page.projects).flat(),
  });
