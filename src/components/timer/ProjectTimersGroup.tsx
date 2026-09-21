import { useRedmineIssuePriorities } from "@/api/redmine/hooks/useRedmineIssuePriorities";
import { TimerComponents } from "@/components/timer/timer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSettings } from "@/provider/SettingsProvider";
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

  const { getPriorityType } = useRedmineIssuePriorities({ enabled: settings.style.showIssuePriority });

  return (
    <div {...props} className={cn("flex flex-col gap-y-2", className)}>
      <TimerProject type={projectGroup.type} project={projectGroup.project} />
      {projectGroup.items.map(({ timer, issue }) => (
        <TimerComponents.Root key={timer.id} timer={timer} issue={issue}>
          <TimerComponents.ContextMenu>
            <TimerComponents.Card priorityType={issue ? getPriorityType(issue) : undefined} />
          </TimerComponents.ContextMenu>
        </TimerComponents.Root>
      ))}
    </div>
  );
};

export const TimerProject = ({ project, type, forceNoSticky }: { project?: TReference; type: ProjectTimersGroupType["type"]; forceNoSticky?: boolean }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx("flex items-center gap-x-1.5 py-1 text-muted-foreground", {
        "sticky top-0 z-5 bg-background shadow shadow-background": settings.style.stickyScroll && !forceNoSticky,
      })}
    >
      <SquareChartGanttIcon className="size-3.5 shrink-0" />

      {project && (
        <a href={`${settings.redmineURL}/projects/${project.id}`} target="_blank" tabIndex={-1} className="truncate text-xs font-medium tracking-wide uppercase hover:underline" rel="noreferrer">
          {project.name}
        </a>
      )}

      {type === "unknown-project" && (
        <span className="truncate text-xs font-medium tracking-wide uppercase">
          <FormattedMessage id="timers.list.unknown-project-group" />
        </span>
      )}
    </div>
  );
};

export const ProjectTimersGroupSkeleton = ({ groups }: { groups: number[] }) => (
  <div className="flex flex-col gap-y-2">
    <div className="flex items-center gap-x-1.5 py-1">
      <Skeleton className={clsx("h-5.5", randomElement(["w-32", "w-40", "w-60"]))} />
    </div>
    <div className="flex flex-col gap-y-2">
      {groups.map((key) => (
        <TimerComponents.Skeleton.Card key={key} />
      ))}
    </div>
  </div>
);
