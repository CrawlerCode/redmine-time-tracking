import { keepPreviousData } from "@tanstack/react-query";
import { FilterQuery } from "../components/issues/Filter";
import { SearchQuery } from "../components/issues/Search";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useSettings } from "../provider/SettingsProvider";
import { TIssue } from "../types/redmine";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const STALE_DATA_TIME = 1000 * 60;

const useSearch = (search: SearchQuery, filter: FilterQuery, excludeIssues: TIssue[]) => {
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, _issueIdSearch] = search.query.match(/^#(\d+)$/) ?? []; // search for #<issueId>
  const issueIdSearch = _issueIdSearch ? Number(_issueIdSearch) : undefined;
  const isSearching = search.searching && settings.features.extendedSearch && ((search.debouncedQuery?.length ?? 0) >= 3 || !!issueIdSearch);

  // Search open issues
  const searchResultQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["searchIssuesResult", search.debouncedQuery],
    queryFn: ({ pageParam }) => redmineApi.searchOpenIssues(search.debouncedQuery ?? "", pageParam),
    select: (data) => data?.pages.map((page) => page.results).flat(),
    enabled: isSearching && !issueIdSearch,
    placeholderData: keepPreviousData,
    staleTime: STALE_DATA_TIME,
  });

  // Collect issueIds
  let issueIds: number[] = [];
  if (isSearching && !issueIdSearch) {
    // mode: normal
    // Get result and filter out excluded issues
    issueIds = (searchResultQuery.data?.map((result) => result.id) ?? []).filter((id) => !excludeIssues.find((issue) => issue.id === id));
  } else if (issueIdSearch) {
    // mode: search by issueId
    // Add issueIdSearch to issueIds if not excluded
    if (!excludeIssues.find((issue) => issue.id === issueIdSearch)) {
      issueIds.push(issueIdSearch);
    }
  }

  // Query issues by ids
  const issuesQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["issues", issueIds, search.inProject?.id],
    queryFn: ({ pageParam }) =>
      redmineApi.getOpenIssues(
        {
          projectId: search.inProject?.id,
          issueIds: issueIds,
        },
        pageParam
      ),
    select: (data) => data?.pages.map((page) => page.issues).flat(),
    enabled: issueIds.length > 0 && !searchResultQuery.isFetching,
    staleTime: STALE_DATA_TIME,
    autoFetchPages: 10, // Auto fetch (max 10 pages)
  });

  let issues = issuesQuery.data ?? [];

  // filter by project (search in project)
  if (search.inProject) {
    issues = issues.filter((issue) => issue.project.id === search.inProject?.id);
  }

  // filter: projects
  if (filter.projects.length > 0) {
    issues = issues.filter((issue) => filter.projects.includes(issue.project.id));
  }

  // filter: hide completed issues (done_ratio = 100%)
  if (filter.hideCompletedIssues) {
    issues = issues.filter((issue) => issue.done_ratio !== 100);
  }

  return {
    data: issues,
    isSearching: isSearching,
    isLoading: issuesQuery.isLoading,
    isError: issuesQuery.isError,
    hasNextPage: searchResultQuery.hasNextPage,
    fetchNextPage: searchResultQuery.fetchNextPage,
  };
};

export default useSearch;
