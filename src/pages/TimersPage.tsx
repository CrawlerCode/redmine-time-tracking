import TimerSearch, { useTimerSearch } from "@/components/timer/TimerSearch";
import { FormattedMessage } from "react-intl";
import IssuesListSkeleton from "../components/issue/IssuesListSkeleton";
import Timer from "../components/timer/Timer";
import TimersBadge from "../components/timer/TimersBadge";
import useIssuePriorities from "../hooks/useIssuePriorities";
import useTimers from "../hooks/useTimers";
import { useSettings } from "../provider/SettingsProvider";

const TimersPage = () => {
  const { settings } = useSettings();

  const timers = useTimers({
    loadIssues: true,
  });
  const issuePriorities = useIssuePriorities({ enabled: settings.style.showIssuesPriority });

  const search = useTimerSearch();
  const matchedTimers = timers.searchTimers(search);

  const isLoading = timers.isLoading || issuePriorities.isLoading;

  return (
    <>
      <TimersBadge activeTimerCount={timers.getActiveTimerCount()} />

      <div className="flex flex-col gap-y-2">
        {isLoading ? (
          <IssuesListSkeleton />
        ) : (
          <>
            {matchedTimers.map((timer) => {
              const issue = timer.getIssue();
              return <Timer key={timer.id} timer={timer} issue={issue} issuePriorityType={issue ? issuePriorities.getPriorityType(issue) : undefined} variant="full" />;
            })}

            {matchedTimers.length === 0 && (
              <p className="text-center">
                <FormattedMessage id="timers.list.no-options" />
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

const SearchWrapper = () => {
  return (
    <TimerSearch>
      <TimersPage />
    </TimerSearch>
  );
};

export default SearchWrapper;
