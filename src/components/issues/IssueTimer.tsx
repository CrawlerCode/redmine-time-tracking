import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
      } satisfies TimerRef),
    [timer, editMode, onStart, onPause]
  );

  return (
    <div className="flex items-center gap-x-3 justify-end">
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
          <Tooltip id="tooltip-edit-timer" place="top" delayShow={700} content="Double-click to edit" className="italic" />
          <span className={clsx("text-lg", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", active && "font-semibold")} onDoubleClick={() => setEditMode(true)} data-tooltip-id="tooltip-edit-timer">
            {formatTime(timer)}
          </span>
        </>
      )}
      {!active ? (
        <>
          <Tooltip id="tooltip-start-timer" place="left" delayShow={700} content="Click to start timer" className="italic" />
          <FontAwesomeIcon icon={faPlay} size="2x" className="text-green-500 cursor-pointer focus:outline-none" onClick={onStart} data-tooltip-id="tooltip-start-timer" tabIndex={-1} />
        </>
      ) : (
        <>
          <Tooltip id="tooltip-pause-timer" place="left" delayShow={700} content="Click to pause timer" className="italic" />
          <FontAwesomeIcon icon={faPause} size="2x" className="text-red-500 cursor-pointer focus:outline-none" onClick={() => onPause(timer)} data-tooltip-id="tooltip-pause-timer" tabIndex={-1} />
        </>
      )}
      <Tooltip id="tooltip-stop-timer" place="top" delayShow={700} content="Click to stop timer" className="italic" />
      <FontAwesomeIcon icon={faStop} size="2x" className="text-red-500 cursor-pointer focus:outline-none" onClick={onStop} data-tooltip-id="tooltip-stop-timer" tabIndex={-1} />
      <Tooltip id={`tooltip-done-timer-${issue.id}`} place="bottom" delayShow={700} content="Click to add spent time" className="z-10 italic" />
      <FontAwesomeIcon
        icon={faCircleCheck}
        size="2x"
        className="text-green-600 cursor-pointer focus:outline-none"
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
