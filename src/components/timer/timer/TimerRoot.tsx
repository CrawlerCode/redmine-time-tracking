import { TIssue } from "@/api/redmine/types";
import { calculateElapsedTime, Timer, TimerApi, useTimerApi } from "@/hooks/useTimers";
import { createContext, PropsWithChildren, use, useEffect, useEffectEvent, useState } from "react";
import { useInterval } from "usehooks-ts";

type TimerContextType = {
  timer: Timer;
  timerApi: TimerApi;
  issue?: TIssue;
  currentTime: number;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

type TimerRootProps = PropsWithChildren & {
  timer: Timer;
  issue?: TIssue;
};

export const TimerRoot = ({ timer, issue, children }: TimerRootProps) => {
  const timerApi = useTimerApi();

  const [currentTime, setCurrentTime] = useState(() => calculateElapsedTime(timer));

  const updateTimer = useEffectEvent(() => setCurrentTime(calculateElapsedTime(timer)));
  useEffect(() => updateTimer(), [timer.elapsedTime]);

  useInterval(() => setCurrentTime(calculateElapsedTime(timer)), timer.isActive ? 1000 : null);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <TimerContext
      value={{
        timer,
        timerApi,
        issue,
        currentTime,
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
