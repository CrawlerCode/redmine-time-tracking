import { TIssue } from "@/api/redmine/types";
import { TimerSearchContext } from "@/components/timer/TimerSearch";
import { useMemo } from "react";
import { useSettings } from "../provider/SettingsProvider";
import { getStorage, setStorage, useSuspenseStorage } from "./useStorage";

type TimerInfo = {
  id: string;
  issueId: number;
  name?: string;
  isActive: boolean;
  startTime?: number;
  elapsedTime: number;
};

export type TimerController = TimerInfo & {
  getElapsedTime: () => number;
  startTimer: () => void;
  pauseTimer: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  deleteTimer: () => void;
  setElapsedTime: (time: number) => void;
  setName: (name: string) => void;
};

const _defaultTimers: Record<string, TimerInfo> = {};

/**
 * Hook for managing timers
 */
const useTimers = () => {
  const { settings } = useSettings();

  const { data: timerInfos, setData: saveTimerInfos } = useSuspenseStorage<Record<string, TimerInfo>>("timers", _defaultTimers);
  const timerInfosArray = useMemo(() => Object.values(timerInfos), [timerInfos]);

  return useMemo(() => {
    /**
     * Function to get a TimerController for a specific timer
     */
    const getTimerController = (timerInfo: TimerInfo): TimerController => {
      const updateTimerInfo = (updatedInfo: Partial<TimerInfo>) =>
        saveTimerInfos({
          ...timerInfos,
          [timerInfo.id]: {
            ...timerInfo,
            ...updatedInfo,
          },
        });

      return {
        ...timerInfo,
        /**
         * Get the elapsed time for the timer
         */
        getElapsedTime: () => calculateElapsedTime(timerInfo),
        /**
         * Start the timer
         */
        startTimer: () => {
          saveTimerInfos({
            ...(settings.features.autoPauseOnSwitch
              ? Object.entries(timerInfos).reduce((res: Record<string, TimerInfo>, [id, timerInfo]) => {
                  if (timerInfo.isActive) {
                    res[id] = toPausedTimer(timerInfo);
                  }
                  return res;
                }, timerInfos)
              : timerInfos),
            [timerInfo.id]: toStartedTimer(timerInfo),
          });
        },
        /**
         * Pause the timer
         */
        pauseTimer: () => {
          updateTimerInfo(toPausedTimer(timerInfo));
        },
        /**
         * Toggle the timer between active and paused states
         */
        toggleTimer: () => {
          if (timerInfo.isActive) {
            updateTimerInfo(toPausedTimer(timerInfo));
          } else {
            saveTimerInfos({
              ...(settings.features.autoPauseOnSwitch
                ? Object.entries(timerInfos).reduce((res: Record<string, TimerInfo>, [id, timerInfo]) => {
                    if (timerInfo.isActive) {
                      res[id] = toPausedTimer(timerInfo);
                    }
                    return res;
                  }, timerInfos)
                : timerInfos),
              [timerInfo.id]: toStartedTimer(timerInfo),
            });
          }
        },
        /**
         * Reset the timer to its initial state
         */
        resetTimer: () => {
          updateTimerInfo({
            isActive: false,
            startTime: undefined,
            elapsedTime: 0,
          });
        },
        /**
         * Delete the timer
         */
        deleteTimer: () => {
          const newTimerInfos = { ...timerInfos };
          delete newTimerInfos[timerInfo.id];
          saveTimerInfos(newTimerInfos);
        },
        /**
         * Overwrite the elapsed time of the timer
         */
        setElapsedTime: (time: number) => {
          updateTimerInfo({
            elapsedTime: time,
            ...(timerInfo.isActive ? { startTime: new Date().getTime() } : {}),
          });
        },
        /**
         * Set the name of the timer
         */
        setName: (name: string) => {
          updateTimerInfo({ name });
        },
      };
    };

    return {
      /**
       * Get all timer issue ids
       */
      getIssuesIds: () => Array.from(new Set(timerInfosArray.map((timerInfo) => timerInfo.issueId))),
      /**
       * Get active timer count
       */
      getActiveTimerCount: () => timerInfosArray.reduce((count, timerInfo) => count + (timerInfo.isActive ? 1 : 0), 0),
      /**
       * Get all timers
       */
      getAllTimers: () => timerInfosArray.map(getTimerController),
      /**
       * Get all timers for a specific issue (sorted by active state and elapsed time)
       */
      getTimersByIssue: (issueId: number) => {
        const timers = timerInfosArray.filter((timerInfo) => timerInfo.issueId === issueId);

        if (timers.length === 0) {
          timers.push(newTimer({ issueId }));
        }

        return timers.map(getTimerController).sort((a, b) => (a.isActive ? -1 : 0) - (b.isActive ? -1 : 0) || b.getElapsedTime() - a.getElapsedTime());
      },
      /**
       * Search timers by name
       */
      searchTimers: (search: TimerSearchContext, issues?: TIssue[]) => {
        let timers = timerInfosArray;

        // local search
        if (search.isSearching && search.query) {
          timers = timers.filter((timer) => {
            // Match by timer name
            if (timer.name && new RegExp(search.query, "i").test(timer.name)) {
              return true;
            }

            // Match by issue
            const issue = issues?.find((issue) => issue.id === timer.issueId);
            if (issue ? new RegExp(search.query, "i").test(`#${issue.id} ${issue.subject}`) : new RegExp(search.query, "i").test(`#${timer.issueId}`)) {
              return true;
            }

            return false;
          });
        }

        return timers.map(getTimerController);
      },
      /**
       * Add a new timer
       */
      addTimer: (issueId: number) => {
        const timer = newTimer({
          issueId,
        });
        saveTimerInfos({
          ...timerInfos,
          [timer.id]: timer,
        });
      },
      /**
       * Add multiple timers
       */
      addTimers(timers: (Pick<TimerInfo, "issueId"> & Partial<TimerInfo>)[]) {
        const newTimers = timers.reduce(
          (acc, timer) => {
            const newTime = newTimer(timer);
            acc[newTime.id] = newTime;
            return acc;
          },
          {} as Record<string, TimerInfo>
        );
        saveTimerInfos({ ...timerInfos, ...newTimers });
      },
    };
  }, [timerInfos, saveTimerInfos, timerInfosArray, settings.features.autoPauseOnSwitch]);
};

