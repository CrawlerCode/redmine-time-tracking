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
  const { timer, timerApi, totalElapsedTime, setIsEditing } = useTimerContext();

  return (
    <>
      <ContextMenuItem onClick={timer.activeSession ? () => timerApi.pauseTimer(timer) : () => timerApi.startTimer(timer)}>
        {timer.activeSession ? <TimerOffIcon /> : <TimerIcon />}
        {formatMessage({ id: timer.activeSession ? "timer.context-menu.pause" : "timer.context-menu.start" })}
      </ContextMenuItem>
      <ContextMenuItem onClick={() => setIsEditing(true)}>
        <PencilIcon />
        {formatMessage({ id: "timer.context-menu.edit" })}
      </ContextMenuItem>
      <ContextMenuItem onClick={() => timerApi.resetTimer(timer)} disabled={totalElapsedTime === 0}>
        <TimerResetIcon />
        {formatMessage({ id: "timer.context-menu.reset" })}
      </ContextMenuItem>
      <ContextMenuItem onClick={() => timerApi.deleteTimer(timer)}>
        <TrashIcon />
        {formatMessage({ id: "timer.context-menu.delete" })}
      </ContextMenuItem>
    </>
  );
};
