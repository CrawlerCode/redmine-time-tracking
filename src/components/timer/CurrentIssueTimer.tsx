import { useRedmineIssue } from "@/api/redmine/hooks/useRedmineIssue";
import { usePermissions } from "@/provider/PermissionsProvider";
import useRedmineUrl from "../../hooks/useRedmineUrl";
import useTimers, { calculateElapsedTime } from "../../hooks/useTimers";
import { TimerComponents } from "./timer";

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
  const primaryTimer = issueTimers[0]!;

  if (!canLogTime && calculateElapsedTime(primaryTimer) === 0) return;

  return (
    <TimerComponents.Root timer={primaryTimer} issue={issue}>
      <TimerComponents.ContextMenu>
        <TimerComponents.WrapperCard>
          <TimerComponents.Counter />
          <TimerComponents.ToggleButton />
          <TimerComponents.DoneButton canLogTime={canLogTime} />
        </TimerComponents.WrapperCard>
      </TimerComponents.ContextMenu>
    </TimerComponents.Root>
  );
};

export const CurrentIssueTimer = () => {
  const currentUrl = useRedmineUrl();
  const issueId = currentUrl?.data?.type === "issue" ? currentUrl?.data?.id : undefined;

  if (!issueId) return;

  return <CurrentIssueTimerInner issueId={issueId} />;
};
