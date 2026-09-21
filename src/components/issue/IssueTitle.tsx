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
} & Omit<ComponentProps<"div">, "children">;

export const IssueTitle = ({ issue, priorityType, className, ...props }: PropTypes) => {
  const { settings } = useSettings();

  return (
    <div {...props} className={cn("flex min-w-0 items-center gap-1", className)}>
      <IssueInfoTooltip issue={issue}>
        <a
          href={`${settings.redmineURL}/issues/${issue.id}`}
          target="_blank"
          tabIndex={-1}
          className={cn("shrink-0 rounded-md bg-primary/15 px-1.5 py-0.5 text-xs text-primary hover:underline", {
            "bg-muted text-muted-foreground line-through hover:line-through": issue.status.is_closed,
          })}
          rel="noreferrer"
        >
          {issue.tracker.name} #{issue.id}
        </a>
      </IssueInfoTooltip>
      <h1
        className={cn(
          "truncate text-sm",
          settings.style.showIssuePriority && {
            "text-priority-lowest-text": priorityType === "lowest",
            "text-priority-medium-high-text": priorityType === "medium-high",
            "font-bold text-priority-high-text": priorityType === "high" || priorityType === "highest",
          }
        )}
      >
        {issue.subject}
      </h1>
    </div>
  );
};

export const IssueTitleFallback = ({ className, issueId, ...props }: Omit<PropTypes, "issue"> & { issueId: number }) => (
  <div {...props} className={cn("flex min-w-0 items-center gap-1", className)}>
    <p className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground line-through">#{issueId}</p>
  </div>
);

export const IssueTitleSkeleton = () => (
  <div className="flex min-w-0 items-center gap-1">
    <Skeleton className="h-5.5 w-20 shrink-0 rounded-md" />
    <Skeleton className={clsx("h-5.5", randomElement(["w-24", "w-32", "w-40"]))} />
  </div>
);
