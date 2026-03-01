import { usePermissions } from "@/provider/PermissionsProvider";
import clsx from "clsx";
import { PinIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TIssue } from "../../api/redmine/types";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { clsxm } from "../../utils/clsxm";
import HelpTooltip from "../general/HelpTooltip";
import { ToggleableCard } from "../general/ToggleableCard";
import Timer from "../timer/timer";
import IssueContextMenu from "./IssueContextMenu";
import IssueTitle from "./IssueTitle";

type PropTypes = {
  issue: TIssue;
  localIssue: LocalIssue;
  priorityType: PriorityType;
  assignedToMe: boolean;
  timers: TimerController[];
  onAddTimer: () => void;
};

const Issue = ({ issue, localIssue, priorityType, assignedToMe, timers, onAddTimer }: PropTypes) => {
  const { formatMessage } = useIntl();

  const { settings } = useSettings();

  const { hasProjectPermission } = usePermissions();
  const canLogTime = hasProjectPermission(issue.project.id, "log_time");

  const primaryTimer = timers[0];

  const [areTimersExpanded, setAreTimersExpanded] = useState(false);

  return (
    <IssueContextMenu.Provider>
      <IssueContextMenu.Trigger>
        <ToggleableCard
          role="listitem"
          data-type="issue"
          className={clsxm(
            "relative flex flex-col gap-1",
            settings.style.showIssuesPriority && {
              "border-2 border-[#add7f3] dark:border-[#4973f3]/40": priorityType === "lowest",
              "border-2 border-[#fcc] dark:border-[#fc6f6f]/40": priorityType === "medium-high",
              "border-2 border-[#ffb4b4] dark:border-[#ff5050]/40": priorityType === "high" || priorityType === "highest",
            }
          )}
          {...(canLogTime && { onToggle: () => primaryTimer.toggleTimer() })}
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
                <Timer.Root timer={primaryTimer} issue={issue}>
                  <Timer.Wrapper>
                    <Timer.Counter />
                    <Timer.ToggleButton />
                    <Timer.ResetButton />
                    <Timer.DoneButton canLogTime={canLogTime} />
                  </Timer.Wrapper>
                </Timer.Root>
                {timers.length > 1 && (
                  <div className="pl-3 text-xs text-gray-500" onClick={() => setAreTimersExpanded(true)}>
                    <FormattedMessage id="issues.timers.more-timers" values={{ count: timers.length - 1 }} />
                  </div>
                )}
              </div>
            )}
          </div>
          {canLogTime && areTimersExpanded && (
            <div className="mt-2 flex flex-col gap-y-1">
              {timers.map((timer) => (
                <Timer.Root key={timer.id} timer={timer} issue={issue}>
                  <Timer.ContextMenu>
                    <Timer.WrapperCard>
                      <Timer.NameField />
                      <Timer.Counter />
                      <Timer.ToggleButton />
                      <Timer.ResetButton />
                      <Timer.DoneButton canLogTime={canLogTime} />
                    </Timer.WrapperCard>
                  </Timer.ContextMenu>
                </Timer.Root>
              ))}
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-start justify-end gap-x-2">
            {localIssue.pinned && (
              <HelpTooltip message={formatMessage({ id: "issues.issue.pinned" })}>
                <PinIcon className="size-3.5 rotate-30 fill-current text-gray-300 focus:outline-hidden dark:text-gray-600" tabIndex={-1} />
              </HelpTooltip>
            )}
            {!assignedToMe && (
              <HelpTooltip message={formatMessage({ id: "issues.issue.not-assigned-to-me" })}>
                <UserIcon className="size-3.5 fill-current text-gray-300 focus:outline-hidden dark:text-gray-600" tabIndex={-1} />
              </HelpTooltip>
            )}
          </div>
        </ToggleableCard>
      </IssueContextMenu.Trigger>
      <IssueContextMenu.Content issue={issue} localIssue={localIssue} primaryTimer={primaryTimer} assignedToMe={assignedToMe} onAddTimer={onAddTimer} />
    </IssueContextMenu.Provider>
  );
};

export default Issue;
