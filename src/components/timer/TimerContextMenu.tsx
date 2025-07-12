import { faPause, faPen, faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { TimerController } from "../../hooks/useTimers";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

type PropTypes = {
  timer: TimerController;
  children: ReactNode;
  onEdit: () => void;
};

const TimerContextMenu = ({ timer, children, onEdit }: PropTypes) => {
  const { formatMessage } = useIntl();

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={timer.isActive ? timer.pauseTimer : timer.startTimer}>
          <FontAwesomeIcon icon={timer.isActive ? faPause : faPlay} />
          {formatMessage({ id: timer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" })}
        </ContextMenuItem>
        <ContextMenuItem onClick={onEdit}>
          <FontAwesomeIcon icon={faPen} />
          {formatMessage({ id: "timer.context-menu.edit" })}
        </ContextMenuItem>
        <ContextMenuItem onClick={timer.resetTimer} disabled={timer.getElapsedTime() === 0}>
          <FontAwesomeIcon icon={faStop} />
          {formatMessage({ id: "timer.context-menu.reset" })}
        </ContextMenuItem>
        <ContextMenuItem onClick={timer.deleteTimer}>
          <FontAwesomeIcon icon={faTrash} />
          {formatMessage({ id: "timer.context-menu.delete" })}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TimerContextMenu;
