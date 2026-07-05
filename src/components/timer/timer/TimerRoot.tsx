import { TIssue } from "@/api/redmine/types";
import { calculateTimerTotalElapsedTime, Timer } from "@/hooks/useTimers";
import { useInterval } from "@mantine/hooks";
import { createContext, PropsWithChildren, use, useEffect, useEffectEvent, useState } from "react";

type TimerContextType = {
  timer: Timer;
  issue?: TIssue;
  totalElapsedTime: number;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

type TimerRootProps = PropsWithChildren & {
  timer: Timer;
  issue?: TIssue;
};

export const TimerRoot = ({ timer, issue, children }: TimerRootProps) => {
  const [totalElapsedTime, setTotalElapsedTime] = useState(() => calculateTimerTotalElapsedTime(timer));

  const updateTimer = useEffectEvent(() => setTotalElapsedTime(calculateTimerTotalElapsedTime(timer)));
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => updateTimer(), [timer.elapsedTime, timer.activeSession]);

  const interval = useInterval(() => setTotalElapsedTime(calculateTimerTotalElapsedTime(timer)), 1000);
  const manageInterval = useEffectEvent((active: boolean) => (active ? interval.start() : interval.stop()));
  useEffect(() => manageInterval(!!timer.activeSession), [timer.activeSession]);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <TimerContext
      value={{
        timer,
        issue,
        totalElapsedTime,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </TimerContext>
  );
};

export const useTimerContext = () => {
  const context = use(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerComponents.Root component");
  }
  return context;
};
