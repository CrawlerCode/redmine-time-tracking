import { Button } from "@/components/ui/button";
import useActiveRedmineTab from "@/hooks/useActiveRedmineTab";
import { issuePrioritiesQueryOptions, useSuspenseIssuePriorities } from "@/hooks/useIssuePriorities";
import { myOpenIssuesQueryOptions, useSuspenseMyIssues } from "@/hooks/useMyIssues";
import { useSuspenseMultipleProjectVersions } from "@/hooks/useProjectVersions";
import PermissionProvider from "@/provider/PermissionProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { groupIssues } from "@/utils/groupIssues";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import Filter, { filterIssues, useFilter } from "../components/issue/Filter";
import IssueSearch, { filterIssuesByLocalSearch, useIssueSearch } from "../components/issue/IssueSearch";
import IssuesList from "../components/issue/IssuesList";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import TimersBadge from "../components/timer/TimersBadge";
import useLocalIssues from "../hooks/useLocalIssues";
import useRedmineSearch from "../hooks/useRedmineSearch";
import useTimers from "../hooks/useTimers";

export const Route = createFileRoute("/issues")({
  component: PageComponent,
  loader: async ({ context: { settings, queryClient, redmineApi } }) => {
    // Prefetch required data in parallel mode
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        ...myOpenIssuesQueryOptions(redmineApi),
        pages: 3,
      }),
      ...(settings.style.sortIssuesByPriority ? [queryClient.prefetchQuery(issuePrioritiesQueryOptions(redmineApi))] : []),
    ]);
  },
  pendingComponent: () => <IssuesListSkeleton />,
});

function PageComponent() {
  return (
    <IssueSearch>
      <Filter.Provider>
        <IssuesPage />
      </Filter.Provider>
    </IssueSearch>
  );
}

const IssuesPage = () => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const localIssues = useLocalIssues();
  const timers = useTimers();

  const search = useIssueSearch();
  const searchIssues = useRedmineSearch(search);
  const filter = useFilter();

  const myIssuesQuery = useSuspenseMyIssues(Array.from(new Set([...timers.getIssuesIds(), ...localIssues.getIssuesIds()])));
  const unsortedIssues = filterIssues(search.isSearching && search.settings.mode === "remote" ? searchIssues.data : filterIssuesByLocalSearch(myIssuesQuery.data, search), filter.settings);

  const activeTab = useActiveRedmineTab();

  const { priorities } = useSuspenseIssuePriorities({ enabled: settings.style.sortIssuesByPriority });
  const { projectVersionsMap } = useSuspenseMultipleProjectVersions([...new Set(unsortedIssues.filter((i) => i.fixed_version).map((i) => i.project.id))], {
    enabled: settings.style.groupIssuesByVersion,
  });

  const groupedIssues = useMemo(
    () =>
      groupIssues(unsortedIssues, {
        localIssues: localIssues.localIssues,
        timers: timers.getAllTimers(),
        issuePriorities: priorities,
        projectVersions: projectVersionsMap,
        activeTabIssueId: activeTab?.data?.type === "issue" ? activeTab?.data?.id : undefined,
        settings,
      }),
    [unsortedIssues, localIssues.localIssues, timers, priorities, projectVersionsMap, activeTab, settings]
  );

  return (
    <PermissionProvider>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="mb-1 flex justify-end">
        <Filter.Button />
      </div>

      <IssuesList groupedIssues={groupedIssues} localIssues={localIssues} timers={timers} />

      {search.isSearching && search.settings.mode === "remote" && searchIssues.hasNextPage && !searchIssues.isLoading && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => searchIssues.fetchNextPage()}>
            {formatMessage({ id: "issues.list.load-more" })}
          </Button>
        </div>
      )}
    </PermissionProvider>
  );
};
