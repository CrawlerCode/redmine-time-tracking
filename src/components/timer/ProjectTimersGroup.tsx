import { useRedmineIssuePriorities } from "@/api/redmine/hooks/useRedmineIssuePriorities";
import { ToggleableCard } from "@/components/general/ToggleableCard";
import { IssueTitle, IssueTitleSkeleton } from "@/components/issue/IssueTitle";
import { TimerComponents } from "@/components/timer/timer";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimerApi } from "@/hooks/useTimers";
import { usePermissions } from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { clsxm } from "@/utils/clsxm";
import { ProjectTimersGroup as ProjectTimersGroupType } from "@/utils/groupTimers";
import { randomElement } from "@/utils/random";
import clsx from "clsx";
import { SquareChartGanttIcon } from "lucide-react";
import { ComponentProps } from "react";
import { FormattedMessage } from "react-intl";
import { TReference } from "../../api/redmine/types";

interface ProjectTimersGroupProps extends ComponentProps<"div"> {
  projectGroup: ProjectTimersGroupType;
}

export const ProjectTimersGroup = ({ projectGroup, className, ...props }: ProjectTimersGroupProps) => {
  const { settings } = useSettings();

  const timerApi = useTimerApi();

  const { hasProjectPermission } = usePermissions();

  const { getPriorityType } = useRedmineIssuePriorities({ enabled: settings.style.showIssuesPriority });

  return (
    <div {...props} className={clsxm("flex flex-col gap-y-2", className)}>
      <TimerProject type={projectGroup.type} project={projectGroup.project} />
      {projectGroup.items.map(({ timer, issue }) => (
        <TimerComponents.Root key={timer.id} timer={timer} issue={issue}>
          <TimerComponents.ContextMenu>
            <ToggleableCard role="listitem" data-type="timer-card" className="flex flex-col gap-1" onToggle={() => timerApi.toggleTimer(timer)}>
              {issue ? <IssueTitle issue={issue} priorityType={getPriorityType(issue)} /> : <h1 className="truncate text-gray-500 line-through">#{timer.issueId}</h1>}
              <TimerComponents.Wrapper>
                <TimerComponents.NameField />
                <TimerComponents.Counter />
                <TimerComponents.ToggleButton />
                <TimerComponents.DoneButton canLogTime={issue ? hasProjectPermission(issue.project.id, "log_time") : false} />
              </TimerComponents.Wrapper>
              <TimerComponents.Sessions />
            </ToggleableCard>
          </TimerComponents.ContextMenu>
        </TimerComponents.Root>
      ))}
    </div>
  );
};

const TimerProject = ({ project, type }: { project?: TReference; type: ProjectTimersGroupType["type"] }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx("flex items-center gap-x-1 py-1", {
        "bg-background shadow-background sticky top-0 z-5 shadow": settings.style.stickyScroll,
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

export const ProjectTimersGroupSkeleton = ({ groups }: { groups: number[] }) => (
  <div className="flex flex-col gap-y-2">
    <div className="flex items-center gap-x-1 py-1">
      <Skeleton className={clsx("h-5.5", randomElement(["w-32", "w-40", "w-60"]))} />
    </div>
    <div className="flex flex-col gap-y-2">
      {groups.map((key) => (
        <ToggleableCard key={key} className="flex flex-col gap-1">
          <IssueTitleSkeleton />
          <TimerComponents.Wrapper>
            <TimerComponents.Skeleton.NameField />
            <TimerComponents.Skeleton.Counter />
            <TimerComponents.Skeleton.ToggleButton />
            <TimerComponents.Skeleton.DoneButton />
          </TimerComponents.Wrapper>
        </ToggleableCard>
      ))}
    </div>
  </div>
);
