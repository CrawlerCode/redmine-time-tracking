import { PencilIcon, TimerIcon, TimerOffIcon, TimerResetIcon, TrashIcon } from "lucide-react";
import { ReactElement } from "react";
import { useIntl } from "react-intl";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../../ui/context-menu";
import { useTimerContext } from "./TimerRoot";

export const TimerContextMenu = ({ children }: { children: ReactElement }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger render={children} />
      <ContextMenuContent>
        <TimerContextMenuItems />
      </ContextMenuContent>
    </ContextMenu>
  );
};

const TimerContextMenuItems = () => {
  const { formatMessage } = useIntl();
  const { timer, setIsEditing } = useTimerContext();

  return (
    <>
      <ContextMenuItem onClick={timer.isActive ? timer.pauseTimer : timer.startTimer}>
        {timer.isActive ? <TimerOffIcon /> : <TimerIcon />}
        {formatMessage({ id: timer.isActive ? "timer.context-menu.pause" : "timer.context-menu.start" })}
      </ContextMenuItem>
      <ContextMenuItem onClick={() => setIsEditing(true)}>
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
    </>
  );
};
