import HelpTooltip from "@/components/general/HelpTooltip";
import { TimerIcon, TimerOffIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerToggleButton = () => {
  const { formatMessage } = useIntl();

  const { timer } = useTimerContext();

  if (!timer.isActive) {
    return (
      <HelpTooltip message={formatMessage({ id: "issues.timer.action.start.tooltip" })}>
        <TimerIcon role="button" data-type="start-timer" className="size-6 shrink-0 cursor-pointer text-green-500 focus:outline-hidden" onClick={timer.startTimer} tabIndex={-1} />
      </HelpTooltip>
    );
  } else {
    return (
      <HelpTooltip message={formatMessage({ id: "issues.timer.action.pause.tooltip" })}>
        <TimerOffIcon role="button" data-type="pause-timer" className="size-6 shrink-0 cursor-pointer text-red-500 focus:outline-hidden" onClick={timer.pauseTimer} tabIndex={-1} />
      </HelpTooltip>
    );
  }
};
