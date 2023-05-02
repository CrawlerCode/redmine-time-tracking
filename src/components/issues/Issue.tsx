import { faCheck, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Issue } from "../../types/redmine";

type PropTypes = {
  issue: Issue;
  isActive: boolean;
  time: number;
  start?: number;
  onStart: () => void;
  onStop: (time: number) => void;
  onClear: () => void;
  onDone: (time: number) => void;
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

const Issue = ({ issue, isActive, time, start, onStart, onStop, onClear, onDone }: PropTypes) => {
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

  return (
    <div className="block w-full p-1 bg-white border border-gray-200 rounded-lg shadow dark:shadow-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 relative">
      <h1 className="mb-1 truncate">
        <a href={`http://localhost:58103/issues/${issue.id}`} target="_blank" className="text-blue-500 hover:underline">
          #{issue.id}
        </a>{" "}
        {issue.subject}
      </h1>
      <div className="flex flex-row items-center justify-between gap-x-2">
        <div className="w-[80px] bg-[#eeeeee]">
          <div className="bg-[#bae0ba] text-xs font-medium text-gray-600 text-center leading-none p-1" style={{ width: `${issue.done_ratio}%` }}>
            {issue.done_ratio}%
          </div>
        </div>
        <div className="flex items-center gap-x-3 mr-3">
          <span className="text-lg text-yellow-500">{formatTime(timer / 1000)}</span>
          {!isActive ? <FontAwesomeIcon icon={faPlay} size="2x" className="text-green-500 cursor-pointer" onClick={onStart} /> : <FontAwesomeIcon icon={faPause} size="2x" className="text-red-500 cursor-pointer" onClick={() => onStop(timer)} />}
          <FontAwesomeIcon icon={faStop} size="2x" className="text-red-500 cursor-pointer" onClick={onClear} />
          <FontAwesomeIcon icon={faCheck} size="2x" className="text-green-600 cursor-pointer" onClick={() => onDone(timer)} />
        </div>
      </div>
    </div>
  );
};

export const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "";

  let s = Math.floor(seconds % 60);
  let m = Math.floor((seconds / 60) % 60);
  let h = Math.floor(seconds / 60 / 60);
  return `${h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
};

export default Issue;
