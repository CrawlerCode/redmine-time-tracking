import { faCheck, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import EditTime from "./EditTime";

type PropTypes = {
  issue: TIssue;
  isActive: boolean;
  time: number;
  start?: number;
  onStart: () => void;
  onPause: (time: number) => void;
  onStop: () => void;
  onDone: (time: number) => void;
  onOverrideTime: (time: number) => void;
};

const Issue = ({ issue, isActive, time, start, onStart, onPause, onStop, onDone, onOverrideTime }: PropTypes) => {
  const { settings } = useSettings();

  const [timer, setTimer] = useState(calcTime(time, start));

  useEffect(() => {
    setTimer(calcTime(time, start));
    if (isActive && start) {
      const timerInterval = setInterval(() => {
        setTimer(calcTime(time, start));
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [isActive, time, start]);

  const [editTime, setEditTime] = useState<number | undefined>(undefined);

  return (
    <div
      className={clsx(
        "block w-full p-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:shadow-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 relative",
        "focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800"
      )}
      tabIndex={1}
      /**
       * On "Space"/"Enter" => toggle timer
       */
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.code === "Space") {
          if (isActive) {
            onPause(timer);
          } else {
            onStart();
          }
        }
      }}
    >
      <h1 className="mb-1 truncate">
        <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" className="text-blue-500 hover:underline" data-tooltip-id={`tooltip-issue-${issue.id}`} tabIndex={-1}>
          #{issue.id}
        </a>{" "}
        {issue.subject}
      </h1>
      <Tooltip id={`tooltip-issue-${issue.id}`} place="right" className="z-10 opacity-100">
        <div className="relative max-w-[210px]">
          <table className="text-sm text-left text-gray-300">
            <caption className="text-mg font-semibold text-left mb-3">
              {issue.tracker.name} #{issue.id}
              <p className="mt-1 text-xs font-normal max-w-[180px] truncate">{issue.subject}</p>
            </caption>
            <tbody>
              <tr>
                <th className="pr-2 font-medium whitespace-nowrap">Status:</th>
                <td>{issue.status.name}</td>
              </tr>
              <tr>
                <th className="pr-2 font-medium whitespace-nowrap">Priority:</th>
                <td>{issue.priority.name}</td>
              </tr>
              <tr>
                <th className="pr-2 font-medium whitespace-nowrap">Assignee:</th>
                <td>{issue.assigned_to.name}</td>
              </tr>
              {issue.estimated_hours && (
                <tr>
                  <th className="pr-2 font-medium whitespace-nowrap">Estimated time:</th>
                  <td>{formatHours(issue.estimated_hours)} h</td>
                </tr>
              )}
              <tr>
                <th className="pr-2 font-medium whitespace-nowrap">Spent time:</th>
                <td>{formatHours(issue.spent_hours)} h</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="italic mt-5">Click to open issue</p>
      </Tooltip>
      <div className="flex flex-row items-center justify-between gap-x-2">
        <div className="w-[80px] bg-[#eeeeee]">
          <div className="bg-[#bae0ba] text-xs font-medium text-gray-600 text-center leading-none p-1 select-none" style={{ width: `${issue.done_ratio}%` }}>
            {issue.done_ratio}%
          </div>
        </div>
        <div className="flex items-center gap-x-3 mr-3">
          {(editTime !== undefined && (
            <EditTime
              initTime={editTime}
              onOverrideTime={(time) => {
                onOverrideTime(time);
                setEditTime(undefined);
              }}
              onCancel={() => setEditTime(undefined)}
            />
          )) || (
            <span className={clsx("text-lg", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", isActive && "font-semibold")} onDoubleClick={() => setEditTime(timer)} data-tooltip-id="tooltip-edit-timer">
              {formatTime(timer / 1000)}
            </span>
          )}
          <Tooltip id="tooltip-edit-timer" place="top" delayShow={700} content="Double click to edit" className="italic" />
          {!isActive ? (
            <FontAwesomeIcon icon={faPlay} size="2x" className="text-green-500 cursor-pointer focus:outline-none" onClick={onStart} data-tooltip-id="tooltip-start-timer" tabIndex={-1} />
          ) : (
            <FontAwesomeIcon icon={faPause} size="2x" className="text-red-500 cursor-pointer focus:outline-none" onClick={() => onPause(timer)} data-tooltip-id="tooltip-pause-timer" tabIndex={-1} />
          )}
          <FontAwesomeIcon icon={faStop} size="2x" className="text-red-500 cursor-pointer focus:outline-none" onClick={onStop} data-tooltip-id="tooltip-stop-timer" tabIndex={-1} />
          <FontAwesomeIcon icon={faCheck} size="2x" className="text-green-600 cursor-pointer focus:outline-none" onClick={() => onDone(timer)} data-tooltip-id={`tooltip-done-timer-${issue.id}`} tabIndex={-1} />
          <Tooltip id="tooltip-start-timer" place="left" delayShow={700} content="Click to start timer" className="italic" />
          <Tooltip id="tooltip-pause-timer" place="left" delayShow={700} content="Click to pause timer" className="italic" />
          <Tooltip id="tooltip-stop-timer" place="top" delayShow={700} content="Click to stop timer" className="italic" />
          <Tooltip id={`tooltip-done-timer-${issue.id}`} place="bottom" delayShow={700} className="z-10 italic opacity-75">
            Click to transfer <span className={clsx("text-xs", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", isActive && "font-semibold")}>{formatTime(timer / 1000)}</span> to Redmine issue
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "";

  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 60 / 60);
  return `${h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
};

const formatHours = (hours: number) => {
  if (isNaN(hours) || hours < 0) return "";

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m > 9 ? m : "0" + m}`;
};

export default Issue;
