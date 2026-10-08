import HelpTooltip from "@/components/general/HelpTooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerToggleButton = () => {
  const { formatMessage } = useIntl();

  const timerApi = useTimerApi();
  const { timer } = useTimerContext();

  const isRunning = !!timer.activeSession;

  return (
    <HelpTooltip message={formatMessage({ id: isRunning ? "issues.timer.action.pause.tooltip" : "issues.timer.action.start.tooltip" })}>
      <Button
        variant="ghost"
        size="icon-sm"
        data-action={isRunning ? "timer-pause" : "timer-start"}
        className={isRunning ? "text-yellow-500 hover:text-yellow-500" : "text-muted-foreground hover:text-foreground"}
        onClick={() => (isRunning ? timerApi.pauseTimer(timer) : timerApi.startTimer(timer))}
        tabIndex={-1}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </HelpTooltip>
  );
};

export const TimerToggleButtonSkeleton = () => <Skeleton className="size-6 rounded-md" />;
