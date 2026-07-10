import { IssueInfoTooltip } from "@/components/issue/IssueInfoTooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { randomElement } from "@/utils/random";
import clsx from "clsx";
import { ComponentProps } from "react";
import { PriorityType } from "../../api/redmine/hooks/useRedmineIssuePriorities";
import { TIssue } from "../../api/redmine/types";
import { useSettings } from "../../provider/SettingsProvider";

type PropTypes = {
  issue: TIssue;
  priorityType?: PriorityType;
} & Omit<ComponentProps<"h1">, "children">;

export const IssueTitle = ({ issue, priorityType, className, ...props }: PropTypes) => {
  const { settings } = useSettings();

  return (
    <h1
      {...props}
      className={cn(
        "truncate",
        settings.style.showIssuePriority && {
          "text-priority-lowest-text": priorityType === "lowest",
          "text-priority-medium-high-text": priorityType === "medium-high",
          "font-bold text-priority-high-text": priorityType === "high" || priorityType === "highest",
        },
        className
      )}
    >
      <IssueInfoTooltip issue={issue}>
        <a
          href={`${settings.redmineURL}/issues/${issue.id}`}
          target="_blank"
          tabIndex={-1}
          className={cn("text-primary hover:underline", {
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

export const IssueTitleSkeleton = () => <Skeleton className={clsx("h-5", randomElement(["w-40", "w-56", "w-72"]))} />;
