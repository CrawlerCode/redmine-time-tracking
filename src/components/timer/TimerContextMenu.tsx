import { PencilIcon, TimerIcon, TimerOffIcon, TimerResetIcon, TrashIcon } from "lucide-react";
import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { TimerController } from "../../hooks/useTimers";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

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
          {timer.isActive ? <TimerOffIcon /> : <TimerIcon />}
          {formatMessage({ id: timer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" })}
        </ContextMenuItem>
        <ContextMenuItem onClick={onEdit}>
          <PencilIcon />
          {formatMessage({ id: "timer.context-menu.edit" })}
        </ContextMenuItem>
        <ContextMenuItem onClick={timer.resetTimer} disabled={timer.getElapsedTime() === 0}>
          <TimerResetIcon />
          {formatMessage({ id: "timer.context-menu.reset" })}
        </ContextMenuItem>
        <ContextMenuItem onClick={timer.deleteTimer}>
          <TrashIcon />
          {formatMessage({ id: "timer.context-menu.delete" })}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TimerContextMenu;