const calculateElapsedTime = (timerInfo: TimerInfo) => {
  return timerInfo.elapsedTime + (timerInfo.startTime ? new Date().getTime() - timerInfo.startTime : 0);
};

const toStartedTimer = (timerInfo: TimerInfo): TimerInfo => ({
  ...timerInfo,
  isActive: true,
  startTime: new Date().getTime(),
});

const toPausedTimer = (timerInfo: TimerInfo): TimerInfo => ({
  ...timerInfo,
  isActive: false,
  startTime: undefined,
  elapsedTime: calculateElapsedTime(timerInfo),
});

const newTimer = (timerInfo: Pick<TimerInfo, "issueId"> & Partial<TimerInfo>): TimerInfo => ({
  id: crypto.randomUUID(),
  isActive: false,
  startTime: undefined,
  elapsedTime: 0,
  ...timerInfo,
});

/**
 * Migrate legacy issue data from "issues" storage to "timers" storage
 */
export const runTimersMigration = async (
  legacyIssues: Record<
    number,
    {
      active: boolean;
      start?: number;
      time: number;
    }
  >
) => {
  const timerInfos = await getStorage<Record<string, TimerInfo>>("timers", _defaultTimers);

  const newTimerInfos = Object.entries(legacyIssues)
    .filter(([_, issue]) => issue.start || issue.time)
    .map(
      ([id, issue]) =>
        ({
          issueId: Number(id),
          isActive: issue.active,
          startTime: issue.start,
          elapsedTime: issue.time,
        }) satisfies Omit<TimerInfo, "id">
    )
    .reduce((acc, timer) => {
      const newTime = newTimer(timer);
      acc[newTime.id] = newTime;
      return acc;
    }, timerInfos);

  await setStorage("timers", newTimerInfos);
};

export default useTimers;
