import useIssue from "../../hooks/useIssue";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useRedmineUrl from "../../hooks/useRedmineUrl";
import useTimers from "../../hooks/useTimers";
import IssueTimer from "./IssueTimer";

type PropTypes = {
  issueId: number;
};

const CurrentIssueTimer = ({ issueId }: PropTypes) => {
  const timers = useTimers();

  const { data: issue } = useIssue(issueId);
  const projectRoles = useMyProjectRoles(issue ? [issue.project.id] : []);
  if (!issue || !projectRoles.hasProjectPermission(issue.project, "log_time")) return;

  const timer = timers.getTimer(issue.id);

  return (
    <div className="rounded-lg border border-gray-200 bg-background px-2 py-0.5 dark:border-gray-700">
      <IssueTimer issue={issue} timer={timer} />
    </div>
  );
};

const CurrentIssueTimerWrapper = () => {
  const currentUrl = useRedmineUrl();
  const issueId = currentUrl?.data?.type === "issue" ? currentUrl?.data?.id : undefined;

  if (!issueId) return null;

  return <CurrentIssueTimer issueId={issueId} />;
};

export default CurrentIssueTimerWrapper;
