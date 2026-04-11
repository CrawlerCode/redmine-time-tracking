import { ToggleableCard } from "@/components/general/ToggleableCard";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { clsxm } from "@/utils/clsxm";
import clsx from "clsx";
import { ComponentProps } from "react";
import { useTimerContext } from "./TimerRoot";

export const TimerWrapper = ({ className, children, ...props }: ComponentProps<"div">) => {
  return (
    <div {...props} role="listitem" data-type="timer" className={clsxm("flex items-center gap-x-3", className)}>
      {children}
    </div>
  );
};

export const TimerWrapperCard = ({ className, ...props }: ComponentProps<typeof TimerWrapper>) => {
  const timerApi = useTimerApi();
  const { timer } = useTimerContext();

  return <ToggleableCard as={TimerWrapper} {...props} className={clsx("px-1.5", className)} onToggle={() => timerApi.toggleTimer(timer)} />;
};
