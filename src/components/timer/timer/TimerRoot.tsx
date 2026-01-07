import { TIssue } from "@/api/redmine/types";
import { TimerController } from "@/hooks/useTimers";
import { createContext, PropsWithChildren, use, useEffect, useState } from "react";

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
  const [currentTime, setCurrentTime] = useState(timer.getElapsedTime());
  useEffect(() => {
    const timeout = setTimeout(() => setCurrentTime(timer.getElapsedTime()), 0);
    if (timer.isActive) {
      const timerInterval = setInterval(() => {
        setCurrentTime(timer.getElapsedTime());
      }, 1000);
      return () => {
        clearTimeout(timeout);
        clearInterval(timerInterval);
      };
    } else {
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [timer]);

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
