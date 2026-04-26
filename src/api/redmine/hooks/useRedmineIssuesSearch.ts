import { redmineIssuesQuery } from "@/api/redmine/queries/issues";
import { redmineSearchIssuesQuery } from "@/api/redmine/queries/search";
import { keepPreviousData } from "@tanstack/react-query";
import { IssueSearchContext } from "../../../components/issue/IssueSearch";
import { useRedmineApi } from "../../../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const STALE_DATA_TIME = 1000 * 60; // 1 minute

const useRedmineIssuesSearch = (search: IssueSearchContext) => {
  const redmineApi = useRedmineApi();

  const isSearching = search.isSearching && search.settings.mode === "remote";

  const [_, _issueIdSearch] = search.query.match(/^#(\d+)$/) ?? []; // search for #<issueId>
  const issueIdSearch = _issueIdSearch ? Number(_issueIdSearch) : undefined;

  // Search issues
  const searchResultQuery = useRedminePaginatedInfiniteQuery({
    ...redmineSearchIssuesQuery(redmineApi, {
      query: search.query,
      ...(search.inProject?.id
        ? {
            projectId: search.inProject.id,
          }
        : {
            scope: "my_projects",
          }),
      titlesOnly: search.settings.remoteSearchOptions.titlesOnly, // search option: titles only
      openIssuesOnly: search.settings.remoteSearchOptions.openIssuesOnly, // search option: open issues only
    }),
    select: (data) =>
      data.pages
        .map((page) => page.results)
        .flat()
        .map((result) => result.id),
    enabled: isSearching && !issueIdSearch,
    placeholderData: keepPreviousData,
    staleTime: STALE_DATA_TIME,
  });

  // Collect issueIds
  const issueIds = isSearching
    ? issueIdSearch
      ? // just search by issueId
        [issueIdSearch]
      : // use search results
        (searchResultQuery.data ?? [])
    : [];

  // Query issues by ids
  const issuesQuery = useRedminePaginatedInfiniteQuery({
    ...redmineIssuesQuery(redmineApi, {
      issueIds: issueIds,
      projectId: search.inProject?.id, // filter: project (search in project)
      assignedTo: search.settings.remoteSearchOptions.assignedToMe ? "me" : undefined, // search option: assigned to me
      statusId: search.settings.remoteSearchOptions.openIssuesOnly ? "open" : "*", // search option: open issues only
    }),
    enabled: issueIds.length > 0 && !searchResultQuery.isFetching,
    placeholderData: keepPreviousData,
    staleTime: STALE_DATA_TIME,
    autoFetchPages: 10, // Auto fetch (max 10 pages)
  });

  const issues = issuesQuery.data ?? [];

  return {
    data: issues,
    isLoading: issuesQuery.isLoading,
    isError: issuesQuery.isError,
    hasNextPage: searchResultQuery.hasNextPage,
    fetchNextPage: searchResultQuery.fetchNextPage,
  };
};

export default useRedmineIssuesSearch;
