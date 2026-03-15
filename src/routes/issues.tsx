import { useSuspenseIssuePriorities } from "@/api/redmine/hooks/useRedmineIssuePriorities";
import { useSuspenseRedmineIssues } from "@/api/redmine/hooks/useRedmineIssues";
import { useSuspenseRedmineMultipleProjectVersions } from "@/api/redmine/hooks/useRedmineMultipleProjectVersions";
import { redmineIssuePrioritiesQuery } from "@/api/redmine/queries/issuePriorities";
import { redmineIssuesQuery } from "@/api/redmine/queries/issues";
import { OptionalSidebarScrollspy } from "@/components/general/SidebarScrollspy";
import { Skeleton } from "@/components/ui/skeleton";
import useActiveRedmineTab from "@/hooks/useActiveRedmineTab";
import PermissionProvider from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { groupIssues } from "@/utils/groupIssues";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useMediaQuery } from "usehooks-ts";
import useRedmineIssuesSearch from "../api/redmine/hooks/useRedmineIssuesSearch";
import Filter, { filterIssues, useFilter } from "../components/issue/Filter";
import IssueSearch, { filterIssuesByLocalSearch, useIssueSearch } from "../components/issue/IssueSearch";
import { ProjectGroupIcon, ProjectIssuesGroup, ProjectIssuesGroupSkeleton } from "../components/issue/ProjectIssuesGroup";
import TimersBadge from "../components/timer/TimersBadge";
import useLocalIssues from "../hooks/useLocalIssues";
import useTimers from "../hooks/useTimers";

export const Route = createFileRoute("/issues")({
  component: PageComponent,
  loader: async ({ context: { settings, queryClient, redmineApi } }) => {
    // Prefetch required data in parallel mode
    await Promise.all([
      queryClient.prefetchInfiniteQuery({
        ...redmineIssuesQuery(redmineApi, {
          assignedTo: "me",
          statusId: "open",
        }),
        pages: 3,
      }),
      ...(settings.style.sortIssuesByPriority ? [queryClient.prefetchQuery(redmineIssuePrioritiesQuery(redmineApi))] : []),
    ]);
  },
  pendingComponent: () => <PageSkeleton />,
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

  const { data: myOpenIssues } = useSuspenseRedmineIssues({
    assignedTo: "me",
    statusId: "open",
  });
  const fetchAdditionalIssuesIds = useDeferredValue(Array.from(new Set([...timers.getIssuesIds(), ...localIssues.getIssuesIds()]).difference(new Set(myOpenIssues.map((issue) => issue.id)))));
  const { data: additionalIssues } = useSuspenseRedmineIssues({
    issueIds: fetchAdditionalIssuesIds,
    statusId: "*",
  });
  const issues = myOpenIssues.concat(additionalIssues.filter((issue) => !myOpenIssues.find((iss) => iss.id === issue.id)));

  const search = useIssueSearch();
  const redmineIssuesSearch = useRedmineIssuesSearch(search);

  const filter = useFilter();
  const unsortedIssues = filterIssues(search.isSearching && search.settings.mode === "remote" ? redmineIssuesSearch.data : filterIssuesByLocalSearch(issues, search), filter.settings);

  const activeTab = useActiveRedmineTab();

  const { priorities } = useSuspenseIssuePriorities({ enabled: settings.style.sortIssuesByPriority });
  const { projectVersionsMap } = useSuspenseRedmineMultipleProjectVersions([...new Set(unsortedIssues.filter((i) => i.fixed_version).map((i) => i.project.id))], {
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

            <IssueSearch.LoadMore hasNextPage={redmineIssuesSearch.hasNextPage} isLoading={redmineIssuesSearch.isLoading} fetchNextPage={redmineIssuesSearch.fetchNextPage} />
          </div>
        )}
      </OptionalSidebarScrollspy>
    </PermissionProvider>
  );
};

const PageSkeleton = () => {
  const { settings } = useSettings();

  const groupedIssues = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/purity
      [...Array(Math.floor(Math.random() * 3 + 2)).keys()].map((i) => ({
        key: `${i}`,
        // eslint-disable-next-line react-hooks/purity
        groups: [...Array(Math.floor(Math.random() * 5 + 2)).keys()],
      })),
    []
  );

  const showSidebarScrollspy = useMediaQuery("(width > calc(320px + 12rem))");

  return (
    <>
      <IssueSearch.Skeleton.Input className="mb-2 sm:mb-4" />

      <OptionalSidebarScrollspy
        enabled={showSidebarScrollspy && settings.style.fullscreenSidebarScrollspy}
        groups={groupedIssues.map((projectGroup) => ({
          key: projectGroup.key,
          label: <Skeleton className="h-5.5 w-32" />,
        }))}
        classNames={{
          root: "-m-2 sm:-m-4",
          sidebar: "w-48",
          section: "p-2 mt-2 pt-0 sm:px-4",
        }}
      >
        {() => (
          <div className="space-y-2">
            <div className="flex justify-end">
              <Skeleton className="h-7 w-18" />
            </div>

            <div className="flex flex-col gap-y-4">
              {groupedIssues.map((projectGroup) => (
                <ProjectIssuesGroupSkeleton key={projectGroup.key} groups={projectGroup.groups} />
              ))}
            </div>
          </div>
        )}
      </OptionalSidebarScrollspy>
    </>
  );
};
