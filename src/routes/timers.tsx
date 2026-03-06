import { OptionalSidebarScrollspy } from "@/components/general/SidebarScrollspy";
import { ProjectTimersGroup } from "@/components/timer/ProjectTimersGroup";
import TimerSearch, { useTimerSearch } from "@/components/timer/TimerSearch";
import { useSuspenseIssues } from "@/hooks/useIssues";
import PermissionProvider from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { groupTimers } from "@/utils/groupTimers";
import { createFileRoute } from "@tanstack/react-router";
import { SquareChartGanttIcon } from "lucide-react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useMediaQuery } from "usehooks-ts";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import TimersBadge from "../components/timer/TimersBadge";
import useTimers from "../hooks/useTimers";

export const Route = createFileRoute("/timers")({
  component: PageComponent,
  pendingComponent: () => <IssuesListSkeleton />,
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
  const issues = useSuspenseIssues(timers.getIssuesIds());

  const search = useTimerSearch();
  const matchedTimers = timers.searchTimers(search, issues.data);

  const groupedTimers = useMemo(() => groupTimers(matchedTimers, issues.data), [matchedTimers, issues.data]);

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
