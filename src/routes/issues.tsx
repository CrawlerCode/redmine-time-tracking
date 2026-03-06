import { OptionalSidebarScrollspy } from "@/components/general/SidebarScrollspy";
import useActiveRedmineTab from "@/hooks/useActiveRedmineTab";
import { issuePrioritiesQueryOptions, useSuspenseIssuePriorities } from "@/hooks/useIssuePriorities";
import { myOpenIssuesQueryOptions, useSuspenseMyIssues } from "@/hooks/useMyIssues";
import { useSuspenseMultipleProjectVersions } from "@/hooks/useProjectVersions";
import PermissionProvider from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { groupIssues } from "@/utils/groupIssues";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useMediaQuery } from "usehooks-ts";
import Filter, { filterIssues, useFilter } from "../components/issue/Filter";
import IssueSearch, { filterIssuesByLocalSearch, useIssueSearch } from "../components/issue/IssueSearch";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import { ProjectGroupIcon, ProjectIssuesGroup } from "../components/issue/ProjectIssuesGroup";
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
    <IssueSearch.Provider>
      <Filter.Provider>
        <IssuesPage />
      </Filter.Provider>
    </IssueSearch.Provider>
  );
}

const IssuesPage = () => {
  const { settings } = useSettings();

  const localIssues = useLocalIssues();
  const timers = useTimers();

  const search = useIssueSearch();
  const filter = useFilter();

  const searchIssues = useRedmineSearch(search);
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

  const showSidebarScrollspy = useMediaQuery("(width > calc(320px + 12rem))");

  return (
    <PermissionProvider>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <IssueSearch.Input className="mb-2 sm:mb-4" />

      <OptionalSidebarScrollspy
        enabled={showSidebarScrollspy && settings.style.fullscreenSidebarScrollspy}
        groups={groupedIssues.map((projectGroup) => ({
          key: projectGroup.key,
          label: (
            <>
              <ProjectGroupIcon type={projectGroup.type} />
              <span className="truncate">{projectGroup.project.name}</span>
            </>
          ),
        }))}
        classNames={{
          root: "-m-2 sm:-m-4",
          sidebar: "w-48",
          section: "p-2 mt-2 pt-0 sm:px-4",
        }}
      >
        {({ getGroupProps }) => (
          <div className="space-y-2">
            <div className="flex justify-end">
              <Filter.Button />
            </div>

            <div className="flex flex-col gap-y-4">
              {groupedIssues.map((projectGroup) => (
                <ProjectIssuesGroup key={projectGroup.key} projectGroup={projectGroup} localIssues={localIssues} timers={timers} {...getGroupProps(projectGroup.key)} />
              ))}
              {groupedIssues.length === 0 && (
                <p className="text-center">
                  <FormattedMessage id="issues.list.no-options" />
                </p>
              )}
            </div>

            <IssueSearch.LoadMore hasNextPage={searchIssues.hasNextPage} isLoading={searchIssues.isLoading} fetchNextPage={searchIssues.fetchNextPage} />
          </div>
        )}
      </OptionalSidebarScrollspy>
    </PermissionProvider>
  );
};
