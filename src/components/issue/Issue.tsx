import { PriorityType } from "@/api/redmine/hooks/useRedmineIssuePriorities";
import { IssueContextMenu } from "@/components/issue/IssueContextMenu";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/provider/PermissionsProvider";
import clsx from "clsx";
import { PinIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { TIssue } from "../../api/redmine/types";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { clsxm } from "../../utils/clsxm";
import HelpTooltip from "../general/HelpTooltip";
import { ToggleableCard } from "../general/ToggleableCard";
import Timer from "../timer/timer";
import { IssueTitle, IssueTitleSkeleton } from "./IssueTitle";

type PropTypes = {
  issue: TIssue;
  localIssue: LocalIssue;
  priorityType: PriorityType;
  assignedToMe: boolean;
  timers: TimerController[];
  onAddTimer: () => void;
};

const Issue = ({ issue, localIssue, priorityType, assignedToMe, timers, onAddTimer }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const { hasProjectPermission } = usePermissions();
  const canLogTime = hasProjectPermission(issue.project.id, "log_time");

  const primaryTimer = timers[0];

  const [areTimersExpanded, setAreTimersExpanded] = useState(false);

  return (
    <IssueContextMenu issue={issue} localIssue={localIssue} primaryTimer={primaryTimer} assignedToMe={assignedToMe} onAddTimer={onAddTimer}>
      <ToggleableCard
        role="listitem"
        data-type="issue"
        className={clsxm(
          "relative flex flex-col gap-1",
          settings.style.showIssuesPriority && {
            "border-priority-lowest-bg ring-priority-lowest-bg ring-1": priorityType === "lowest",
            "border-priority-medium-high-bg ring-priority-medium-high-bg ring-1": priorityType === "medium-high",
            "border-priority-high-bg ring-priority-high-bg ring-1": priorityType === "high" || priorityType === "highest",
          }
        )}
        {...(canLogTime && { onToggle: () => primaryTimer.toggleTimer() })}
      >
        <IssueTitle
          issue={issue}
          priorityType={priorityType}
          className={clsx({
            "me-5": (localIssue.pinned && assignedToMe) || (!localIssue.pinned && !assignedToMe),
            "me-10": localIssue.pinned && !assignedToMe,
          })}
        />
        <div className="flex justify-between gap-x-2">
          <div className="mt-0.5">
            <div className="bg-muted w-20 overflow-hidden rounded-sm">
              <div className="text-foreground bg-green-600/80 p-1 text-center text-xs leading-none font-medium select-none dark:bg-green-600/60" style={{ width: `${issue.done_ratio}%` }}>
                {issue.done_ratio}%
              </div>
            </div>
          </div>
          {canLogTime && !areTimersExpanded && (
            <div>
              <Timer.Root timer={primaryTimer} issue={issue}>
                <Timer.Wrapper>
                  <Timer.Counter />
                  <Timer.ToggleButton />
                  <Timer.DoneButton canLogTime={canLogTime} />
                </Timer.Wrapper>
              </Timer.Root>
              {timers.length > 1 && (
                <button type="button" className="text-muted-foreground pl-3 text-xs" onClick={() => setAreTimersExpanded(true)}>
                  {formatMessage({ id: "issues.timers.more-timers" }, { count: timers.length - 1 })}
                </button>
              )}
            </div>
          )}
        </div>
        {canLogTime && areTimersExpanded && (
          <div className="mt-2 flex flex-col gap-y-1">
            {timers.map((timer) => (
              <Timer.Root key={timer.id} timer={timer} issue={issue}>
                <Timer.ContextMenu>
                  <Timer.WrapperCard>
                    <Timer.NameField />
                    <Timer.Counter />
                    <Timer.ToggleButton />
                    <Timer.DoneButton canLogTime={canLogTime} />
                  </Timer.WrapperCard>
                </Timer.ContextMenu>
              </Timer.Root>
            ))}
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-start justify-end gap-x-2">
          {localIssue.pinned && (
            <HelpTooltip message={formatMessage({ id: "issues.issue.pinned" })}>
              <PinIcon className="text-muted-foreground/30 size-3.5 rotate-30 fill-current focus:outline-hidden" tabIndex={-1} />
            </HelpTooltip>
          )}
          {!assignedToMe && (
            <HelpTooltip message={formatMessage({ id: "issues.issue.not-assigned-to-me" })}>
              <UserIcon className="text-muted-foreground/30 size-3.5 fill-current focus:outline-hidden" tabIndex={-1} />
            </HelpTooltip>
          )}
        </div>
      </ToggleableCard>
    </IssueContextMenu>
  );
};

export const IssueSkeleton = () => (
  <ToggleableCard className="flex flex-col gap-1">
    <IssueTitleSkeleton />
    <div className="flex justify-between gap-x-2">
      <div className="mt-0.5">
        <Skeleton className="h-5.5 w-20 rounded-sm" />
      </div>
      <Timer.Wrapper>
        <Timer.Skeleton.Counter />
        <Timer.Skeleton.ToggleButton />
        <Timer.Skeleton.DoneButton />
      </Timer.Wrapper>
    </div>
  </ToggleableCard>
);

export default Issue;
