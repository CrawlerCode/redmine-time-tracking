import { ToggleableCard } from "@/components/general/ToggleableCard";
import IssueTitle from "@/components/issue/IssueTitle";
import Timer from "@/components/timer/timer";
import { useIssuePriorities } from "@/hooks/useIssuePriorities";
import { usePermissions } from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { clsxm } from "@/utils/clsxm";
import { ProjectTimersGroup as ProjectTimersGroupType } from "@/utils/groupTimers";
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

  const { hasProjectPermission } = usePermissions();

  const { getPriorityType } = useIssuePriorities({ enabled: settings.style.showIssuesPriority });

  return (
    <div {...props} className={clsxm("flex flex-col gap-y-2", className)}>
      <TimerProject type={projectGroup.type} project={projectGroup.project} />
      {projectGroup.items.map(({ timer, issue }) => (
        <Timer.Root key={timer.id} timer={timer} issue={issue}>
          <Timer.ContextMenu>
            <ToggleableCard role="listitem" data-type="timer" className="flex flex-col gap-1" onToggle={() => timer.toggleTimer()}>
              {issue ? <IssueTitle issue={issue} priorityType={getPriorityType(issue)} /> : <h1 className="truncate text-gray-500 line-through">#{timer.issueId}</h1>}
              <Timer.Wrapper>
                <Timer.NameField />
                <Timer.Counter />
                <Timer.ToggleButton />
                <Timer.ResetButton />
                <Timer.DoneButton canLogTime={issue ? hasProjectPermission(issue.project.id, "log_time") : false} />
              </Timer.Wrapper>
            </ToggleableCard>
          </Timer.ContextMenu>
        </Timer.Root>
      ))}
    </div>
  );
};

const TimerProject = ({ project, type }: { project?: TReference; type: ProjectTimersGroupType["type"] }) => {
  const { settings } = useSettings();

  return (
    <div
      className={clsx("flex items-center gap-x-1", {
        "bg-background shadow-background sticky top-0 z-5 py-1 shadow": settings.style.stickyScroll,
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
