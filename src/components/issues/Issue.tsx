import { faArrowUpRightFromSquare, faBan, faBookmark, faCircleUser, faEdit, faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import ContextMenu from "../general/ContextMenu";
import KBD from "../general/KBD";
import CreateTimeEntryModal from "./CreateTimeEntryModal";
import IssueInfoToolkit from "./IssueInfoToolkit";
import IssueTimer, { IssueTimerData, TimerActions, TimerRef } from "./IssueTimer";

export type IssueActions = {
  onRemember: () => void;
  onForgot: () => void;
};

type PropTypes = {
  issue: TIssue;
  timerData: IssueTimerData;
  assignedToMe: boolean;
  remember: boolean;
} & Omit<TimerActions, "onDoneTimer"> &
  IssueActions;

const Issue = ({ issue, timerData, assignedToMe, remember, onStart, onPause, onStop, onOverrideTime, onRemember, onForgot }: PropTypes) => {
  const { settings } = useSettings();

  const timerRef = useRef<TimerRef>(null);

  const [createTimeEntry, setCreateTimeEntry] = useState<number | undefined>(undefined);

  return (
    <>
      <ContextMenu
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
              disabled: timerData.active,
              onClick: onStart,
            },
            {
              name: "Pause timer",
              icon: <FontAwesomeIcon icon={faPause} />,
              disabled: !timerData.active,
              onClick: () => timerRef.current?.pauseTimer(),
            },
            {
              name: "Stop timer",
              icon: <FontAwesomeIcon icon={faStop} />,
              disabled: timerRef.current?.timer === 0,
              onClick: onStop,
            },
            {
              name: "Edit timer",
              icon: <FontAwesomeIcon icon={faEdit} />,
              disabled: timerRef.current?.timer === 0,
              onClick: () => timerRef.current?.editTimer(),
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
      >
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
              if (timerRef.current?.isInEditMode) {
                return;
              }
              if (timerData.active) {
                timerRef.current?.pauseTimer();
              } else {
                timerRef.current?.startTimer();
              }
              e.preventDefault();
            }
          }}
          data-tooltip-id="tooltip-toggle-timer"
        >
          <h1 className="mb-1 truncate me-4">
            <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline" data-tooltip-id={`tooltip-issue-${issue.id}`}>
              #{issue.id}
            </a>{" "}
            {issue.subject}
          </h1>
          <IssueInfoToolkit issue={issue} />
          <div className="flex flex-row justify-between gap-x-2">
            <div className="mt-1">
              <div className="w-[80px] bg-[#eeeeee]">
                <div className="bg-[#bae0ba] text-xs font-medium text-gray-600 text-center leading-none p-1 select-none" style={{ width: `${issue.done_ratio}%` }}>
                  {issue.done_ratio}%
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <IssueTimer key={issue.id} ref={timerRef} issue={issue} data={timerData} onStart={onStart} onPause={onPause} onStop={onStop} onOverrideTime={onOverrideTime} onDoneTimer={setCreateTimeEntry} />
            </div>
          </div>
          {!assignedToMe && (
            <>
              <Tooltip id="tooltip-not-assigned-to-me" place="left" delayShow={700} content="Issue is not assigned to you" className="italic" />
              <FontAwesomeIcon icon={faCircleUser} className="absolute top-2 right-2 text-gray-300 dark:text-gray-600" data-tooltip-id="tooltip-not-assigned-to-me" tabIndex={-1} />
            </>
          )}
        </div>
      </ContextMenu>
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
    </>
  );
};

export default Issue;
