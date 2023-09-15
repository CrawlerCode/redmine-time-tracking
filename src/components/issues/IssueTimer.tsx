import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import { formatTime, roundTimeNearestQuarterHour } from "../../utils/date";
import EditTimer from "./EditTimer";

export type IssueTimerData = {
  active: boolean;
  start?: number;
  time: number;
};

export type TimerActions = {
  onStart: () => void;
  onPause: (time: number) => void;
  onStop: () => void;
  onOverrideTime: (time: number) => void;
  onDoneTimer: (time: number) => void;
};

type PropTypes = {
  issue: TIssue;
  data: IssueTimerData;
} & TimerActions;

export type TimerRef = {
  timer: number;
  isInEditMode: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  editTimer: () => void;
};

const IssueTimer = forwardRef(({ issue, data: { active, time, start }, onStart, onPause, onStop, onOverrideTime, onDoneTimer }: PropTypes, ref: ForwardedRef<TimerRef>) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const [editMode, setEditMode] = useState(false);

  const [timer, setTimer] = useState(calcTime(time, start));

  useEffect(() => {
    setTimer(calcTime(time, start));
    if (active && start) {
      const timerInterval = setInterval(() => {
        setTimer(calcTime(time, start));
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [active, time, start]);

  useImperativeHandle(
    ref,
    () =>
      ({
        timer: timer,
        isInEditMode: editMode,
        startTimer: () => {
          onStart();
        },
        pauseTimer: () => {
          onPause(timer);
        },
        editTimer: () => {
          setEditMode(true);
        },
      }) satisfies TimerRef,
    [timer, editMode, onStart, onPause]
  );

  return (
    <div className="flex items-center justify-end gap-x-3">
      {(editMode && (
        <EditTimer
          initTime={timer}
          onOverrideTime={(time) => {
            onOverrideTime(time);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      )) || (
        <>
          <Tooltip id={`tooltip-edit-timer-${issue.id}`} place="top" delayShow={700} content={formatMessage({ id: "issues.timer.action.edit.tooltip" })} className="italic" />
          <span
            className={clsx("text-lg", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", active && "font-semibold")}
            onDoubleClick={() => setEditMode(true)}
            data-tooltip-id={`tooltip-edit-timer-${issue.id}`}
          >
            {formatTime(timer)}
          </span>
        </>
      )}

      {!active ? (
        <>
          <Tooltip id={`tooltip-start-timer-${issue.id}`} place="left" delayShow={700} className="italic">
            <FormattedMessage id="issues.timer.action.start.tooltip" />
          </Tooltip>
          <FontAwesomeIcon icon={faPlay} size="2x" className="cursor-pointer text-green-500 focus:outline-none" onClick={onStart} data-tooltip-id={`tooltip-start-timer-${issue.id}`} tabIndex={-1} />
        </>
      ) : (
        <>
          <Tooltip id={`tooltip-pause-timer-${issue.id}`} place="left" delayShow={700} className="italic">
            <FormattedMessage id="issues.timer.action.pause.tooltip" />
          </Tooltip>
          <FontAwesomeIcon
            icon={faPause}
            size="2x"
            className="cursor-pointer text-red-500 focus:outline-none"
            onClick={() => onPause(timer)}
            data-tooltip-id={`tooltip-pause-timer-${issue.id}`}
            tabIndex={-1}
          />
        </>
      )}

      <Tooltip id={`tooltip-stop-timer-${issue.id}`} place="top" delayShow={700} content={formatMessage({ id: "issues.timer.action.stop.tooltip" })} className="italic" />
      <FontAwesomeIcon icon={faStop} size="2x" className="cursor-pointer text-red-500 focus:outline-none" onClick={onStop} data-tooltip-id={`tooltip-stop-timer-${issue.id}`} tabIndex={-1} />

      <Tooltip id={`tooltip-done-timer-${issue.id}`} place="bottom" delayShow={700} content={formatMessage({ id: "issues.timer.action.add-spent-time.tooltip" })} className="z-10 italic" />
      <FontAwesomeIcon
        icon={faCircleCheck}
        size="2x"
        className="cursor-pointer text-green-600 focus:outline-none"
        onClick={() => onDoneTimer(settings.options.roundTimeNearestQuarterHour ? roundTimeNearestQuarterHour(timer) : timer)}
        data-tooltip-id={`tooltip-done-timer-${issue.id}`}
        tabIndex={-1}
      />
    </div>
  );
});

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

IssueTimer.displayName = "IssueTimer";

export default IssueTimer;
