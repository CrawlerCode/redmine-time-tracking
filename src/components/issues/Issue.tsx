import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare, faBan, faBookmark, faCircleUser, faEdit, faPause, faPlay, faStar, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useState } from "react";
import { FormattedMessage, PrimitiveType, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import useSettings from "../../hooks/useSettings";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import ContextMenu from "../general/ContextMenu";
import KBD from "../general/KBD";
import CreateTimeEntryModal from "./CreateTimeEntryModal";
import IssueInfoTooltip from "./IssueInfoTooltip";
import IssueTimer, { IssueTimerData, TimerActions, TimerRef } from "./IssueTimer";

export type IssueActions = {
  onRemember: () => void;
  onForget: () => void;
  onPin: () => void;
  onUnpin: () => void;
};

type PropTypes = {
  issue: TIssue;
  priorityType: PrimitiveType;
  timerData: IssueTimerData;
  assignedToMe: boolean;
  pinned: boolean;
  remembered: boolean;
} & Omit<TimerActions, "onDoneTimer"> &
  IssueActions;

const Issue = ({ issue, priorityType, timerData, assignedToMe, pinned, remembered, onStart, onPause, onStop, onOverrideTime, onRemember, onForget, onPin, onUnpin }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const timerRef = useRef<TimerRef>(null);

  const [createTimeEntry, setCreateTimeEntry] = useState<number | undefined>(undefined);

  return (
    <>
      <ContextMenu
        menu={[
          [
            {
              name: formatMessage({ id: "issues.context-menu.open-in-redmine" }),
              icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} />,
              onClick: () => {
                window.open(`${settings.redmineURL}/issues/${issue.id}`, "_blank");
              },
            },
          ],
          [
            {
              name: formatMessage({ id: "issues.context-menu.timer.start" }),
              icon: <FontAwesomeIcon icon={faPlay} />,
              disabled: timerData.active,
              onClick: onStart,
            },
            {
              name: formatMessage({ id: "issues.context-menu.timer.pause" }),
              icon: <FontAwesomeIcon icon={faPause} />,
              disabled: !timerData.active,
              onClick: () => timerRef.current?.pauseTimer(),
            },
            {
              name: formatMessage({ id: "issues.context-menu.timer.stop" }),
              icon: <FontAwesomeIcon icon={faStop} />,
              disabled: timerRef.current?.timer === 0,
              onClick: onStop,
            },
            {
              name: formatMessage({ id: "issues.context-menu.timer.edit" }),
              icon: <FontAwesomeIcon icon={faEdit} />,
              disabled: timerRef.current?.timer === 0,
              onClick: () => timerRef.current?.editTimer(),
            },
          ],
          [
            {
              name: formatMessage({ id: "issues.context-menu.pin" }),
              icon: <FontAwesomeIcon icon={faStar} />,
              disabled: pinned,
              onClick: onPin,
            },
            {
              name: formatMessage({ id: "issues.context-menu.unpin" }),
              icon: <FontAwesomeIcon icon={faStarRegular} />,
              disabled: !pinned,
              onClick: onUnpin,
            },
          ],
          [
            {
              name: formatMessage({ id: "issues.context-menu.remember" }),
              icon: <FontAwesomeIcon icon={faBookmark} />,
              disabled: assignedToMe || remembered,
              onClick: onRemember,
            },
            {
              name: formatMessage({ id: "issues.context-menu.forgot" }),
              icon: <FontAwesomeIcon icon={faBan} />,
              disabled: assignedToMe || !remembered,
              onClick: onForget,
            },
          ],
        ]}
      >
        <div
          className={clsxm(
            "block w-full p-1 rounded-lg shadow-sm dark:shadow-gray-700 relative",
            "focus:ring-4 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-800",
            "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700",
            {
              //"bg-[#eaf7ff] border-[#add7f3] hover:bg-[#f2faff]": priorityType === "lowest",
              //"bg-white border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700": priorityType === "normal",
              //"bg-[#fee] border-[#fcc] hover:bg-[#fff2f2]": priorityType === "high",
              //"bg-[#ffc4c4] border-[#ffb4b4] hover:bg-[#ffd4d4]": priorityType === "higher" || priorityType === "highest",

              "border-2 border-[#add7f3] dark:border-[#4973f3]/40": priorityType === "lowest",
              "border border-gray-200 dark:border-gray-700": priorityType === "normal",
              "border-2 border-[#fcc] dark:border-[#ff6868]/40": priorityType === "high",
              "border-2 border-[#ffb4b4] dark:border-[#ff5050]/40": priorityType === "higher" || priorityType === "highest",
            }
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
          data-tooltip-id={`tooltip-toggle-timer-${issue.id}`}
        >
          <h1
            className={clsx("mb-1 truncate", {
              "me-4": (pinned && assignedToMe) || (!pinned && !assignedToMe),
              "me-9": pinned && !assignedToMe,
              "text-[#559] dark:text-[#9393ed]": priorityType === "lowest",
              "text-[#900] dark:text-[#fa7070]": priorityType === "high" || priorityType === "higher",
              "text-[#900] dark:text-[#fa7070] font-bold": priorityType === "highest",
            })}
          >
            <a href={`${settings.redmineURL}/issues/${issue.id}`} target="_blank" tabIndex={-1} className="text-blue-500 hover:underline" data-tooltip-id={`tooltip-issue-${issue.id}`}>
              #{issue.id}
            </a>{" "}
            {issue.subject}
          </h1>
          <IssueInfoTooltip issue={issue} />
          <div className="flex flex-row justify-between gap-x-2">
            <div className="mt-1">
              <div className="w-[80px] bg-[#eeeeee]">
                <div className="select-none bg-[#bae0ba] p-1 text-center text-xs font-medium leading-none text-gray-600" style={{ width: `${issue.done_ratio}%` }}>
                  {issue.done_ratio}%
                </div>
              </div>
            </div>
            <div className="mr-2 flex flex-col">
              <IssueTimer
                key={issue.id}
                ref={timerRef}
                issue={issue}
                data={timerData}
                onStart={onStart}
                onPause={onPause}
                onStop={onStop}
                onOverrideTime={onOverrideTime}
                onDoneTimer={setCreateTimeEntry}
              />
            </div>
          </div>
          <div className="absolute right-2 top-2 flex items-start justify-end gap-x-1">
            {pinned && (
              <>
                <Tooltip id={`tooltip-pinned-${issue.id}`} place="left" delayShow={700} content={formatMessage({ id: "issues.issue.pinned" })} className="italic" />
                <FontAwesomeIcon icon={faStar} className="text-gray-300 focus:outline-none dark:text-gray-600" data-tooltip-id={`tooltip-pinned-${issue.id}`} tabIndex={-1} />
              </>
            )}
            {!assignedToMe && (
              <>
                <Tooltip id={`tooltip-not-assigned-to-me-${issue.id}`} place="left" delayShow={700} content={formatMessage({ id: "issues.issue.not-assigned-to-me" })} className="italic" />
                <FontAwesomeIcon icon={faCircleUser} className="text-gray-300 focus:outline-none dark:text-gray-600" data-tooltip-id={`tooltip-not-assigned-to-me-${issue.id}`} tabIndex={-1} />
              </>
            )}
          </div>
        </div>
      </ContextMenu>
      <Tooltip id={`tooltip-toggle-timer-${issue.id}`} place="bottom" delayShow={4000} className="z-10 max-w-[275px] italic">
        <FormattedMessage
          id="issues.action.toggle-timer.tooltip"
          values={{
            KBD: (children) => <KBD>{children}</KBD>,
          }}
        />
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
