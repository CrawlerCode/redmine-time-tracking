import useIssue from "../../hooks/useIssue";
import useMyProjectRoles from "../../hooks/useMyProjectRoles";
import useRedmineUrl from "../../hooks/useRedmineUrl";
import useTimers from "../../hooks/useTimers";
import Timer from "../timers/Timer";

type PropTypes = {
  issueId: number;
};

const CurrentIssueTimer = ({ issueId }: PropTypes) => {
  const timers = useTimers();
  const { data: issue } = useIssue(issueId);
  const projectRoles = useMyProjectRoles(issue ? [issue.project.id] : []);

  if (!issue || !projectRoles.hasProjectPermission(issue.project.id, "log_time")) return;

  const issueTimers = timers.getTimersByIssue(issue.id);
  const primaryTimer = issueTimers[0];

  return <Timer timer={primaryTimer} issue={issue} variant="standalone" />;
};

const CurrentIssueTimerWrapper = () => {
  const currentUrl = useRedmineUrl();
  const issueId = currentUrl?.data?.type === "issue" ? currentUrl?.data?.id : undefined;

  if (!issueId) return;

  return <CurrentIssueTimer issueId={issueId} />;
};

export default CurrentIssueTimerWrapper;
