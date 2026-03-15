import { Skeleton } from "@/components/ui/skeleton";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerNameField = () => {
  const { formatMessage } = useIntl();
  const { timer } = useTimerContext();

  return (
    <input
      type="text"
      className="placeholder:text-muted-foreground text-foreground min-w-0 grow truncate bg-transparent placeholder:italic focus:outline-hidden"
      value={timer.name}
      placeholder={formatMessage({ id: "timer.unnamed-timer" })}
      tabIndex={-1}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      onChange={(e) => timer.setName(e.target.value)}
    />
  );
};

export const TimerNameFieldSkeleton = () => (
  <div className="min-w-0 grow">
    <Skeleton className="h-5 w-24" />
  </div>
);
