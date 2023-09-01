import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyOpenIssues, getOpenIssuesByIds, getOpenIssuesByProject, searchOpenIssues, searchProjects } from "../api/redmine";
import { SearchQuery } from "../components/issues/Search";
import useDebounce from "./useDebounce";
import useSettings from "./useSettings";

const MAX_EXTENDED_SEARCH_LIMIT = 75;
const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 5;
const STALE_DATA_TIME = 1000 * 60;

const useMyIssues = (additionalIssuesIds: number[], search: SearchQuery) => {
  const { settings } = useSettings();

  const issuesQuery = useInfiniteQuery({
    queryKey: ["issues"],
    queryFn: ({ pageParam = 0 }) => getAllMyOpenIssues(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });
  const additionalIssuesQuery = useInfiniteQuery({
    queryKey: ["additionalIssues", additionalIssuesIds],
    queryFn: ({ pageParam = 0 }) => getOpenIssuesByIds(additionalIssuesIds, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: additionalIssuesIds.length > 0,
    keepPreviousData: additionalIssuesIds.length > 0,
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });

  // auto fetch all pages
  useEffect(() => {
    if (issuesQuery.hasNextPage && !issuesQuery.isFetchingNextPage) issuesQuery.fetchNextPage();
  }, [issuesQuery]);
  useEffect(() => {
    if (additionalIssuesQuery.hasNextPage && !additionalIssuesQuery.isFetchingNextPage) additionalIssuesQuery.fetchNextPage();
  }, [additionalIssuesQuery]);

  let issues = issuesQuery.data?.pages?.flat() ?? [];
  issues.push(...(additionalIssuesQuery.data?.pages?.flat().filter((issue) => !issues.find((iss) => iss.id === issue.id)) ?? []));

  // filter by project
  if (search.inProject) {
    issues = issues.filter((issue) => issue.project.id === search.inProject?.id);
  }
  // filter by search
  if (search.searching && search.query) {
    issues = issues.filter((issue) => new RegExp(search.query, "i").test(search.mode === "project" ? issue.project.name : `#${issue.id} ${issue.subject}`));
  }

  // ---

  // extended search
  const debouncedSearch = useDebounce(search.query, 300);
  const extendedSearching = search.searching && debouncedSearch.length >= 3 && settings.options.extendedSearch;

  // extended search - mode: issue
  const extendedSearchIssuesResultQuery = useQuery({
    queryKey: ["extendedSearchIssuesResult", debouncedSearch],
    queryFn: () => searchOpenIssues(debouncedSearch),
    enabled: extendedSearching && search.mode === "issue" && !debouncedSearch.includes("#"),
    keepPreviousData: true,
  });
  const extendedSearchIssuesResultIds = (extendedSearchIssuesResultQuery.data?.map((result) => result.id) ?? []).filter((id) => !issues.find((issue) => issue.id === id));
  const extendedSearchIssueIdMatch = debouncedSearch.match(/^#(\d+)$/); // search for #<issueId>
  if (extendedSearchIssueIdMatch) {
    const issueId = Number(extendedSearchIssueIdMatch[1]);
    if (!issues.find((issue) => issue.id === issueId)) extendedSearchIssuesResultIds.push(issueId);
  }
  const extendedSearchIssuesQuery = useQuery({
    queryKey: ["extendedSearchIssues", extendedSearchIssuesResultIds],
    queryFn: () => getOpenIssuesByIds(extendedSearchIssuesResultIds, 0, search.inProject ? 100 : MAX_EXTENDED_SEARCH_LIMIT),
    enabled: extendedSearchIssuesResultIds.length > 0,
    keepPreviousData: extendedSearchIssuesResultIds.length > 0,
  });
  const extendedSearchIssuesList =
    (search.inProject ? extendedSearchIssuesQuery.data?.filter((issue) => issue.project.id === search.inProject?.id) : extendedSearchIssuesQuery.data)?.slice(0, MAX_EXTENDED_SEARCH_LIMIT) ?? [];

  // extended search - mode: project
  const extendedSearchProjectsResultQuery = useQuery({
    queryKey: ["extendedSearchProjectsResult", debouncedSearch],
    queryFn: () => searchProjects(debouncedSearch),
    enabled: extendedSearching && search.mode === "project",
    keepPreviousData: true,
  });
  const extendedSearchProjectsResultIds = extendedSearchProjectsResultQuery.data?.map((result) => result.id) ?? [];
  const extendedSearchIssuesByProjectsQueries = useQueries({
    queries: extendedSearchProjectsResultIds.map((projectId) => ({
      queryKey: ["extendedSearchIssuesByProjects", projectId],
      queryFn: () => getOpenIssuesByProject(projectId, 0, Math.ceil(MAX_EXTENDED_SEARCH_LIMIT / extendedSearchProjectsResultIds.length)),
      keepPreviousData: true,
    })),
  });
  const extendedSearchIssuesByProjectsList = extendedSearchIssuesByProjectsQueries
    .map((q) => q.data ?? [])
    .flat()
    .filter(({ id }) => !issues.find((issue) => issue.id === id));

  const extendedSearchIssues = extendedSearching ? (search.mode === "issue" ? extendedSearchIssuesList : extendedSearchIssuesByProjectsList) : [];

  return {
    data: issues,
    extendedSearch: extendedSearchIssues,
    isLoading: issuesQuery.isInitialLoading || additionalIssuesQuery.isInitialLoading,
    isError: issuesQuery.isError,
  };
};

export default useMyIssues;
