import { PriorityType } from "@/api/redmine/hooks/useRedmineIssuePriorities";
import { IssueContextMenu } from "@/components/issue/IssueContextMenu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermissions } from "@/provider/PermissionsProvider";
import { clsx } from "clsx";
import { PinIcon, UserIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { TIssue } from "../../api/redmine/types";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { Timer } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { useTimerApi } from "../../provider/TimerApiProvider";
import HelpTooltip from "../general/HelpTooltip";
import { ToggleableCard } from "../general/ToggleableCard";
import { TimerComponents } from "../timer/timer";
import { IssueTitle, IssueTitleSkeleton } from "./IssueTitle";

type PropTypes = {
  issue: TIssue;
  localIssue: LocalIssue;
  priorityType: PriorityType;
  assignedToMe: boolean;
  timers: Timer[];
};

const Issue = ({ issue, localIssue, priorityType, assignedToMe, timers }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const { hasProjectPermission } = usePermissions();
  const canLogTime = hasProjectPermission(issue.project.id, "log_time");

  const timerApi = useTimerApi();

  const primaryTimer = timers[0]!;

  const hasMultipleTimers = timers.length > 1;

  return (
    <IssueContextMenu issue={issue} localIssue={localIssue} primaryTimer={primaryTimer} assignedToMe={assignedToMe}>
      <ToggleableCard
        role="listitem"
        data-type="issue"
        className={clsx(
          "relative flex flex-col gap-1 p-1",
          settings.style.showIssuePriority && {
            "border-priority-lowest-bg ring-1 ring-priority-lowest-bg": priorityType === "lowest",
            "border-priority-medium-high-bg ring-1 ring-priority-medium-high-bg": priorityType === "medium-high",
            "border-priority-high-bg ring-1 ring-priority-high-bg": priorityType === "high" || priorityType === "highest",
          }
        )}
        {...(canLogTime && { onToggle: () => timerApi.toggleTimer(primaryTimer) })}
      >
        <IssueTitle
          issue={issue}
          priorityType={priorityType}
          className={clsx({
            "me-5": (localIssue.pinned && assignedToMe) || (!localIssue.pinned && !assignedToMe),
            "me-10": localIssue.pinned && !assignedToMe,
          })}
        />

        <div className="flex h-7 items-center justify-between gap-x-2">
          <div className="flex min-h-5.5 min-w-0 flex-1 items-center gap-x-2">
            {settings.style.showIssueDoneRatio && (
              <div className="relative h-5 w-20 shrink-0 overflow-hidden rounded-sm bg-muted">
                <div className="absolute inset-y-0 left-0 bg-green-600/80 dark:bg-green-600/60" style={{ width: `${issue.done_ratio}%` }} />
                <span className="relative flex h-full items-center justify-center text-xs leading-none font-medium text-foreground select-none">{issue.done_ratio}%</span>
              </div>
            )}
            {settings.style.showIssueStatus && (
              <Badge variant="outline" className="shrink justify-start">
                {issue.status.name}
              </Badge>
            )}
          </div>

          {canLogTime && !hasMultipleTimers && (
            <TimerComponents.Root timer={primaryTimer} issue={issue}>
              <TimerComponents.Wrapper>
                <TimerComponents.Counter />
                <TimerComponents.ButtonWrapper>
                  <TimerComponents.ToggleButton />
                  <TimerComponents.DoneButton canLogTime={canLogTime} />
                </TimerComponents.ButtonWrapper>
              </TimerComponents.Wrapper>
            </TimerComponents.Root>
          )}
        </div>

        {canLogTime && hasMultipleTimers && (
          <div className="flex flex-col gap-y-1">
            {timers.map((timer) => (
              <TimerComponents.Root key={timer.id} timer={timer} issue={issue}>
                <TimerComponents.ContextMenu>
                  <TimerComponents.WrapperCard>
                    <TimerComponents.NameField />
                    <TimerComponents.Counter />
                    <TimerComponents.ButtonWrapper>
                      <TimerComponents.ToggleButton />
                      <TimerComponents.DoneButton canLogTime={canLogTime} />
                    </TimerComponents.ButtonWrapper>
                  </TimerComponents.WrapperCard>
                </TimerComponents.ContextMenu>
              </TimerComponents.Root>
            ))}
          </div>
        )}

        <div className="absolute top-2 right-2 flex items-start justify-end gap-x-2">
          {localIssue.pinned && (
            <HelpTooltip message={formatMessage({ id: "issues.issue.pinned" })}>
              <PinIcon className="size-3.5 rotate-30 fill-current text-muted-foreground/30 focus:outline-hidden" tabIndex={-1} />
            </HelpTooltip>
          )}
          {!assignedToMe && (
            <HelpTooltip message={formatMessage({ id: "issues.issue.not-assigned-to-me" })}>
              <UserIcon className="size-3.5 fill-current text-muted-foreground/30 focus:outline-hidden" tabIndex={-1} />
            </HelpTooltip>
          )}
        </div>
      </ToggleableCard>
    </IssueContextMenu>
  );
};

export const IssueSkeleton = () => {
  const { settings } = useSettings();

  return (
    <ToggleableCard className="flex flex-col gap-1 p-1">
      <IssueTitleSkeleton />
      <div className="flex h-7 items-center justify-between gap-x-2">
        <div className="flex min-h-5.5 min-w-0 flex-1 items-center gap-x-2">
          {settings.style.showIssueDoneRatio && <Skeleton className="h-5.5 w-20 rounded-sm" />}
          {settings.style.showIssueStatus && <Skeleton className="h-5 w-14 rounded-4xl" />}
        </div>
        <TimerComponents.Wrapper>
          <TimerComponents.Skeleton.Counter />
          <TimerComponents.ButtonWrapper>
            <TimerComponents.Skeleton.ToggleButton />
            <TimerComponents.Skeleton.DoneButton />
          </TimerComponents.ButtonWrapper>
        </TimerComponents.Wrapper>
      </div>
    </ToggleableCard>
  );
};

export default Issue;
