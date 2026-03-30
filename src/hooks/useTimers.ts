import { TIssue } from "@/api/redmine/types";
import { TimerSearchContext } from "@/components/timer/TimerSearch";
import { useSettings } from "../provider/SettingsProvider";
import { getStorage, setStorage, useSuspenseStorage } from "./useStorage";

export type Timer = {
  id: string;
  issueId: number;
  name?: string;
  isActive: boolean;
  startTime?: number;
  elapsedTime: number;
};

const TIMERS_KEY = "timers";
const _defaultTimers: Record<string, Timer> = {};

export const calculateElapsedTime = (timer: Timer) => timer.elapsedTime + (timer.startTime ? Date.now() - timer.startTime : 0);

const toStartedTimer = (timer: Timer): Timer => ({
  ...timer,
  isActive: true,
  startTime: Date.now(),
});

const toPausedTimer = (timer: Timer): Timer => ({
  ...timer,
  isActive: false,
  startTime: undefined,
  elapsedTime: calculateElapsedTime(timer),
});

export const newTimer = (timer: Pick<Timer, "issueId"> & Partial<Timer>): Timer => ({
  id: crypto.randomUUID(),
  isActive: false,
  startTime: undefined,
  elapsedTime: 0,
  ...timer,
});

const pauseAllActiveTimers = (all: Record<string, Timer>): Record<string, Timer> =>
  Object.entries(all).reduce<Record<string, Timer>>((res, [id, timer]) => {
    if (timer.isActive) res[id] = toPausedTimer(timer);
    return res;
  }, all);

/**
 * Hook to get timers
 */
const useTimers = () => {
  const { data } = useSuspenseStorage<Record<string, Timer>>(TIMERS_KEY, _defaultTimers);

  const timersArray = Object.values(data);

  return {
    getIssuesIds: () => Array.from(new Set(timersArray.map((t) => t.issueId))),

    getActiveTimerCount: () => timersArray.reduce((count, t) => count + (t.isActive ? 1 : 0), 0),

    getAllTimers: () => timersArray,

    getTimersByIssue: (issueId: number) => {
      const timers = timersArray.filter((t) => t.issueId === issueId);
      if (timers.length === 0) timers.push(newTimer({ issueId }));
      return timers.sort((a, b) => (a.isActive ? -1 : 0) - (b.isActive ? -1 : 0) || calculateElapsedTime(b) - calculateElapsedTime(a));
    },

    searchTimers: (search: TimerSearchContext, issues?: TIssue[]) => {
      let timers = timersArray;
      if (search.isSearching && search.query) {
        timers = timers.filter((timer) => {
          if (timer.name && new RegExp(search.query, "i").test(timer.name)) return true;
          const issue = issues?.find((issue) => issue.id === timer.issueId);
          return issue ? new RegExp(search.query, "i").test(`#${issue.id} ${issue.subject}`) : new RegExp(search.query, "i").test(`#${timer.issueId}`);
        });
      }
      return timers;
    },
  };
};

/**
 * Hook to get timer API functions such as start, pause, reset, etc.
 */
export const useTimerApi = () => {
  const { settings } = useSettings();
  const { data, setData } = useSuspenseStorage<Record<string, Timer>>(TIMERS_KEY, _defaultTimers);

  const withAutoPause = (all: Record<string, Timer>) => (settings.features.autoPauseOnSwitch ? pauseAllActiveTimers(all) : all);

  return {
    startTimer: async (timer: Timer) => {
      await setData({ ...withAutoPause(data), [timer.id]: toStartedTimer(timer) });
    },

    pauseTimer: async (timer: Timer) => {
      await setData({ ...data, [timer.id]: toPausedTimer(timer) });
    },

    toggleTimer: async (timer: Timer) => {
      if (timer.isActive) {
        await setData({ ...data, [timer.id]: toPausedTimer(timer) });
      } else {
        await setData({ ...withAutoPause(data), [timer.id]: toStartedTimer(timer) });
      }
    },

    resetTimer: async (timer: Timer) => {
      await setData({ ...data, [timer.id]: { ...timer, isActive: false, startTime: undefined, elapsedTime: 0 } });
    },

    deleteTimer: async (timer: Timer) => {
      const next = { ...data };
      delete next[timer.id];
      await setData(next);
    },

    setElapsedTime: async (timer: Timer, time: number) => {
      await setData({
        ...data,
        [timer.id]: {
          ...timer,
          elapsedTime: time,
          ...(timer.isActive ? { startTime: Date.now() } : {}),
        },
      });
    },

    setName: async (timer: Timer, name: string) => {
      await setData({ ...data, [timer.id]: { ...timer, name } });
    },

    addTimer: async (issueId: number) => {
      const timer = newTimer({ issueId });
      await setData({ ...data, [timer.id]: timer });
    },

    addTimers: async (timers: (Pick<Timer, "issueId"> & Partial<Timer>)[]) => {
      const additions = timers.reduce<Record<string, Timer>>((acc, timer) => {
        const t = newTimer(timer);
        acc[t.id] = t;
        return acc;
      }, {});
      await setData({ ...data, ...additions });
    },
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
  const timers = await getStorage<Record<string, Timer>>(TIMERS_KEY, _defaultTimers);

  const newTimers = Object.entries(legacyIssues)
    .filter(([_, issue]) => issue.start || issue.time)
    .map(
      ([id, issue]) =>
        ({
          issueId: Number(id),
          isActive: issue.active,
          startTime: issue.start,
          elapsedTime: issue.time,
        }) satisfies Omit<Timer, "id">
    )
    .reduce((acc, timer) => {
      const t = newTimer(timer);
      acc[t.id] = t;
      return acc;
    }, timers);

  await setStorage(TIMERS_KEY, newTimers);
};

export type TimerApi = ReturnType<typeof useTimerApi>;

export default useTimers;
