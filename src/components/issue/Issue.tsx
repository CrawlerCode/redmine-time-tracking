import { faCircleUser, faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import HelpTooltip from "../general/HelpTooltip";
import Timer from "../timer/Timer";
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
            "bg-card relative flex w-full flex-col gap-1 rounded-lg p-1",
            "focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
            settings.style.showIssuesPriority && priorityType !== "normal"
              ? {
                  "border-2 border-[#add7f3] dark:border-[#4973f3]/40": priorityType === "lowest",
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
              "me-5": (localIssue.pinned && assignedToMe) || (!localIssue.pinned && !assignedToMe),
              "me-10": localIssue.pinned && !assignedToMe,
            })}
          />
          <div className="flex justify-between gap-x-2">
            <div className="mt-1">
              <div className="w-[80px] bg-[#eeeeee]">
                <div className="bg-[#bae0ba] p-1 text-center text-xs leading-none font-medium text-gray-600 select-none" style={{ width: `${issue.done_ratio}%` }}>
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
          <div className="absolute top-2 right-2 flex items-start justify-end gap-x-2">
            {localIssue.pinned && (
              <HelpTooltip message={formatMessage({ id: "issues.issue.pinned" })}>
                <FontAwesomeIcon icon={faThumbTack} className="rotate-30 text-gray-300 focus:outline-hidden dark:text-gray-600" tabIndex={-1} />
              </HelpTooltip>
            )}
            {!assignedToMe && (
              <HelpTooltip message={formatMessage({ id: "issues.issue.not-assigned-to-me" })}>
                <FontAwesomeIcon icon={faCircleUser} className="text-gray-300 focus:outline-hidden dark:text-gray-600" tabIndex={-1} />
              </HelpTooltip>
            )}
          </div>
        </div>
      </IssueContextMenu>
    </>
  );
};

export default Issue;
