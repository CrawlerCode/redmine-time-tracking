import { Skeleton } from "@/components/ui/skeleton";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { useEffect, useEffectEvent, useState } from "react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerNameField = () => {
  const { formatMessage } = useIntl();
  const timerApi = useTimerApi();
  const { timer } = useTimerContext();

  const [name, setName] = useState(timer.name);
  const updateName = useEffectEvent(setName);
  useEffect(() => updateName(timer.name), [timer.name]);

  return (
    <input
      type="text"
      className="placeholder:text-muted-foreground text-foreground min-w-0 grow truncate bg-transparent pr-1 placeholder:italic focus:outline-hidden"
      placeholder={formatMessage({ id: "timer.unnamed-timer" })}
      tabIndex={-1}
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={() => timerApi.setName(timer, name)}
    />
  );
};

export const TimerNameFieldSkeleton = () => (
  <div className="min-w-0 grow">
    <Skeleton className="h-5 w-24" />
  </div>
);
