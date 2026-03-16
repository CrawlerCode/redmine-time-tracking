import { useSuspenseRedmineIssues } from "@/api/redmine/hooks/useRedmineIssues";
import { OptionalSidebarScrollspy } from "@/components/general/SidebarScrollspy";
import { ProjectTimersGroup, ProjectTimersGroupSkeleton } from "@/components/timer/ProjectTimersGroup";
import TimerSearch, { useTimerSearch } from "@/components/timer/TimerSearch";
import { Skeleton } from "@/components/ui/skeleton";
import PermissionProvider from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { groupTimers } from "@/utils/groupTimers";
import { randomInt } from "@/utils/random";
import { createFileRoute } from "@tanstack/react-router";
import { SquareChartGanttIcon } from "lucide-react";
import { useDeferredValue, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useMediaQuery } from "usehooks-ts";
import TimersBadge from "../components/timer/TimersBadge";
import useTimers from "../hooks/useTimers";

export const Route = createFileRoute("/timers")({
  component: PageComponent,
  pendingComponent: () => <PageSkeleton />,
});

function PageComponent() {
  return (
    <TimerSearch.Provider>
      <TimersPage />
    </TimerSearch.Provider>
  );
}

const TimersPage = () => {
  const { settings } = useSettings();

  const timers = useTimers();

  const issueIds = useDeferredValue(timers.getIssuesIds());
  const { data: issues } = useSuspenseRedmineIssues({
    issueIds,
    statusId: "*",
  });

  const search = useTimerSearch();
  const matchedTimers = timers.searchTimers(search, issues);

  const groupedTimers = useMemo(() => groupTimers(matchedTimers, issues), [matchedTimers, issues]);

  const showSidebarScrollspy = useMediaQuery("(width > calc(320px + 12rem))");

  return (
    <PermissionProvider>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <TimerSearch.Input className="mb-2 sm:mb-4" />

      <OptionalSidebarScrollspy
        enabled={showSidebarScrollspy && settings.style.fullscreenSidebarScrollspy}
        groups={groupedTimers.map((projectGroup) => ({
          key: projectGroup.key,
          label: (
            <>
              <SquareChartGanttIcon className="size-3.5 shrink-0" />
              <span className="truncate">{projectGroup.project?.name ?? <FormattedMessage id="timers.list.unknown-project-group" />}</span>
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
          <div className="flex flex-col gap-y-4">
            {groupedTimers.map((projectGroup) => (
              <ProjectTimersGroup key={projectGroup.key} projectGroup={projectGroup} {...getGroupProps(projectGroup.key)} />
            ))}
            {groupedTimers.length === 0 && (
              <p className="text-center">
                <FormattedMessage id="timers.list.no-options" />
              </p>
            )}
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
      [...Array(randomInt(2, 3)).keys()].map((i) => ({
        key: `${i}`,
        groups: [...Array(randomInt(2, 7)).keys()],
      })),
    []
  );

  const showSidebarScrollspy = useMediaQuery("(width > calc(320px + 12rem))");

  return (
    <>
      <TimerSearch.Skeleton.Input className="mb-2 sm:mb-4" />

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
          <div className="flex flex-col gap-y-4">
            {groupedIssues.map((projectGroup) => (
              <ProjectTimersGroupSkeleton key={projectGroup.key} groups={projectGroup.groups} />
            ))}
          </div>
        )}
      </OptionalSidebarScrollspy>
    </>
  );
};
