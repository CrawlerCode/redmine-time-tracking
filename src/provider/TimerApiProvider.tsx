import { useTimerApiActions } from "@/hooks/useTimers";
import { createContext, PropsWithChildren, use } from "react";

type TimerApi = ReturnType<typeof useTimerApiActions>;

const TimerApiContext = createContext<TimerApi | undefined>(undefined);

export const TimerApiProvider = ({ children }: PropsWithChildren) => {
  const timerApi = useTimerApiActions();

  return <TimerApiContext value={timerApi}>{children}</TimerApiContext>;
};

export const useTimerApi = (): TimerApi => {
  const context = use(TimerApiContext);
  if (!context) {
    throw new Error("useTimerApi must be used within a TimerApiProvider");
  }
  return context;
};
