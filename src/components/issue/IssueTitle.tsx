import { IssueInfoTooltip } from "@/components/issue/IssueInfoTooltip";
import { ComponentProps } from "react";
import { TIssue } from "../../api/redmine/types";
import { PriorityType } from "../../hooks/useIssuePriorities";
import { useSettings } from "../../provider/SettingsProvider";
import { clsxm } from "../../utils/clsxm";

type PropTypes = {
  issue: TIssue;
  priorityType?: PriorityType;
} & Omit<ComponentProps<"h1">, "children">;

const IssueTitle = ({ issue, priorityType, className, ...props }: PropTypes) => {
  const { settings } = useSettings();

  return (
    <h1
      {...props}
      className={clsxm(
        "truncate",
        settings.style.showIssuesPriority && {
          "text-[#559] dark:text-[#9393ed]": priorityType === "lowest",
          "text-[#900] dark:text-[#fa7070]": priorityType === "medium-high",
          "font-bold text-[#900] dark:text-[#fa7070]": priorityType === "high" || priorityType === "highest",
        },
        className
      )}
    >
      <IssueInfoTooltip issue={issue}>
        <a
          href={`${settings.redmineURL}/issues/${issue.id}`}
          target="_blank"
          tabIndex={-1}
          className={clsxm("text-primary hover:underline", {
            "text-muted-foreground line-through hover:line-through": issue.status.is_closed,
          })}
          rel="noreferrer"
        >
          {issue.tracker.name} #{issue.id}
        </a>
      </IssueInfoTooltip>{" "}
      {issue.subject}
    </h1>
  );
};

export default IssueTitle;
