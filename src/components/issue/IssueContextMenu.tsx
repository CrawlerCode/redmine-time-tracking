import { useRedmineCurrentUser } from "@/api/redmine/hooks/useRedmineCurrentUser";
import { usePermissions } from "@/provider/PermissionsProvider";
import {
  BookmarkMinusIcon,
  BookmarkPlusIcon,
  CopyIcon,
  NotebookPenIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  PlusIcon,
  SquareArrowOutUpRightIcon,
  TimerIcon,
  TimerOffIcon,
  TimerResetIcon,
} from "lucide-react";
import { ReactElement, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { TIssue } from "../../api/redmine/types";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { calculateElapsedTime, Timer, TimerApi } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu";
import AddIssueNotesModal from "./AddIssueNotesModal";
import EditIssueModal from "./EditIssueModal";

type PropTypes = {
  issue: TIssue;
  localIssue: LocalIssue;
  primaryTimer: Timer;
  timerApi: TimerApi;
  assignedToMe: boolean;
};

export const IssueContextMenu = ({ children, ...props }: PropTypes & { children: ReactElement }) => {
  const [editIssue, setEditIssue] = useState(false);
  const [addNotes, setAddNotes] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger render={children} />
        <ContextMenuContent>
          <IssueContextMenuItems {...props} onEdit={() => setEditIssue(true)} onAddNotes={() => setAddNotes(true)} />
        </ContextMenuContent>
      </ContextMenu>

      {editIssue && <EditIssueModal issue={props.issue} onClose={() => setEditIssue(false)} onSuccess={() => setEditIssue(false)} />}
      {addNotes && <AddIssueNotesModal issue={props.issue} onClose={() => setAddNotes(false)} onSuccess={() => setAddNotes(false)} />}
    </>
  );
};

const IssueContextMenuItems = ({ issue, localIssue, primaryTimer, timerApi, assignedToMe, onEdit, onAddNotes }: PropTypes & { onEdit: () => void; onAddNotes: () => void }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const { data: me } = useRedmineCurrentUser();

  const { hasProjectPermission } = usePermissions();
  const canEdit = hasProjectPermission(issue.project.id, "edit_issues") || (hasProjectPermission(issue.project.id, "edit_own_issues") && issue.author.id === me?.id);
  const canLogTime = hasProjectPermission(issue.project.id, "log_time");
  const canAddNotes = hasProjectPermission(issue.project.id, "add_issue_notes");

  return (
    <>
      <ContextMenuItem onClick={() => window.open(`${settings.redmineURL}/issues/${issue.id}`, "_blank")}>
        <SquareArrowOutUpRightIcon />
        {formatMessage({ id: "issues.context-menu.open-in-redmine" })}
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          navigator.clipboard.writeText(`#${issue.id}`);
          toast.success(formatMessage({ id: "issues.id-copied-to-clipboard" }, { issueId: issue.id }), {
            duration: 2000,
          });
        }}
      >
        <CopyIcon />
        {formatMessage({ id: "issues.context-menu.copy-id-to-clipboard" })}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem disabled={!canEdit} onClick={onEdit}>
        <PencilIcon />
        {formatMessage({ id: "issues.context-menu.edit" })}
      </ContextMenuItem>
      <ContextMenuItem disabled={!canAddNotes} onClick={onAddNotes}>
        <NotebookPenIcon />
        {formatMessage({ id: "issues.context-menu.add-notes" })}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={primaryTimer.isActive ? () => timerApi.pauseTimer(primaryTimer) : () => timerApi.startTimer(primaryTimer)} disabled={!canLogTime}>
        {primaryTimer.isActive ? <TimerOffIcon /> : <TimerIcon />}
        {formatMessage({ id: primaryTimer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" })}
      </ContextMenuItem>
      <ContextMenuItem onClick={() => timerApi.resetTimer(primaryTimer)} disabled={calculateElapsedTime(primaryTimer) === 0 || !canLogTime}>
        <TimerResetIcon />
        {formatMessage({ id: "timer.context-menu.reset" })}
      </ContextMenuItem>
      <ContextMenuItem onClick={() => timerApi.addTimer(issue.id)} disabled={!canLogTime}>
        <PlusIcon />
        {formatMessage({ id: "timer.context-menu.add-timer" })}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem disabled={localIssue.pinned} onClick={() => localIssue.setLocalIssue({ pinned: true, remembered: !assignedToMe ? true : undefined })}>
        <PinIcon className="rotate-30" />
        {formatMessage({ id: assignedToMe || localIssue.remembered ? "issues.context-menu.pin" : "issues.context-menu.pin-and-remember" })}
      </ContextMenuItem>
      <ContextMenuItem disabled={!localIssue.pinned} onClick={() => localIssue.setLocalIssue({ pinned: false })}>
        <PinOffIcon />
        {formatMessage({ id: "issues.context-menu.unpin" })}
      </ContextMenuItem>
      {!assignedToMe && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem disabled={localIssue.remembered} onClick={() => localIssue.setLocalIssue({ remembered: true })}>
            <BookmarkPlusIcon />
            {formatMessage({ id: "issues.context-menu.remember" })}
          </ContextMenuItem>
          <ContextMenuItem disabled={!localIssue.remembered} onClick={() => localIssue.setLocalIssue({ remembered: false })}>
            <BookmarkMinusIcon />
            {formatMessage({ id: "issues.context-menu.forgot" })}
          </ContextMenuItem>
        </>
      )}
    </>
  );
};
