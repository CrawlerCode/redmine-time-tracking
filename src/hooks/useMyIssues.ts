import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyOpenIssues, getOpenIssuesByIds, searchOpenIssues } from "../api/redmine";
import { FilterQuery } from "../components/issues/Filter";
import { SearchQuery } from "../components/issues/Search";
import useDebounce from "./useDebounce";
import useSettings from "./useSettings";

const MAX_EXTENDED_SEARCH_LIMIT = 75;
const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 5;
const STALE_DATA_TIME = 1000 * 60;

const useMyIssues = (additionalIssuesIds: number[], search: SearchQuery, filter: FilterQuery) => {
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

  // filter by project (search in project)
  if (search.inProject) {
    issues = issues.filter((issue) => issue.project.id === search.inProject?.id);
  }

  // filter by search
  if (search.searching && search.query) {
    issues = issues.filter((issue) => new RegExp(search.query, "i").test(`#${issue.id} ${issue.subject}`));
  }

  // ---

  // extended search
  const debouncedSearch = useDebounce(search.query, 300);
  const extendedSearchIssueIdMatch = debouncedSearch.match(/^#(\d+)$/); // search for #<issueId>
  const extendedSearching = search.searching && (debouncedSearch.length >= 3 || extendedSearchIssueIdMatch !== null) && settings.options.extendedSearch;

  const extendedSearchIssuesResultQuery = useQuery({
    queryKey: ["extendedSearchIssuesResult", debouncedSearch],
    queryFn: () => searchOpenIssues(debouncedSearch),
    enabled: extendedSearching && !debouncedSearch.includes("#"),
    keepPreviousData: true,
  });
  const extendedSearchIssuesResultIds = (extendedSearchIssuesResultQuery.data?.map((result) => result.id) ?? []).filter((id) => !issues.find((issue) => issue.id === id));
  if (extendedSearching && extendedSearchIssueIdMatch) {
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

  let extendedSearchIssues = extendedSearching ? extendedSearchIssuesList : [];

  // ---

  // filter: projects
  if (filter.projects.length > 0) {
    issues = issues.filter((issue) => filter.projects.includes(issue.project.id));
    extendedSearchIssues = extendedSearchIssues.filter((issue) => filter.projects.includes(issue.project.id));
  }

  // filter: hide completed issues (done_ratio = 100%)
  if (filter.hideCompletedIssues) {
    issues = issues.filter((issue) => issue.done_ratio !== 100);
    extendedSearchIssues = extendedSearchIssues.filter((issue) => issue.done_ratio !== 100);
  }

  return {
    data: issues,
    extendedSearch: extendedSearchIssues,
    isLoading: issuesQuery.isInitialLoading || additionalIssuesQuery.isInitialLoading,
    isError: issuesQuery.isError,
  };
};

export default useMyIssues;
