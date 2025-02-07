import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faArrowUpRightFromSquare, faBan, faBookmark, faCircleUser, faNoteSticky, faPause, faPen, faPlay, faStop, faThumbTack, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useState } from "react";
import { FormattedMessage, PrimitiveType, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import { Timer } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import ContextMenu from "../general/ContextMenu";
import KBD from "../general/KBD";
import Toast from "../general/Toast";
import AddIssueNotesModal from "./AddIssueNotesModal";
import CreateTimeEntryModal from "./CreateTimeEntryModal";
import EditIssueModal from "./EditIssueModal";
import IssueInfoTooltip from "./IssueInfoTooltip";
import IssueTimer, { TimerRef } from "./IssueTimer";

type PropTypes = {
  issue: TIssue;
  priorityType: PrimitiveType;
  assignedToMe: boolean;
  canEdit: boolean;
  canLogTime: boolean;
  canAddNotes: boolean;
  timer: Timer;
};

const Issue = ({ issue, priorityType, assignedToMe, canEdit, canLogTime, canAddNotes, timer }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const timerRef = useRef<TimerRef>(null);

  const [createTimeEntry, setCreateTimeEntry] = useState<number | undefined>(undefined);
  const [copiedIdToClipboard, setCopiedIdToClipboard] = useState(false);
  const [editIssue, setEditIssue] = useState(false);
  const [addNotes, setAddNotes] = useState(false);

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
              name: formatMessage({ id: "issues.context-menu.edit" }),
              icon: <FontAwesomeIcon icon={faPen} />,
              onClick: () => setEditIssue(true),
              disabled: !canEdit,
            },
            {
              name: formatMessage({ id: "issues.context-menu.add-notes" }),
              icon: <FontAwesomeIcon icon={faNoteSticky} />,
              onClick: () => setAddNotes(true),
              disabled: !canAddNotes,
            },
          ],
          [
            {
              name: formatMessage({ id: "issues.context-menu.timer.start" }),
              icon: <FontAwesomeIcon icon={faPlay} />,
              disabled: timer.active || !canLogTime,
              onClick: timer.startTimer,
            },
            {
              name: formatMessage({ id: "issues.context-menu.timer.pause" }),
              icon: <FontAwesomeIcon icon={faPause} />,
              disabled: !timer.active || !canLogTime,
              onClick: timer.pauseTimer,
            },
            {
              name: formatMessage({ id: "issues.context-menu.timer.reset" }),
              icon: <FontAwesomeIcon icon={faStop} />,
              disabled: timer.getCurrentTime() === 0 || !canLogTime,
              onClick: timer.resetTimer,
            },
            {
              name: formatMessage({ id: "issues.context-menu.timer.edit" }),
              icon: <FontAwesomeIcon icon={faPen} />,
              disabled: timer.getCurrentTime() === 0 || !canLogTime,
              onClick: () => timerRef.current?.editTimer(),
            },
          ],
          [
            {
              name: formatMessage({ id: assignedToMe || timer.remembered ? "issues.context-menu.pin" : "issues.context-menu.pin-and-remember" }),
              icon: <FontAwesomeIcon icon={faThumbTack} className="rotate-[30deg]" />,
              disabled: timer.pinned,
              onClick: () => (assignedToMe || timer.remembered ? timer.setPinned(true) : timer.setRememberedAndPinned(true, true)),
            },
            {
              name: formatMessage({ id: "issues.context-menu.unpin" }),
              icon: <FontAwesomeIcon icon={faXmark} />,
              disabled: !timer.pinned,
              onClick: () => timer.setPinned(false),
            },
          ],
          ...(!assignedToMe
            ? [
                [
                  {
                    name: formatMessage({ id: "issues.context-menu.remember" }),
                    icon: <FontAwesomeIcon icon={faBookmark} />,
                    disabled: timer.remembered,
                    onClick: () => timer.setRemembered(true),
                  },
                  {
                    name: formatMessage({ id: "issues.context-menu.forgot" }),
                    icon: <FontAwesomeIcon icon={faBan} />,
                    disabled: !timer.remembered,
                    onClick: () => timer.setRemembered(false),
                  },
                ],
              ]
            : []),
        ]}
      >
        <div
          role="listitem"
          data-type="issue"
          className={clsxm(
            "relative block w-full rounded-lg p-1",
            "focus:outline-none focus:ring-4 focus:ring-primary-focus",
            "bg-background hover:bg-background-hover",
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
              if (timerRef.current?.isInEditMode) return;

              if (!canLogTime) return;

              if (timer.active) {
                timer.pauseTimer();
              } else {
                timer.startTimer();
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
                "me-4": (timer.pinned && assignedToMe) || (!timer.pinned && !assignedToMe),
                "me-9": timer.pinned && !assignedToMe,
              },
              settings.style.showIssuesPriority && {
                "text-[#559] dark:text-[#9393ed]": priorityType === "lowest",
                "text-[#900] dark:text-[#fa7070]": priorityType === "high" || priorityType === "higher",
                "font-bold text-[#900] dark:text-[#fa7070]": priorityType === "highest",
              }
            )}
          >
            <a
              href={`${settings.redmineURL}/issues/${issue.id}`}
              target="_blank"
              tabIndex={-1}
              className="text-blue-500 hover:underline"
              data-tooltip-id={`tooltip-issue-${issue.id}`}
              rel="noreferrer"
            >
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
            {canLogTime && (
              <div className="flex flex-col">
                <IssueTimer key={issue.id} ref={timerRef} issue={issue} timer={timer} onDoneTimer={setCreateTimeEntry} />
              </div>
            )}
          </div>
          <div className="absolute right-2 top-2 flex items-start justify-end gap-x-1">
            {timer.pinned && (
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
            id="issues.timer.action.toggle.tooltip"
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
            timer.resetTimer();
          }}
        />
      )}
      {editIssue && <EditIssueModal issue={issue} onClose={() => setEditIssue(false)} onSuccess={() => setEditIssue(false)} />}
      {addNotes && <AddIssueNotesModal issue={issue} onClose={() => setAddNotes(false)} onSuccess={() => setAddNotes(false)} />}
      {copiedIdToClipboard && (
        <Toast type="success" message={formatMessage({ id: "issues.id-copied-to-clipboard" }, { issueId: issue.id })} autoClose={2500} onClose={() => setCopiedIdToClipboard(false)} />
      )}
    </>
  );
};

export default Issue;
