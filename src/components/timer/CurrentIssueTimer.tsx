import { useRedmineIssue } from "@/api/redmine/hooks/useRedmineIssue";
import { usePermissions } from "@/provider/PermissionsProvider";
import useRedmineUrl from "../../hooks/useRedmineUrl";
import useTimers from "../../hooks/useTimers";
import Timer from "./timer";

type PropTypes = {
  issueId: number;
};

const CurrentIssueTimerInner = ({ issueId }: PropTypes) => {
  const timers = useTimers();
  const { data: issue } = useRedmineIssue(issueId);
  const { hasProjectPermission } = usePermissions();

  if (!issue) return;

  const canLogTime = hasProjectPermission(issue.project.id, "log_time");

  const issueTimers = timers.getTimersByIssue(issue.id);
  const primaryTimer = issueTimers[0];

  if (!canLogTime && primaryTimer.getElapsedTime() === 0) return;

  return (
    <Timer.Root timer={primaryTimer} issue={issue}>
      <Timer.ContextMenu>
        <Timer.WrapperCard>
          <Timer.Counter />
          <Timer.ToggleButton />
          <Timer.DoneButton canLogTime={canLogTime} />
        </Timer.WrapperCard>
      </Timer.ContextMenu>
    </Timer.Root>
  );
};

export const CurrentIssueTimer = () => {
  const currentUrl = useRedmineUrl();
  const issueId = currentUrl?.data?.type === "issue" ? currentUrl?.data?.id : undefined;

  if (!issueId) return;

  return <CurrentIssueTimerInner issueId={issueId} />;
};
