import { useSettings } from "../provider/SettingsProvider";
import useStorage from "./useStorage";

type TimerData = {
  active: boolean;
  start?: number;
  time: number;
  pinned: boolean;
  remembered: boolean;
};
export type TimersData = Record<number, TimerData>;

export type Timer = TimerData & {
  getCurrentTime: () => number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimer: (time: number) => void;
  setRemembered: (remembered: boolean) => void;
  setPinned: (pinned: boolean) => void;
  setRememberedAndPinned: (remembered: boolean, pinned: boolean) => void;
};

const _defaultIssues: TimersData = {};

/**
 * Hook for managing timers
 */
const useTimers = () => {
  const { settings } = useSettings();
  const { data: timers, setData: setTimers, isLoading } = useStorage<TimersData>("issues", _defaultIssues);

  return {
    timers,
    isLoading,
    /**
     * Get active timer count
     */
    getActiveTimerCount: () => Object.values(timers).reduce((count, data) => count + (data.active ? 1 : 0), 0),
    /**
     * Get timer by id
     */
    getTimer: (id: number): Timer => {
      const timer: TimerData = timers[id] ?? {
        active: false,
        start: undefined,
        time: 0,
        pinned: false,
        remembered: false,
      };

      return {
        ...timer,
        /**
         * Get current time
         */
        getCurrentTime: () => calcTime(timer.time, timer.start),
        /**
         * Start the timer
         */
        startTimer: () => {
          setTimers({
            ...(settings.features.autoPauseOnSwitch
              ? Object.entries(timers).reduce((res: TimersData, [id, val]) => {
                  res[Number(id)] = val.active
                    ? {
                        ...val,
                        active: false,
                        start: undefined,
                        time: calcTime(val.time, val.start),
                      }
                    : val;
                  return res;
                }, {})
              : timers),
            [id]: {
              ...timer,
              active: true,
              start: new Date().getTime(),
              time: timer.time,
            },
          });
        },
        /**
         * Pause the timer
         */
        pauseTimer: () => {
          setTimers({
            ...timers,
            [id]: {
              ...timer,
              active: false,
              start: undefined,
              time: calcTime(timer.time, timer.start),
            },
          });
        },
        /**
         * Reset the timer
         */
        resetTimer: () => {
          const newTimersData = {
            ...timers,
            [id]: {
              ...timer,
              active: false,
              start: undefined,
              time: 0,
            },
          };
          if (!timer.pinned && !timer.remembered) {
            delete newTimersData[id];
          }
          setTimers(newTimersData);
        },
        /**
         * Override the timer time
         */
        setTimer: (time: number) => {
          setTimers({
            ...timers,
            [id]: {
              ...timer,
              time: time,
              ...(timer.active
                ? {
                    start: new Date().getTime(),
                  }
                : {}),
            },
          });
        },
        /**
         * Remember the timer
         */
        setRemembered: (remembered: boolean) => {
          setTimers({
            ...timers,
            [id]: {
              ...timer,
              remembered,
            },
          });
        },
        /**
         * Pin the timer
         */
        setPinned: (pinned: boolean) => {
          setTimers({
            ...timers,
            [id]: {
              ...timer,
              pinned,
            },
          });
        },
        /**
         * Remember and pin the timer
         */
        setRememberedAndPinned: (remembered: boolean, pinned: boolean) => {
          setTimers({
            ...timers,
            [id]: {
              ...timer,
              remembered,
              pinned,
            },
          });
        },
      };
    },
  };
};

const calcTime = (time: number, start?: number) => {
  return time + (start ? new Date().getTime() - start : 0);
};

export default useTimers;
