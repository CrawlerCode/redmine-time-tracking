import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare, faBan, faBookmark, faCircleUser, faPause, faPen, faPlay, faStop, faThumbTack, faXmark } from "@fortawesome/free-solid-svg-icons";
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
import Toast from "../general/Toast";
import CreateTimeEntryModal from "./CreateTimeEntryModal";
import IssueInfoTooltip from "./IssueInfoTooltip";
import IssueTimer, { IssueTimerData, TimerActions, TimerRef } from "./IssueTimer";

type IssueActions = {
  onRemember: () => void;
  onForget: () => void;
  onPin: () => void;
  onUnpin: () => void;
  onPinAndRemember: () => void;
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

const Issue = ({ issue, priorityType, timerData, assignedToMe, pinned, remembered, onStart, onPause, onStop, onOverrideTime, onRemember, onForget, onPin, onUnpin, onPinAndRemember }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const timerRef = useRef<TimerRef>(null);

  const [createTimeEntry, setCreateTimeEntry] = useState<number | undefined>(undefined);
  const [copiedIdToClipboard, setCopiedIdToClipboard] = useState(false);

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
              name: formatMessage({ id: "issues.context-menu.copy-id-to-clipboard" }),
              icon: <FontAwesomeIcon icon={faCopy} />,
              onClick: () => {
                navigator.clipboard.writeText(`#${issue.id}`);
                setCopiedIdToClipboard(true);
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
              icon: <FontAwesomeIcon icon={faPen} />,
              disabled: timerRef.current?.timer === 0,
              onClick: () => timerRef.current?.editTimer(),
            },
          ],
          [
            {
              name: formatMessage({ id: assignedToMe || remembered ? "issues.context-menu.pin" : "issues.context-menu.pin-and-remember" }),
              icon: <FontAwesomeIcon icon={faThumbTack} className="rotate-[30deg]" />,
              disabled: pinned,
              onClick: assignedToMe || remembered ? onPin : onPinAndRemember,
            },
            {
              name: formatMessage({ id: "issues.context-menu.unpin" }),
              icon: <FontAwesomeIcon icon={faXmark} />,
              disabled: !pinned,
              onClick: onUnpin,
            },
          ],
          ...(!assignedToMe
            ? [
                [
                  {
                    name: formatMessage({ id: "issues.context-menu.remember" }),
                    icon: <FontAwesomeIcon icon={faBookmark} />,
                    disabled: remembered,
                    onClick: onRemember,
                  },
                  {
                    name: formatMessage({ id: "issues.context-menu.forgot" }),
                    icon: <FontAwesomeIcon icon={faBan} />,
                    disabled: !remembered,
                    onClick: onForget,
                  },
                ],
              ]
            : []),
        ]}
      >
        <div
          className={clsxm(
            "relative block w-full rounded-lg p-1 shadow-sm dark:shadow-gray-700",
            "focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800",
            "hover:bg-gray-100 dark:hover:bg-gray-700",
            settings.style.showIssuesPriority
              ? {
                  "border-2 border-[#add7f3] dark:border-[#4973f3]/40": priorityType === "lowest",
                  "border border-gray-200 dark:border-gray-700": priorityType === "normal",
                  "border-2 border-[#fcc] dark:border-[#ff6868]/40": priorityType === "high",
                  "border-2 border-[#ffb4b4] dark:border-[#ff5050]/40": priorityType === "higher" || priorityType === "highest",
                }
              : "border border-gray-200 dark:border-gray-700"
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
            className={clsx(
              "mb-1 truncate",
              {
                "me-4": (pinned && assignedToMe) || (!pinned && !assignedToMe),
                "me-9": pinned && !assignedToMe,
              },
              settings.style.showIssuesPriority && {
                "text-[#559] dark:text-[#9393ed]": priorityType === "lowest",
                "text-[#900] dark:text-[#fa7070]": priorityType === "high" || priorityType === "higher",
                "font-bold text-[#900] dark:text-[#fa7070]": priorityType === "highest",
              }
            )}
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
                {settings.style.showTooltips && <Tooltip id={`tooltip-pinned-${issue.id}`} place="left" delayShow={700} content={formatMessage({ id: "issues.issue.pinned" })} className="italic" />}
                <FontAwesomeIcon icon={faThumbTack} className="rotate-[30deg] text-gray-300 focus:outline-none dark:text-gray-600" data-tooltip-id={`tooltip-pinned-${issue.id}`} tabIndex={-1} />
              </>
            )}
            {!assignedToMe && (
              <>
                {settings.style.showTooltips && (
                  <Tooltip id={`tooltip-not-assigned-to-me-${issue.id}`} place="left" delayShow={700} content={formatMessage({ id: "issues.issue.not-assigned-to-me" })} className="italic" />
                )}
                <FontAwesomeIcon icon={faCircleUser} className="text-gray-300 focus:outline-none dark:text-gray-600" data-tooltip-id={`tooltip-not-assigned-to-me-${issue.id}`} tabIndex={-1} />
              </>
            )}
          </div>
        </div>
      </ContextMenu>
      {settings.style.showTooltips && (
        <Tooltip id={`tooltip-toggle-timer-${issue.id}`} place="bottom" delayShow={4000} className="z-10 max-w-[275px] italic">
          <FormattedMessage
            id="issues.action.toggle-timer.tooltip"
            values={{
              KBD: (children) => <KBD>{children}</KBD>,
            }}
          />
        </Tooltip>
      )}
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
      {copiedIdToClipboard && (
        <Toast type="success" message={formatMessage({ id: "issues.id-copied-to-clipboard" }, { issueId: issue.id })} autoClose={2500} onClose={() => setCopiedIdToClipboard(false)} />
      )}
    </>
  );
};

export default Issue;
