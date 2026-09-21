import { ToggleableCard } from "@/components/general/ToggleableCard";
import { cn } from "@/lib/utils";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { ComponentProps } from "react";
import { useTimerContext } from "./TimerRoot";

export const TimerWrapper = ({ className, children, ...props }: ComponentProps<"div">) => {
  return (
    <div role="listitem" data-type="timer" {...props} className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
};

export const TimerWrapperCard = ({ className, ...props }: ComponentProps<typeof TimerWrapper>) => {
  const timerApi = useTimerApi();
  const { timer } = useTimerContext();

  return <ToggleableCard as={TimerWrapper} data-type="timer-card" {...props} className={cn("px-2 py-1", className)} onToggle={() => timerApi.toggleTimer(timer)} />;
};
