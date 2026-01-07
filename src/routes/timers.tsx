import { TReference } from "@/api/redmine/types";
import { ToggleableCard } from "@/components/general/ToggleableCard";
import IssueTitle from "@/components/issue/IssueTitle";
import Timer from "@/components/timer/timer";
import TimerSearch, { useTimerSearch } from "@/components/timer/TimerSearch";
import { useIssuePriorities } from "@/hooks/useIssuePriorities";
import { useSuspenseIssues } from "@/hooks/useIssues";
import useMyProjectRoles from "@/hooks/useMyProjectRoles";
import { groupTimers, TimersGroup } from "@/utils/groupTimers";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { SquareChartGanttIcon } from "lucide-react";
import { Fragment, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import TimersBadge from "../components/timer/TimersBadge";
import useTimers from "../hooks/useTimers";
import { useSettings } from "../provider/SettingsProvider";

export const Route = createFileRoute("/timers")({
  component: PageComponent,
  pendingComponent: () => <IssuesListSkeleton />,
});

function PageComponent() {
  return (
    <TimerSearch>
      <TimersPage />
    </TimerSearch>
  );
}

const TimersPage = () => {
  const { settings } = useSettings();

  const timers = useTimers();
  const issues = useSuspenseIssues(timers.getIssuesIds());
  const issuePriorities = useIssuePriorities({ enabled: settings.style.showIssuesPriority });

  const projectIds = useMemo(() => [...new Set(issues.data.map((i) => i.project.id))], [issues.data]);
  const projectRoles = useMyProjectRoles(projectIds);

  const search = useTimerSearch();
  const matchedTimers = timers.searchTimers(search, issues.data);

  const groupedTimers = useMemo(() => groupTimers(matchedTimers, issues.data), [matchedTimers, issues.data]);

  return (
    <>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="flex flex-col gap-y-2">
        {groupedTimers.map(({ key, type, project, items }) => (
          <Fragment key={key}>
            <TimerProject type={type} project={project} />

            {items.map(({ timer, issue }) => (
              <Timer.Root key={timer.id} timer={timer} issue={issue}>
                <Timer.ContextMenu>
                  <ToggleableCard role="listitem" data-type="timer" className="flex flex-col gap-1" onToggle={() => timer.toggleTimer()}>
                    {issue ? <IssueTitle issue={issue} priorityType={issuePriorities.getPriorityType(issue)} /> : <h1 className="truncate text-gray-500 line-through">#{timer.issueId}</h1>}
                    <Timer.Wrapper>
                      <Timer.NameField />
                      <Timer.Counter />
                      <Timer.ToggleButton />
                      <Timer.ResetButton />
                      <Timer.DoneButton canLogTime={issue ? projectRoles.hasProjectPermission(issue.project.id, "log_time") : false} />
                    </Timer.Wrapper>
                  </ToggleableCard>
                </Timer.ContextMenu>
              </Timer.Root>
            ))}
          </Fragment>
        ))}

        {matchedTimers.length === 0 && (
          <p className="text-center">
            <FormattedMessage id="timers.list.no-options" />
          </p>
        )}
      </div>
    </>
  );
};

const TimerProject = ({ project, type }: { project?: TReference; type: TimersGroup["type"] }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx("flex items-center gap-x-1", {
        "bg-background shadow-background sticky top-0 z-5 -mx-2 -my-1 px-2 py-1 shadow": settings.style.stickyScroll,
      })}
    >
      <SquareChartGanttIcon className="size-3.5 shrink-0" />

      {project && (
        <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="truncate text-sm hover:underline" rel="noreferrer">
          {project.name}
        </a>
      )}

      {type === "unknown-project" && <FormattedMessage id="timers.list.unknown-project-group" />}
    </div>
  );
};
