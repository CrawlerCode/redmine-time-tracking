import { ComponentProps, useId } from "react";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { clsxm } from "../../utils/clsxm";
import IssueInfoTooltip from "./IssueInfoTooltip";

type PropTypes = {
  issue: TIssue;
  priorityType?: PriorityType;
} & Omit<ComponentProps<"h1">, "children">;

const IssueTitle = ({ issue, priorityType, className, ...props }: PropTypes) => {
  const { settings } = useSettings();
  const id = useId();

  return (
    <>
      <h1
        {...props}
        className={clsxm(
          "mb-1 truncate",
          settings.style.showIssuesPriority && {
            "text-[#559] dark:text-[#9393ed]": priorityType === "lowest",
            "text-[#900] dark:text-[#fa7070]": priorityType === "high" || priorityType === "higher",
            "font-bold text-[#900] dark:text-[#fa7070]": priorityType === "highest",
          },
          className
        )}
      >
        <a
          href={`${settings.redmineURL}/issues/${issue.id}`}
          target="_blank"
          tabIndex={-1}
          className={clsxm("text-blue-500 hover:underline", {
            "text-gray-500 line-through hover:line-through": issue.status.is_closed,
          })}
          data-tooltip-id={`tooltip-issue-${id}`}
          rel="noreferrer"
        >
          {issue.tracker.name} #{issue.id}
        </a>{" "}
        {issue.subject}
      </h1>
      <IssueInfoTooltip issue={issue} id={`tooltip-issue-${id}`} />
    </>
  );
};

export default IssueTitle;
