import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faAdd, faArrowUpRightFromSquare, faBan, faBookmark, faNoteSticky, faPause, faPen, faPlay, faStop, faThumbTack, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { LocalIssue } from "../../hooks/useLocalIssues";
import { TimerController } from "../../hooks/useTimers";
import { useSettings } from "../../provider/SettingsProvider";
import { TIssue } from "../../types/redmine";
import ContextMenu from "../general/ContextMenu";
import Toast from "../general/Toast";
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

  const [copiedIdToClipboard, setCopiedIdToClipboard] = useState(false);
  const [editIssue, setEditIssue] = useState(false);
  const [addNotes, setAddNotes] = useState(false);

  return (
    <>
      <ContextMenu
        menu={[
          [
            {
              name: formatMessage({ id: "issues.context-menu.open-in-redmine" }),
              icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} />,
              onClick: () => {
                window.open(`${settings.redmineURL}/issues/${issue.id}`, "_blank");
              },
            },
          ],
          [
            {
              name: formatMessage({ id: "issues.context-menu.copy-id-to-clipboard" }),
              icon: <FontAwesomeIcon icon={faCopy} />,
              onClick: () => {
                navigator.clipboard.writeText(`#${issue.id}`);
                setCopiedIdToClipboard(true);
              },
            },
          ],
          [
            {
              name: formatMessage({ id: "issues.context-menu.edit" }),
              icon: <FontAwesomeIcon icon={faPen} />,
              onClick: () => setEditIssue(true),
              disabled: !canEdit,
            },
            {
              name: formatMessage({ id: "issues.context-menu.add-notes" }),
              icon: <FontAwesomeIcon icon={faNoteSticky} />,
              onClick: () => setAddNotes(true),
              disabled: !canAddNotes,
            },
          ],
          [
            {
              name: formatMessage({ id: primaryTimer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" }),
              icon: <FontAwesomeIcon icon={primaryTimer.isActive ? faPause : faPlay} />,
              onClick: primaryTimer.isActive ? primaryTimer.pauseTimer : primaryTimer.startTimer,
              disabled: !canLogTime,
            },
            {
              name: formatMessage({ id: "timer.context-menu.reset" }),
              icon: <FontAwesomeIcon icon={faStop} />,
              onClick: primaryTimer.resetTimer,
              disabled: primaryTimer.getElapsedTime() === 0 || !canLogTime,
            },
            {
              name: formatMessage({ id: "timer.context-menu.add-timer" }),
              icon: <FontAwesomeIcon icon={faAdd} />,
              onClick: onAddTimer,
              disabled: !canLogTime,
            },
          ],
          [
            {
              name: formatMessage({ id: assignedToMe || localIssue.remembered ? "issues.context-menu.pin" : "issues.context-menu.pin-and-remember" }),
              icon: <FontAwesomeIcon icon={faThumbTack} className="rotate-30" />,
              onClick: () => localIssue.setLocalIssue({ pinned: true, remembered: !assignedToMe ? true : undefined }),
              disabled: localIssue.pinned,
            },
            {
              name: formatMessage({ id: "issues.context-menu.unpin" }),
              icon: <FontAwesomeIcon icon={faXmark} />,
              onClick: () => localIssue.setLocalIssue({ pinned: false }),
              disabled: !localIssue.pinned,
            },
          ],
          ...(!assignedToMe
            ? [
                [
                  {
                    name: formatMessage({ id: "issues.context-menu.remember" }),
                    icon: <FontAwesomeIcon icon={faBookmark} />,
                    onClick: () =>
                      localIssue.setLocalIssue({
                        remembered: true,
                      }),
                    disabled: localIssue.remembered,
                  },
                  {
                    name: formatMessage({ id: "issues.context-menu.forgot" }),
                    icon: <FontAwesomeIcon icon={faBan} />,
                    onClick: () =>
                      localIssue.setLocalIssue({
                        remembered: false,
                      }),
                    disabled: !localIssue.remembered,
                  },
                ],
              ]
            : []),
        ]}
      >
        {children}
      </ContextMenu>

      {editIssue && <EditIssueModal issue={issue} onClose={() => setEditIssue(false)} onSuccess={() => setEditIssue(false)} />}
      {addNotes && <AddIssueNotesModal issue={issue} onClose={() => setAddNotes(false)} onSuccess={() => setAddNotes(false)} />}
      {copiedIdToClipboard && (
        <Toast type="success" message={formatMessage({ id: "issues.id-copied-to-clipboard" }, { issueId: issue.id })} autoClose={2500} onClose={() => setCopiedIdToClipboard(false)} />
      )}
    </>
  );
};

export default IssueContextMenu;
