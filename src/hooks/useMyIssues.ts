import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyOpenIssues, getOpenIssuesByIds, searchOpenIssues } from "../api/redmine";
import { FilterQuery } from "../components/issues/Filter";
import { SearchQuery } from "../components/issues/Search";
import useDebounce from "./useDebounce";
import useSettings from "./useSettings";

const MAX_EXTENDED_SEARCH_LIMIT = 75;
const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

const useMyIssues = (additionalIssuesIds: number[], search: SearchQuery, filter: FilterQuery) => {
  const { settings } = useSettings();

  const issuesQuery = useInfiniteQuery({
    queryKey: ["issues"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getAllMyOpenIssues(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });
  const additionalIssuesQuery = useInfiniteQuery({
    queryKey: ["additionalIssues", additionalIssuesIds],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getOpenIssuesByIds(additionalIssuesIds, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: additionalIssuesIds.length > 0,
    placeholderData: keepPreviousData,
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
  const extendedSearching = search.searching && (debouncedSearch.length >= 3 || extendedSearchIssueIdMatch !== null) && settings.features.extendedSearch;

  const extendedSearchIssuesResultQuery = useQuery({
    queryKey: ["extendedSearchIssuesResult", debouncedSearch],
    queryFn: () => searchOpenIssues(debouncedSearch),
    enabled: extendedSearching && !debouncedSearch.includes("#"),
    placeholderData: keepPreviousData,
    staleTime: -1,
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
    staleTime: -1,
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
    isLoading: issuesQuery.isLoading || additionalIssuesQuery.isLoading,
    isError: issuesQuery.isError || additionalIssuesQuery.isError,
  };
};

export default useMyIssues;
