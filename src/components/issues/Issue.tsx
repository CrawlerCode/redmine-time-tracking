import { faArrowUpRightFromSquare, faBan, faBookmark, faCheck, faCircleUser, faEdit, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import ContextMenu from "../general/ContextMenu";
import KBD from "../general/KBD";
import CreateTimeEntryModal from "./CreateTimeEntryModal";
import EditTime from "./EditTime";

export type IssueData = {
  active: boolean;
  start?: number;
  time: number;
  remember: boolean;
};

type PropTypes = {
  issue: TIssue;
  data: IssueData;
  assignedToMe: boolean;
  onStart: () => void;
  onPause: (time: number) => void;
  onStop: () => void;
  onOverrideTime: (time: number) => void;
  onRemember: () => void;
  onForgot: () => void;
};

const Issue = ({ issue, data: { active, time, start, remember }, assignedToMe, onStart, onPause, onStop, onOverrideTime, onRemember, onForgot }: PropTypes) => {
  const { settings } = useSettings();

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

  const [editTime, setEditTime] = useState<number | undefined>(undefined);
  const [createTimeEntry, setCreateTimeEntry] = useState<number | undefined>(undefined);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | undefined>(undefined);

  return (
    <>
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
            // ignore in edit mode
            if (editTime !== undefined) {
              return;
            }
            if (active) {
              onPause(timer);
            } else {
              onStart();
            }
            e.preventDefault();
          }
        }}
        data-tooltip-id="tooltip-toggle-timer"
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ x: e.pageX, y: e.pageY });
        }}
      >
        <h1 className="mb-1 truncate me-4">
          <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline" data-tooltip-id={`tooltip-issue-${issue.id}`}>
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
                {issue.assigned_to && (
                  <tr>
                    <th className="pr-2 font-medium whitespace-nowrap">Assignee:</th>
                    <td>{issue.assigned_to.name}</td>
                  </tr>
                )}
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
              <>
                <Tooltip id="tooltip-edit-timer" place="top" delayShow={700} content="Double-click to edit" className="italic" />
                <span className={clsx("text-lg", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", active && "font-semibold")} onDoubleClick={() => setEditTime(timer)} data-tooltip-id="tooltip-edit-timer">
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
            <Tooltip id={`tooltip-done-timer-${issue.id}`} place="bottom" delayShow={700} className="z-10 italic opacity-100">
              Click to transfer{" "}
              <span className={clsx("text-xs", timer > 0 ? "text-yellow-500" : "text-gray-700 dark:text-gray-500", active && "font-semibold")}>
                {formatTime(settings.options.roundTimeNearestQuarterHour ? roundTimeNearestQuarterHour(timer) : timer)}
              </span>{" "}
              to Redmine issue
            </Tooltip>
            <FontAwesomeIcon
              icon={faCheck}
              size="2x"
              className="text-green-600 cursor-pointer focus:outline-none"
              onClick={() => setCreateTimeEntry(settings.options.roundTimeNearestQuarterHour ? roundTimeNearestQuarterHour(timer) : timer)}
              data-tooltip-id={`tooltip-done-timer-${issue.id}`}
              tabIndex={-1}
            />
          </div>
        </div>
        {!assignedToMe && (
          <>
            <Tooltip id="tooltip-not-assigned-to-me" place="left" delayShow={700} content="Issue is not assigned to you" className="italic" />
            <FontAwesomeIcon icon={faCircleUser} className="absolute top-2 right-2 text-gray-300 dark:text-gray-600" data-tooltip-id="tooltip-not-assigned-to-me" tabIndex={-1} />
          </>
        )}
      </div>
      <Tooltip id="tooltip-toggle-timer" place="bottom" delayShow={4000} className="italic max-w-[275px]">
        If selected, press <KBD text="Ctrl" /> + <KBD text="Spacebar" space="xl" /> to toggle timer
      </Tooltip>
      {createTimeEntry !== undefined && (
        <CreateTimeEntryModal
          issue={issue}
          time={createTimeEntry}
          onClose={() => setCreateTimeEntry(undefined)}
          onSuccess={() => {
            setCreateTimeEntry(undefined);
            onStop();
          }}
        />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(undefined)}
          menu={[
            [
              {
                name: "Open in Redmine",
                icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} />,
                onClick: () => {
                  window.open(`${settings.redmineURL}/issues/${issue.id}`, "_blank");
                },
              },
            ],
            [
              {
                name: "Start timer",
                icon: <FontAwesomeIcon icon={faPlay} />,
                disabled: active,
                onClick: onStart,
              },
              {
                name: "Pause timer",
                icon: <FontAwesomeIcon icon={faPause} />,
                disabled: !active,
                onClick: () => onPause(timer),
              },
              {
                name: "Stop timer",
                icon: <FontAwesomeIcon icon={faStop} />,
                disabled: timer === 0,
                onClick: onStop,
              },
              {
                name: "Edit timer",
                icon: <FontAwesomeIcon icon={faEdit} />,
                disabled: timer === 0,
                onClick: () => setEditTime(timer),
              },
            ],
            [
              {
                name: "Remember issue",
                icon: <FontAwesomeIcon icon={faBookmark} />,
                disabled: assignedToMe || remember,
                onClick: onRemember,
              },
              {
                name: "Forgot issue",
                icon: <FontAwesomeIcon icon={faBan} />,
                disabled: assignedToMe || !remember,
                onClick: onForgot,
              },
            ],
          ]}
        />
      )}
    </>
  );
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

const formatTime = (milliseconds: number) => {
  if (isNaN(milliseconds) || milliseconds < 0) return "";
  const seconds = milliseconds / 1000;

  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 60 / 60);
  return `${h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
};

/**
 * convert 2.5 => 2:30
 */
const formatHours = (hours: number) => {
  if (isNaN(hours) || hours < 0) return "";

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m > 9 ? m : "0" + m}`;
};

/**
 * Round time to nearest quarter hour
 *
 * for example:
 * 0:07:59 => 0:00:00
 * 0:08:00 => 0:15:00
 * 0:23:00 => 0:30:00
 */
const roundTimeNearestQuarterHour = (milliseconds: number) => {
  const seconds = milliseconds / 1000;
  const m = Math.round(Math.floor((seconds / 60) % 60) / 15) * 15;
  const h = Math.floor(seconds / 60 / 60) + Math.floor(m / 60);
  return (h * 60 + (m % 60)) * 60 * 1000;
};

export default Issue;
