import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateActiveSessionElapsedTime } from "@/hooks/useTimers";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { formatTimer } from "@/utils/date";
import { useInterval } from "@mantine/hooks";
import clsx from "clsx";
import { isToday } from "date-fns";
import { ChevronDownIcon, LayersIcon, TrashIcon } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerSessions = () => {
  const { formatDateTimeRange, formatMessage } = useIntl();
  const { timer } = useTimerContext();

  const [removingSessionId, setRemovingSessionId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (!timer.activeSession && timer.sessions.length === 0) return null;

  const allSessions = [...(timer.activeSession ? [{ id: "active", start: timer.activeSession.start, end: timer.activeSession.start }] : []), ...timer.sessions.toReversed()];

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer items-center justify-between gap-2 border-t border-border/60 px-3 py-1 text-left transition-colors hover:bg-secondary/50"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <LayersIcon className="size-3.5 shrink-0" />
          <span className="truncate">{formatMessage({ id: "timer.sessions.summary" }, { count: allSessions.length })}</span>
        </span>
        <ChevronDownIcon className={clsx("size-4 shrink-0 text-muted-foreground transition-transform", { "rotate-180": expanded })} />
      </button>

      {expanded && (
        <ul className="border-t border-border/60 bg-secondary/20 px-2 py-1">
          {allSessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between gap-2 py-0.5">
              <span className="truncate text-xs text-muted-foreground">
                {formatDateTimeRange(session.start, session.end, {
                  dateStyle: isToday(session.start) ? undefined : "short",
                  timeStyle: "medium",
                })}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <span className={clsx("text-xs text-foreground", { "font-semibold": session.id === "active" })}>
                  {session.id === "active" ? <ActiveSessionElapsedTime /> : formatTimer(session.end - session.start)}
                </span>
                <Button type="button" variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-destructive" onClick={() => setRemovingSessionId(session.id)} tabIndex={-1}>
                  <TrashIcon className="size-3.5" />
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {removingSessionId && <RemoveSessionDialog sessionId={removingSessionId} onClose={() => setRemovingSessionId(null)} />}
    </>
  );
};

const ActiveSessionElapsedTime = () => {
  const { timer } = useTimerContext();

  const [elapsedTime, setElapsedTime] = useState(() => calculateActiveSessionElapsedTime(timer));

  const interval = useInterval(() => setElapsedTime(calculateActiveSessionElapsedTime(timer)), 1000);
  const manageInterval = useEffectEvent((active: boolean) => (active ? interval.start() : interval.stop()));
  useEffect(() => manageInterval(!!timer.activeSession), [timer.activeSession]);

  return formatTimer(elapsedTime);
};

const RemoveSessionDialog = ({ sessionId, onClose }: { sessionId: string; onClose: () => void }) => {
  const { formatDateTimeRange, formatMessage } = useIntl();
  const timerApi = useTimerApi();
  const { timer, totalElapsedTime } = useTimerContext();

  // eslint-disable-next-line react-hooks/purity
  const session = sessionId === "active" ? (timer.activeSession ? { id: "active", start: timer.activeSession.start, end: Date.now() } : undefined) : timer.sessions.find((s) => s.id === sessionId);
  if (!session) return null;

  const duration = session.end - session.start;
  const resultingTimer = Math.max(0, totalElapsedTime - duration);

  return (
    <AlertDialog open onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{formatMessage({ id: "timer.modal.remove-session.title" })}</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-2 rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{formatMessage({ id: "timer.modal.remove-session.current" })}</span>
            <span>{formatTimer(totalElapsedTime)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0 text-xs text-muted-foreground/80">
              {formatDateTimeRange(session.start, session.end, {
                dateStyle: isToday(session.start) ? undefined : "short",
                timeStyle: "medium",
              })}
            </span>
            <span className="text-destructive">-{formatTimer(duration)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2">
            <span className="text-muted-foreground">{formatMessage({ id: "timer.modal.remove-session.result" })}</span>
            <span>{formatTimer(resultingTimer)}</span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>{formatMessage({ id: "timer.modal.remove-session.cancel" })}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={async () => {
              await timerApi.removeTimerSession(timer, sessionId);
            }}
          >
            {formatMessage({ id: "timer.modal.remove-session.submit" })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const TimerSessionsSkeleton = () => (
  <div className="flex items-center justify-between gap-2 border-t border-border/60 px-3 py-1">
    <Skeleton className="h-4 w-40" />
    <Skeleton className="size-4" />
  </div>
);
