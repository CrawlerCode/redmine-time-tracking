import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyOpenIssues, getMyAccount, getOpenIssues, searchOpenIssues } from "../api/redmine";
import useDebounce from "./useDebounce";
import useSettings from "./useSettings";

const useMyIssues = (additionalIssuesIds: number[], search: string) => {
  const { settings } = useSettings();

  const myAccountQuery = useQuery({
    queryKey: ["myAccount"],
    queryFn: getMyAccount,
  });

  const issuesQuery = useInfiniteQuery({
    queryKey: ["issues"],
    queryFn: ({ pageParam = 0 }) => getAllMyOpenIssues(pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
  });
  const additionalIssuesQuery = useInfiniteQuery({
    queryKey: ["additionalIssues", additionalIssuesIds],
    queryFn: ({ pageParam = 0 }) => getOpenIssues(additionalIssuesIds, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    enabled: additionalIssuesIds.length > 0,
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
  if (search) {
    issues = issues.filter((issue) => new RegExp(search, "i").test(`#${issue.id} ${issue.subject}`));
  }

  // extended search
  const debouncedSearch = useDebounce(search, 300);
  const extendedSearchResultQuery = useQuery({
    queryKey: ["extendedSearchResult", debouncedSearch],
    queryFn: () => searchOpenIssues(debouncedSearch),
    enabled: !!debouncedSearch && settings.options.extendedSearch,
    keepPreviousData: true,
  });
  const extendedSearchResultIds = (extendedSearchResultQuery.data?.map((result) => result.id) ?? []).filter((id) => !issues.find((issue) => issue.id === id));
  const extendedSearchIssuesQuery = useQuery({
    queryKey: ["extendedSearchIssues", extendedSearchResultIds],
    queryFn: () => getOpenIssues(extendedSearchResultIds),
    enabled: extendedSearchResultIds.length > 0 && settings.options.extendedSearch,
    keepPreviousData: extendedSearchResultIds.length > 0,
  });

  let extendedSearchIssues = extendedSearchIssuesQuery.data ?? [];

  return {
    account: myAccountQuery.data,
    data: issues,
    extendedSearch: extendedSearchIssues,
    isLoading: issuesQuery.isLoading,
    isError: issuesQuery.isError,
  };
};

export default useMyIssues;
