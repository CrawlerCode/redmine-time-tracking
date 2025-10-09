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
import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../ui/context-menu";
import AddIssueNotesModal from "./AddIssueNotesModal";
import EditIssueModal from "./EditIssueModal";

type PropTypes = {
  issue: TIssue;
  localIssue: LocalIssue;
  primaryTimer: TimerController;
  assignedToMe: boolean;
  canEdit: boolean;
  canLogTime: boolean;
  canAddNotes: boolean;
  onAddTimer: () => void;
  children: ReactNode;
};

const IssueContextMenu = ({ issue, localIssue, primaryTimer, assignedToMe, canEdit, canLogTime, canAddNotes, onAddTimer, children }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const [editIssue, setEditIssue] = useState(false);
  const [addNotes, setAddNotes] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
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
          <ContextMenuItem disabled={!canEdit} onClick={() => setEditIssue(true)}>
            <PencilIcon />
            {formatMessage({ id: "issues.context-menu.edit" })}
          </ContextMenuItem>
          <ContextMenuItem disabled={!canAddNotes} onClick={() => setAddNotes(true)}>
            <NotebookPenIcon />
            {formatMessage({ id: "issues.context-menu.add-notes" })}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={primaryTimer.isActive ? primaryTimer.pauseTimer : primaryTimer.startTimer} disabled={!canLogTime}>
            {primaryTimer.isActive ? <TimerOffIcon /> : <TimerIcon />}
            {formatMessage({ id: primaryTimer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" })}
          </ContextMenuItem>
          <ContextMenuItem onClick={primaryTimer.resetTimer} disabled={primaryTimer.getElapsedTime() === 0 || !canLogTime}>
            <TimerResetIcon />
            {formatMessage({ id: "timer.context-menu.reset" })}
          </ContextMenuItem>
          <ContextMenuItem onClick={onAddTimer} disabled={!canLogTime}>
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
        </ContextMenuContent>
      </ContextMenu>

      {editIssue && <EditIssueModal issue={issue} onClose={() => setEditIssue(false)} onSuccess={() => setEditIssue(false)} />}
      {addNotes && <AddIssueNotesModal issue={issue} onClose={() => setAddNotes(false)} onSuccess={() => setAddNotes(false)} />}
    </>
  );
};

export default IssueContextMenu;
