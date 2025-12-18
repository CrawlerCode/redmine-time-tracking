import TimerSearch, { useTimerSearch } from "@/components/timer/TimerSearch";
import { useIssuePriorities } from "@/hooks/useIssuePriorities";
import { useSuspenseIssues } from "@/hooks/useIssues";
import { createFileRoute } from "@tanstack/react-router";
import { FormattedMessage } from "react-intl";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import Timer from "../components/timer/Timer";
import TimersBadge from "../components/timer/TimersBadge";
import useTimers from "../hooks/useTimers";
import { useSettings } from "../provider/SettingsProvider";

export const Route = createFileRoute("/timers")({
  component: PageComponent,
  pendingComponent: () => <IssuesListSkeleton />,
});

function PageComponent() {
  return (
    <TimerSearch>
      <TimersPage />
    </TimerSearch>
  );
}

const TimersPage = () => {
  const { settings } = useSettings();

  const timers = useTimers();
  const issues = useSuspenseIssues(timers.getIssuesIds());
  const issuePriorities = useIssuePriorities({ enabled: settings.style.showIssuesPriority });

  const search = useTimerSearch();
  const matchedTimers = timers.searchTimers(search, issues.data);

  return (
    <>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="flex flex-col gap-y-2">
        {matchedTimers.map((timer) => {
          const issue = issues.data.find((issue) => issue.id === timer.issueId);
          return <Timer key={timer.id} timer={timer} issue={issue} issuePriorityType={issue ? issuePriorities.getPriorityType(issue) : undefined} variant="full" />;
        })}

        {matchedTimers.length === 0 && (
          <p className="text-center">
            <FormattedMessage id="timers.list.no-options" />
          </p>
        )}
      </div>
    </>
  );
};
