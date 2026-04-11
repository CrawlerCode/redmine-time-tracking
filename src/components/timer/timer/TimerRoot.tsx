import { TIssue } from "@/api/redmine/types";
import { calculateTimerTotalElapsedTime, Timer } from "@/hooks/useTimers";
import { createContext, PropsWithChildren, use, useEffect, useEffectEvent, useState } from "react";
import { useInterval } from "usehooks-ts";

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
  useEffect(() => updateTimer(), [timer.elapsedTime, timer.activeSession]);

  useInterval(() => setTotalElapsedTime(calculateTimerTotalElapsedTime(timer)), timer.activeSession ? 1000 : null);

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
