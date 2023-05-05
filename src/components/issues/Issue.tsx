import { faCheck, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import EditTime from "./EditTime";

type PropTypes = {
  issue: TIssue;
  isActive: boolean;
  time: number;
  start?: number;
  onStart: () => void;
  onStop: (time: number) => void;
  onClear: () => void;
  onDone: (time: number) => void;
  onOverrideTime: (time: number) => void;
};

const Issue = ({ issue, isActive, time, start, onStart, onStop, onClear, onDone, onOverrideTime }: PropTypes) => {
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
            onStop(timer);
          } else {
            onStart();
          }
        }
      }}
    >
      <h1 className="mb-1 truncate">
        <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" className="text-blue-500 hover:underline" tabIndex={-1}>
          #{issue.id}
        </a>{" "}
        {issue.subject}
      </h1>
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
            <span className={clsx("text-lg", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", isActive && "font-semibold")} onDoubleClick={() => setEditTime(timer)}>
              {formatTime(timer / 1000)}
            </span>
          )}
          {!isActive ? <FontAwesomeIcon icon={faPlay} size="2x" className="text-green-500 cursor-pointer" onClick={onStart} /> : <FontAwesomeIcon icon={faPause} size="2x" className="text-red-500 cursor-pointer" onClick={() => onStop(timer)} />}
          <FontAwesomeIcon icon={faStop} size="2x" className="text-red-500 cursor-pointer" onClick={onClear} />
          <FontAwesomeIcon icon={faCheck} size="2x" className="text-green-600 cursor-pointer" onClick={() => onDone(timer)} />
        </div>
      </div>
    </div>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "";

  let s = Math.floor(seconds % 60);
  let m = Math.floor((seconds / 60) % 60);
  let h = Math.floor(seconds / 60 / 60);
  return `${h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
};

export default Issue;
