import { faCircleUser, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Tooltip } from "react-tooltip";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import Timer from "../timers/Timer";
import IssueContextMenu from "./IssueContextMenu";
import IssueTitle from "./IssueTitle";

type PropTypes = {
  issue: TIssue;
  localIssue: LocalIssue;
  priorityType: PriorityType;
  assignedToMe: boolean;
  timers: TimerController[];
  onAddTimer: () => void;
  canEdit: boolean;
  canLogTime: boolean;
  canAddNotes: boolean;
};

const Issue = ({ issue, localIssue, priorityType, assignedToMe, timers, onAddTimer, canEdit, canLogTime, canAddNotes }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const primaryTimer = timers[0];

  const [areTimersExpanded, setAreTimersExpanded] = useState(false);

  return (
    <>
      <IssueContextMenu
        issue={issue}
        localIssue={localIssue}
        primaryTimer={primaryTimer}
        assignedToMe={assignedToMe}
        canEdit={canEdit}
        canLogTime={canLogTime}
        canAddNotes={canAddNotes}
        onAddTimer={onAddTimer}
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
          // On "Enter" or "Space" => toggle timer
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.code === "Space") {
              if (!canLogTime) return;

              primaryTimer.toggleTimer();
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <IssueTitle
            issue={issue}
            priorityType={priorityType}
            className={clsx({
              "me-4": (localIssue.pinned && assignedToMe) || (!localIssue.pinned && !assignedToMe),
              "me-9": localIssue.pinned && !assignedToMe,
            })}
          />
          <div className="flex flex-row justify-between gap-x-2">
            <div className="mt-1">
              <div className="w-[80px] bg-[#eeeeee]">
                <div className="select-none bg-[#bae0ba] p-1 text-center text-xs font-medium leading-none text-gray-600" style={{ width: `${issue.done_ratio}%` }}>
                  {issue.done_ratio}%
                </div>
              </div>
            </div>
            {canLogTime && !areTimersExpanded && (
              <div>
                <Timer timer={primaryTimer} issue={issue} />
                {timers.length > 1 && (
                  <div className="pl-3 text-[9px] text-gray-500" onClick={() => setAreTimersExpanded(true)}>
                    <FormattedMessage id="issues.timers.more-timers" values={{ count: timers.length - 1 }} />
                  </div>
                )}
              </div>
            )}
          </div>
          {canLogTime && areTimersExpanded && (
            <div className="mt-2 flex flex-col gap-y-1">
              {timers.map((timer) => (
                <Timer key={timer.id} timer={timer} issue={issue} variant="expanded" />
              ))}
            </div>
          )}
          <div className="absolute right-2 top-2 flex items-start justify-end gap-x-1">
            {localIssue.pinned && (
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
      </IssueContextMenu>
    </>
  );
};

export default Issue;
