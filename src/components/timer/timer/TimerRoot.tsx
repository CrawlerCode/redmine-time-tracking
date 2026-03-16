import { TIssue } from "@/api/redmine/types";
import { TimerController } from "@/hooks/useTimers";
import { createContext, PropsWithChildren, use, useEffect, useEffectEvent, useState } from "react";
import { useInterval } from "usehooks-ts";

type TimerContextType = {
  timer: TimerController;
  issue?: TIssue;
  currentTime: number;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

type TimerRootProps = PropsWithChildren & Pick<TimerContextType, "timer" | "issue">;

export const TimerRoot = ({ timer, issue, children }: TimerRootProps) => {
  const [currentTime, setCurrentTime] = useState(() => timer.getElapsedTime());

  const updateTimer = useEffectEvent(() => setCurrentTime(timer.getElapsedTime()));
  useEffect(() => updateTimer(), [timer.elapsedTime]);

  useInterval(() => setCurrentTime(timer.getElapsedTime()), timer.isActive ? 1000 : null);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <TimerContext
      value={{
        timer,
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
    throw new Error("useTimerContext must be used within a Timer.Root component");
  }
  return context;
};
