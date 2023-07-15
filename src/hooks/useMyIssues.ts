import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyOpenIssues, getOpenIssuesByIds, getOpenIssuesByProject, searchOpenIssues, searchProjects } from "../api/redmine";
import { SearchQuery } from "../components/issues/Search";
import useDebounce from "./useDebounce";
import useSettings from "./useSettings";

const useMyIssues = (additionalIssuesIds: number[], search: SearchQuery) => {
  const { settings } = useSettings();

  const issuesQuery = useInfiniteQuery({
    queryKey: ["issues"],
    queryFn: ({ pageParam = 0 }) => getAllMyOpenIssues(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
  });
  const additionalIssuesQuery = useInfiniteQuery({
    queryKey: ["additionalIssues", additionalIssuesIds],
    queryFn: ({ pageParam = 0 }) => getOpenIssuesByIds(additionalIssuesIds, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: additionalIssuesIds.length > 0,
    keepPreviousData: additionalIssuesIds.length > 0,
  });

  // auto fetch all pages
  useEffect(() => {
    if (issuesQuery.hasNextPage && !issuesQuery.isFetchingNextPage) issuesQuery.fetchNextPage();
  }, [issuesQuery.hasNextPage, issuesQuery.isFetchingNextPage, issuesQuery.fetchNextPage]);
  useEffect(() => {
    if (additionalIssuesQuery.hasNextPage && !additionalIssuesQuery.isFetchingNextPage) additionalIssuesQuery.fetchNextPage();
  }, [additionalIssuesQuery.hasNextPage, additionalIssuesQuery.isFetchingNextPage, additionalIssuesQuery.fetchNextPage]);

  let issues = issuesQuery.data?.pages?.flat() ?? [];
  issues.push(...(additionalIssuesQuery.data?.pages?.flat().filter((issue) => !issues.find((iss) => iss.id === issue.id)) ?? []));

  // filter by search
  if (search.searching && search.query) {
    issues = issues.filter((issue) => new RegExp(search.query, "i").test(search.mode === "project" ? issue.project.name : `#${issue.id} ${issue.subject}`));
  }

  // extended search
  const debouncedSearch = useDebounce(search.query, 300);
  const extendedSearching = search.searching && debouncedSearch.length >= 3 && settings.options.extendedSearch;

  // extended search - issues
  const extendedSearchResultIssuesQuery = useQuery({
    queryKey: ["extendedSearchResultIssues", debouncedSearch],
    queryFn: () => searchOpenIssues(debouncedSearch),
    enabled: extendedSearching && search.mode === "issue",
    keepPreviousData: true,
  });
  const extendedSearchResultIssuesIds = (extendedSearchResultIssuesQuery.data?.map((result) => result.id) ?? []).filter((id) => !issues.find((issue) => issue.id === id));
  const extendedSearchIssuesQuery = useQuery({
    queryKey: ["extendedSearchIssues", extendedSearchResultIssuesIds],
    queryFn: () => getOpenIssuesByIds(extendedSearchResultIssuesIds),
    enabled: extendedSearchResultIssuesIds.length > 0,
    keepPreviousData: extendedSearchResultIssuesIds.length > 0,
  });

  // extended search - projects
  const extendedSearchResultProjectsQuery = useQuery({
    queryKey: ["extendedSearchResultProjects", debouncedSearch],
    queryFn: () => searchProjects(debouncedSearch),
    enabled: extendedSearching && search.mode === "project",
    keepPreviousData: true,
  });
  const extendedSearchResultProjectsIds = extendedSearchResultProjectsQuery.data?.map((result) => result.id) ?? [];
  const extendedSearchIssuesProjectsQueries = useQueries({
    queries: extendedSearchResultProjectsIds.map((projectId) => ({
      queryKey: ["extendedSearchIssuesByProject", projectId],
      queryFn: () => getOpenIssuesByProject(projectId),
      keepPreviousData: true,
    })),
  });

  const extendedSearchIssues = extendedSearching
    ? search.mode === "issue"
      ? extendedSearchIssuesQuery.data ?? []
      : extendedSearchIssuesProjectsQueries
          .map((q) => q.data ?? [])
          .flat()
          .filter(({ id }) => !issues.find((issue) => issue.id === id))
    : [];

  return {
    data: issues,
    extendedSearch: extendedSearchIssues,
    isLoading: issuesQuery.isInitialLoading || additionalIssuesQuery.isInitialLoading,
    isError: issuesQuery.isError,
  };
};

export default useMyIssues;
