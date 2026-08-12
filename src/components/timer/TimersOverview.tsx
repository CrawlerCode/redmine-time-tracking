import { useRedmineCurrentUser } from "@/api/redmine/hooks/useRedmineCurrentUser";
import { useRedmineTimeEntries } from "@/api/redmine/hooks/useRedmineTimeEntries";
import { TIssue } from "@/api/redmine/types";
import TimeEntry from "@/components/time-entry/TimeEntry";
import SubmitTimersModal from "@/components/timer/SubmitTimersModal";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useFormatHours from "@/hooks/useFormatHours";
import { calculateTimerTotalElapsedTime, Timer } from "@/hooks/useTimers";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/provider/PermissionsProvider";
import { formatTimer, roundHours } from "@/utils/date";
import { useInterval } from "@mantine/hooks";
import { startOfDay } from "date-fns";
import { BadgeCheckIcon } from "lucide-react";
import { ReactNode, useEffect, useEffectEvent, useState } from "react";
import { useIntl } from "react-intl";

type PropTypes = {
  timers: Timer[];
  issues: TIssue[];
  className?: string;
};

const calculateTotalElapsedTime = (timers: Timer[]) => timers.reduce((sum, timer) => sum + calculateTimerTotalElapsedTime(timer), 0);

const getGreetingPeriod = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
};

const TimersOverview = ({ timers, issues, className }: PropTypes) => {
  const { formatMessage } = useIntl();
  const formatHours = useFormatHours();

  const [totalElapsedTime, setTotalElapsedTime] = useState(() => calculateTotalElapsedTime(timers));

  const updateTotalElapsedTime = useEffectEvent(() => setTotalElapsedTime(calculateTotalElapsedTime(timers)));
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => updateTotalElapsedTime(), [timers]);

  const activeTimerCount = timers.filter((timer) => timer.activeSession).length;
  const interval = useInterval(() => setTotalElapsedTime(calculateTotalElapsedTime(timers)), 1000);
  const manageInterval = useEffectEvent((active: boolean) => (active ? interval.start() : interval.stop()));
  useEffect(() => manageInterval(activeTimerCount > 0), [activeTimerCount]);

  const { data: me } = useRedmineCurrentUser();

  const { hasProjectPermission } = usePermissions();
  const timerItems = timers.map((timer) => ({
    timer,
    issue: issues.find((issue) => issue.id === timer.issueId),
  }));
  const canSubmitTimers = timerItems.some(({ timer, issue }) => issue && hasProjectPermission(issue.project.id, "log_time") && calculateTimerTotalElapsedTime(timer) > 0);

  const [isSubmitTimersModalOpen, setIsSubmitTimersModalOpen] = useState(false);

  const today = startOfDay(new Date());
  const myTimeEntriesQuery = useRedmineTimeEntries({
    userId: "me",
    from: today,
    to: today,
  });
  const timeEntries = myTimeEntriesQuery.data ?? [];
  const totalTimeEntriesHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <>
      <Card size="sm" className={className}>
        <CardHeader>
          <CardTitle className="flex flex-col gap-0.5">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{formatMessage({ id: `timers.overview.greeting.period.${getGreetingPeriod()}` })}</span>
            {me && <span className="truncate text-xl leading-tight font-bold">{me.firstname?.trim()}</span>}
          </CardTitle>
          <CardAction>
            <Button size="sm" disabled={!canSubmitTimers} onClick={() => setIsSubmitTimersModalOpen(true)}>
              <BadgeCheckIcon />
              {formatMessage({ id: "timers.overview.submit-all" })}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <Stat label={formatMessage({ id: "timers.overview.tracked" })} value={formatHours(roundHours(totalTimeEntriesHours))} classNames={{ dot: "bg-green-600 dark:bg-green-500" }} />
            <Stat
              label={formatMessage({ id: "timers.overview.timers" })}
              value={formatTimer(totalElapsedTime)}
              classNames={{
                dot: "bg-yellow-500",
              }}
            />
          </div>
          <TimeEntry
            size="md"
            entries={timeEntries}
            preview={timerItems.map(({ timer, issue }) => ({
              hours: calculateTimerTotalElapsedTime(timer) / 1000 / 60 / 60,
              name: timer.name ?? (issue ? `${issue.tracker.name} #${issue.id} ${issue.subject}` : `#${timer.issueId}`),
            }))}
          />
        </CardContent>
      </Card>

      {isSubmitTimersModalOpen && <SubmitTimersModal timers={timers} issues={issues} onClose={() => setIsSubmitTimersModalOpen(false)} />}
    </>
  );
};

const Stat = ({
  label,
  value,
  classNames,
}: {
  label: string;
  value: ReactNode;
  classNames?: {
    dot?: string;
    value?: string;
  };
}) => (
  <div className="flex flex-col gap-0.5 rounded-lg bg-muted/40 p-3 ring-1 ring-foreground/10">
    <div className="flex items-center gap-x-1.5">
      <span className={cn("size-2 shrink-0 rounded-full bg-primary", classNames?.dot)} />
      <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
    </div>
    <p className={cn("truncate text-2xl leading-tight font-semibold tabular-nums", classNames?.value)}>{value}</p>
  </div>
);

const StatSkeleton = () => (
  <div className="flex flex-col gap-0.5 rounded-lg bg-muted/40 p-3 ring-1 ring-foreground/10">
    <Skeleton className="h-4.5 w-24" />
    <Skeleton className="h-8.5 w-20" />
  </div>
);

export const TimersOverviewSkeleton = ({ className }: { className?: string }) => (
  <Card size="sm" className={className}>
    <CardHeader>
      <CardTitle className="flex flex-col gap-0.5">
        <Skeleton className="h-4.5 w-28" />
        <Skeleton className="h-7 w-32" />
      </CardTitle>
      <CardAction>
        <Skeleton className="h-7 w-24" />
      </CardAction>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <StatSkeleton />
        <StatSkeleton />
      </div>
      <Skeleton className="h-5.5 w-full" />
    </CardContent>
  </Card>
);

export default TimersOverview;
