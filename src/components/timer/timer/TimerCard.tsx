import { ToggleableCard } from "@/components/general/ToggleableCard";
import { IssueTitle, IssueTitleFallback, IssueTitleSkeleton } from "@/components/issue/IssueTitle";
import { TimerButtonWrapper } from "@/components/timer/timer/TimerButtonWrapper";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/provider/PermissionsProvider";
import { useSettings } from "@/provider/SettingsProvider";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { ComponentProps } from "react";
import { PriorityType } from "../../../api/redmine/hooks/useRedmineIssuePriorities";
import { TimerCounter, TimerCounterSkeleton } from "./TimerCounter";
import { TimerDoneButton, TimerDoneButtonSkeleton } from "./TimerDoneButton";
import { TimerNameField, TimerNameFieldSkeleton } from "./TimerNameField";
import { useTimerContext } from "./TimerRoot";
import { TimerSessions, TimerSessionsSkeleton } from "./TimerSessions";
import { TimerToggleButton, TimerToggleButtonSkeleton } from "./TimerToggleButton";
import { TimerWrapper } from "./TimerWrapper";

export const TimerCard = ({ priorityType, className, ...props }: ComponentProps<"div"> & { priorityType?: PriorityType }) => {
  const { settings } = useSettings();
  const { hasProjectPermission } = usePermissions();

  const timerApi = useTimerApi();
  const { timer, issue } = useTimerContext();

  return (
    <ToggleableCard role="listitem" data-type="timer-card" {...props} className={cn("flex flex-col overflow-hidden", className)} onToggle={() => timerApi.toggleTimer(timer)}>
      <div className="flex flex-col gap-1 p-1">
        {issue ? <IssueTitle issue={issue} priorityType={priorityType} /> : <IssueTitleFallback issueId={timer.issueId} />}
        <TimerWrapper>
          <TimerNameField />
          <TimerCounter />
          <TimerButtonWrapper>
            <TimerToggleButton />
            <TimerDoneButton canLogTime={issue ? hasProjectPermission(issue.project.id, "log_time") : false} />
          </TimerButtonWrapper>
        </TimerWrapper>
      </div>
      {settings.style.showSessions && <TimerSessions />}
    </ToggleableCard>
  );
};

export const TimerCardSkeleton = () => {
  const { settings } = useSettings();

  return (
    <ToggleableCard className="flex flex-col overflow-hidden">
      <div className="flex flex-col gap-1 p-1">
        <IssueTitleSkeleton />
        <TimerWrapper>
          <TimerNameFieldSkeleton />
          <TimerCounterSkeleton />
          <TimerButtonWrapper>
            <TimerToggleButtonSkeleton />
            <TimerDoneButtonSkeleton />
          </TimerButtonWrapper>
        </TimerWrapper>
      </div>
      {settings.style.showSessions && <TimerSessionsSkeleton />}
    </ToggleableCard>
  );
};
