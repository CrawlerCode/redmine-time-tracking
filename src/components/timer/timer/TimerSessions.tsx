import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { calculateActiveSessionElapsedTime } from "@/hooks/useTimers";
import { formatTimer } from "@/utils/date";
import clsx from "clsx";
import { isToday } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useInterval } from "usehooks-ts";
import { useTimerContext } from "./TimerRoot";

export const TimerSessions = () => {
  const { formatDateTimeRange, formatMessage } = useIntl();
  const { timer } = useTimerContext();

  const [removingSessionId, setRemovingSessionId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (!timer.activeSession && timer.sessions.length === 0) return null;

  const allSessions = [...(timer.activeSession ? [{ id: "active", start: timer.activeSession.start, end: timer.activeSession.start }] : []), ...timer.sessions.toReversed()];
  const visibleSessions = expanded ? allSessions : allSessions.slice(0, 3);
  const hiddenCount = allSessions.length - 3;

  return (
    <>
      <div className="flex flex-col gap-y-0.5">
        {visibleSessions.map((session) => (
          <div key={session.id} className="text-muted-foreground flex items-center gap-2">
            <span className="grow">
              {formatDateTimeRange(session.start, session.end, {
                dateStyle: isToday(session.start) ? undefined : "short",
                timeStyle: "medium",
              })}
            </span>
            <span
              className={clsx({
                "font-semibold": session.id === "active",
              })}
            >
              {session.id === "active" ? <ActiveSessionElapsedTime /> : formatTimer(session.end - session.start)}
            </span>
            <Button type="button" variant="ghost" size="icon-xs" className="hover:text-destructive" onClick={() => setRemovingSessionId(session.id)} tabIndex={-1}>
              <TrashIcon className="size-3.5" />
            </Button>
          </div>
        ))}
        {hiddenCount > 0 && (
          <button type="button" tabIndex={-1} className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs" onClick={() => setExpanded((v) => !v)}>
            {expanded ? <ChevronUpIcon className="size-3" /> : <ChevronDownIcon className="size-3" />}
            <span>{expanded ? formatMessage({ id: "timer.sessions.show-less" }) : formatMessage({ id: "timer.sessions.show-more" }, { count: hiddenCount })}</span>
          </button>
        )}
      </div>

      {removingSessionId && <RemoveSessionDialog sessionId={removingSessionId} onClose={() => setRemovingSessionId(null)} />}
    </>
  );
};

const ActiveSessionElapsedTime = () => {
  const { timer } = useTimerContext();

  const [elapsedTime, setElapsedTime] = useState(() => calculateActiveSessionElapsedTime(timer));
  useInterval(() => setElapsedTime(calculateActiveSessionElapsedTime(timer)), timer.activeSession ? 1000 : null);

  return formatTimer(elapsedTime);
};

const RemoveSessionDialog = ({ sessionId, onClose }: { sessionId: string; onClose: () => void }) => {
  const { formatDateTimeRange, formatMessage } = useIntl();
  const { timer, timerApi, totalElapsedTime } = useTimerContext();

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

        <div className="bg-muted/40 border-border/60 space-y-2 rounded-md border px-3 py-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{formatMessage({ id: "timer.modal.remove-session.current" })}</span>
            <span>{formatTimer(totalElapsedTime)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground/80 min-w-0 text-xs">
              {formatDateTimeRange(session.start, session.end, {
                dateStyle: isToday(session.start) ? undefined : "short",
                timeStyle: "medium",
              })}
            </span>
            <span className="text-destructive">-{formatTimer(duration)}</span>
          </div>
          <div className="border-border/60 flex items-center justify-between gap-3 border-t pt-2">
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
