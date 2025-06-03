import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ComponentProps, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import { formatTimer, roundTimeNearestInterval } from "../../utils/date";
import Button from "../general/Button";
import Modal from "../general/Modal";
import IssueTitle from "../issue/IssueTitle";
import CreateTimeEntryModal from "../time-entry/CreateTimeEntryModal";
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
                "rounded-lg border border-gray-200 bg-background p-0.5 px-1.5 hover:bg-background-hover dark:border-gray-700",
                "focus:outline-none focus:ring-4 focus:ring-primary-focus"
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
                "relative block w-full rounded-lg p-1",
                "focus:outline-none focus:ring-4 focus:ring-primary-focus",
                "border border-gray-200 bg-background hover:bg-background-hover dark:border-gray-700"
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
              {issue ? <IssueTitle issue={issue} priorityType={issuePriorityType} /> : <h1 className="mb-1 truncate">#{timer.issueId}</h1>}
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
            className="min-w-0 grow truncate bg-transparent text-gray-600 placeholder:italic placeholder:text-field-placeholder focus:outline-none dark:text-gray-200"
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
          <>
            {settings.style.showTooltips && (
              <Tooltip id={`tooltip-edit-timer-${timer.id}`} place="top" delayShow={700} content={formatMessage({ id: "issues.timer.action.edit.tooltip" })} className="italic" />
            )}
            <span
              className={clsx("text-lg", currenTime > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", timer.isActive && "font-bold")}
              onDoubleClick={() => setEditMode(true)}
              data-tooltip-id={`tooltip-edit-timer-${timer.id}`}
            >
              {formatTimer(currenTime)}
            </span>
          </>
        )}

        {!timer.isActive ? (
          <>
            {settings.style.showTooltips && (
              <Tooltip id={`tooltip-start-timer-${timer.id}`} place="left" delayShow={700} className="italic">
                <FormattedMessage id="issues.timer.action.start.tooltip" />
              </Tooltip>
            )}
            <FontAwesomeIcon
              role="button"
              data-type="start-timer"
              icon={faPlay}
              size="2x"
              className="cursor-pointer text-green-500 focus:outline-none"
              onClick={timer.startTimer}
              data-tooltip-id={`tooltip-start-timer-${timer.id}`}
              tabIndex={-1}
            />
          </>
        ) : (
          <>
            {settings.style.showTooltips && (
              <Tooltip id={`tooltip-pause-timer-${timer.id}`} place="left" delayShow={700} className="italic">
                <FormattedMessage id="issues.timer.action.pause.tooltip" />
              </Tooltip>
            )}
            <FontAwesomeIcon
              role="button"
              data-type="pause-timer"
              icon={faPause}
              size="2x"
              className="cursor-pointer text-red-500 focus:outline-none"
              onClick={timer.pauseTimer}
              data-tooltip-id={`tooltip-pause-timer-${timer.id}`}
              tabIndex={-1}
            />
          </>
        )}

        <>
          {settings.style.showTooltips && (
            <Tooltip id={`tooltip-reset-timer-${timer.id}`} place="top" delayShow={700} content={formatMessage({ id: "issues.timer.action.reset.tooltip" })} className="italic" />
          )}
          <FontAwesomeIcon
            role="button"
            data-type="reset-timer"
            icon={faStop}
            size="2x"
            className="cursor-pointer text-red-500 focus:outline-none"
            onClick={() => setConfirmResetModal(true)}
            data-tooltip-id={`tooltip-reset-timer-${timer.id}`}
            tabIndex={-1}
          />
        </>

        <>
          {settings.style.showTooltips && (
            <Tooltip id={`tooltip-done-timer-${timer.id}`} place="bottom" delayShow={700} content={formatMessage({ id: "issues.timer.action.add-spent-time.tooltip" })} className="z-10 italic" />
          )}
          <FontAwesomeIcon
            role="button"
            data-type="done-timer"
            icon={faCircleCheck}
            size="2x"
            className="cursor-pointer text-green-600 focus:outline-none"
            onClick={() => {
              const time = settings.features.roundToNearestInterval ? roundTimeNearestInterval(currenTime, settings.features.roundingInterval) : currenTime;
              const hours = Number((time / 1000 / 60 / 60).toFixed(2));
              onTimerDone(hours);
            }}
            data-tooltip-id={`tooltip-done-timer-${timer.id}`}
            tabIndex={-1}
          />
        </>
      </div>

      {confirmResetModal && (
        <Modal title={formatMessage({ id: "issues.modal.reset-timer.title" })} onClose={() => setConfirmResetModal(false)}>
          <p className="mb-5">
            <FormattedMessage id="issues.modal.reset-timer.message" />
          </p>
          <div className="flex items-end justify-between">
            <Button size="sm" variant="outline" onClick={() => setConfirmResetModal(false)}>
              <FormattedMessage id="issues.modal.reset-timer.cancel" />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setConfirmResetModal(false);
                timer.resetTimer();
              }}
              autoFocus
            >
              <FormattedMessage id="issues.modal.reset-timer.reset" />
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TimerWrapper;
