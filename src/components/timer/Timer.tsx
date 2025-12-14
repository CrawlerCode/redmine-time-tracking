import clsx from "clsx";
import { BadgeCheckIcon, TimerIcon, TimerOffIcon, TimerResetIcon } from "lucide-react";
import { ComponentProps, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import { formatTimer, roundTimeNearestInterval } from "../../utils/date";
import HelpTooltip from "../general/HelpTooltip";
import IssueTitle from "../issue/IssueTitle";
import CreateTimeEntryModal from "../time-entry/CreateTimeEntryModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import EditTimer from "./EditTimer";
import TimerContextMenu from "./TimerContextMenu";

type TimerWrapperPropTypes = {
  variant?: "inner" | "standalone" | "expanded" | "full";
  timer: TimerController;
  issue?: TIssue;
  issuePriorityType?: PriorityType;
};

const TimerWrapper = ({ variant = "inner", timer, issue, issuePriorityType }: TimerWrapperPropTypes) => {
  const timerRef = useRef<TimerRef>(null);

  const [createTimeEntryHours, setCreateTimeEntryHours] = useState<number | undefined>(undefined);

  const createTimeEntryComponent = createTimeEntryHours !== undefined && issue && (
    <CreateTimeEntryModal
      issue={issue}
      initialValues={{
        done_ratio: issue.done_ratio,
        hours: createTimeEntryHours,
        comments: timer.name,
      }}
      onClose={() => setCreateTimeEntryHours(undefined)}
      onSuccess={() => {
        setCreateTimeEntryHours(undefined);
        timer.deleteTimer();
      }}
    />
  );

  switch (variant) {
    case "inner":
      return (
        <>
          <Timer timer={timer} ref={timerRef} onTimerDone={(hours) => setCreateTimeEntryHours(hours)} />
          {createTimeEntryComponent}
        </>
      );
    case "standalone":
    case "expanded":
      return (
        <>
          <TimerContextMenu timer={timer} onEdit={() => timerRef.current?.editTimer()}>
            <Timer
              timer={timer}
              ref={timerRef}
              displayNameField={variant === "expanded"}
              className={clsx(
                "bg-card rounded-lg border border-gray-200 p-1 px-1.5 dark:border-gray-700",
                "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
              )}
              tabIndex={1}
              // On "Enter" or "Space" => toggle timer
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.code === "Space") && e.currentTarget === document.activeElement) {
                  timer.toggleTimer();
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              onTimerDone={(hours) => setCreateTimeEntryHours(hours)}
            />
          </TimerContextMenu>
          {createTimeEntryComponent}
        </>
      );
    case "full":
      return (
        <>
          <TimerContextMenu timer={timer} onEdit={() => timerRef.current?.editTimer()}>
            <div
              role="listitem"
              data-type="timer"
              className={clsxm(
                "bg-card relative flex w-full flex-col gap-1 rounded-lg p-1",
                "border border-gray-200 dark:border-gray-700",
                "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
              )}
              tabIndex={1}
              // On "Enter" or "Space" => toggle timer
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.code === "Space") {
                  timer.toggleTimer();
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {issue ? <IssueTitle issue={issue} priorityType={issuePriorityType} /> : <h1 className="truncate text-gray-500 line-through">#{timer.issueId}</h1>}
              <Timer timer={timer} ref={timerRef} displayNameField onTimerDone={(hours) => setCreateTimeEntryHours(hours)} />
            </div>
          </TimerContextMenu>
          {createTimeEntryComponent}
        </>
      );
  }
};

type TimerPropTypes = {
  timer: TimerController;
  onTimerDone: (hours: number) => void;
  ref?: Ref<TimerRef>;
  displayNameField?: boolean;
} & Omit<ComponentProps<"div">, "ref">;

type TimerRef = {
  editTimer: () => void;
};

const Timer = ({ timer, onTimerDone, ref, displayNameField, ...props }: TimerPropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const [editMode, setEditMode] = useState(false);

  const [currenTime, setCurrentTime] = useState(timer.getElapsedTime());

  useEffect(() => {
    setCurrentTime(timer.getElapsedTime());
    if (timer.isActive) {
      const timerInterval = setInterval(() => {
        setCurrentTime(timer.getElapsedTime());
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timer]);

  useImperativeHandle(
    ref,
    () =>
      ({
        editTimer: () => {
          setEditMode(true);
        },
      }) satisfies TimerRef,
    []
  );

  const [confirmResetModal, setConfirmResetModal] = useState(false);

  return (
    <>
      <div {...props} role="listitem" data-type="timer" className={clsxm("flex items-center gap-x-3", props.className)}>
        {displayNameField && (
          <input
            type="text"
            className="placeholder:text-muted-foreground min-w-0 grow truncate bg-transparent text-gray-600 placeholder:italic focus:outline-hidden dark:text-gray-200"
            value={timer.name}
            placeholder={formatMessage({ id: "timer.unnamed-timer" })}
            tabIndex={-1}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => timer.setName(e.target.value)}
          />
        )}

        {(editMode && (
          <EditTimer
            initTime={currenTime}
            onOverrideTime={(time) => {
              setEditMode(false);
              timer.setElapsedTime(time);
            }}
            onCancel={() => setEditMode(false)}
          />
        )) || (
          <HelpTooltip message={formatMessage({ id: "issues.timer.action.edit.tooltip" })}>
            <span className={clsx("-my-1 text-lg", currenTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", timer.isActive && "font-bold")} onDoubleClick={() => setEditMode(true)}>
              {formatTimer(currenTime)}
            </span>
          </HelpTooltip>
        )}

        {!timer.isActive ? (
          <HelpTooltip message={formatMessage({ id: "issues.timer.action.start.tooltip" })}>
            <TimerIcon role="button" data-type="start-timer" className="size-6 cursor-pointer text-green-500 focus:outline-hidden" onClick={timer.startTimer} tabIndex={-1} />
          </HelpTooltip>
        ) : (
          <HelpTooltip message={formatMessage({ id: "issues.timer.action.pause.tooltip" })}>
            <TimerOffIcon role="button" data-type="pause-timer" className="size-6 cursor-pointer text-red-500 focus:outline-hidden" onClick={timer.pauseTimer} tabIndex={-1} />
          </HelpTooltip>
        )}

        <HelpTooltip message={formatMessage({ id: "issues.timer.action.reset.tooltip" })}>
          <TimerResetIcon role="button" data-type="reset-timer" className="size-6 cursor-pointer text-red-500 focus:outline-hidden" onClick={() => setConfirmResetModal(true)} tabIndex={-1} />
        </HelpTooltip>

        <HelpTooltip message={formatMessage({ id: "issues.timer.action.add-spent-time.tooltip" })}>
          <BadgeCheckIcon
            role="button"
            data-type="done-timer"
            className="size-6 cursor-pointer text-green-600 focus:outline-hidden"
            onClick={() => {
              const time = settings.features.roundToNearestInterval ? roundTimeNearestInterval(currenTime, settings.features.roundingInterval) : currenTime;
              const hours = Number((time / 1000 / 60 / 60).toFixed(2));
              onTimerDone(hours);
            }}
            tabIndex={-1}
          />
        </HelpTooltip>
      </div>

      {confirmResetModal && (
        <AlertDialog open onOpenChange={() => setConfirmResetModal(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{formatMessage({ id: "issues.modal.reset-timer.title" })}</AlertDialogTitle>
              <AlertDialogDescription>{formatMessage({ id: "issues.modal.reset-timer.message" })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{formatMessage({ id: "issues.modal.reset-timer.cancel" })}</AlertDialogCancel>
              <AlertDialogAction onClick={() => timer.resetTimer()}>{formatMessage({ id: "issues.modal.reset-timer.reset" })}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default TimerWrapper;
