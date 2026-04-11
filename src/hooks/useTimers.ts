import { TIssue } from "@/api/redmine/types";
import { TimerSearchContext } from "@/components/timer/TimerSearch";
import { useSettings } from "../provider/SettingsProvider";
import { getStorage, setStorage, useSuspenseStorage } from "./useStorage";

export type Timer = {
  id: string;
  issueId: number;
  name?: string;
  elapsedTime: number;
  activeSession?: { start: number };
  sessions: { id: string; start: number; end: number }[];
};

const TIMERS_KEY = "timers";
const _defaultTimers: Record<string, Timer> = {};

export const calculateActiveSessionElapsedTime = (timer: Timer) => (timer.activeSession ? Date.now() - timer.activeSession.start : 0);
export const calculateTimerTotalElapsedTime = (timer: Timer) => timer.elapsedTime + calculateActiveSessionElapsedTime(timer);

const newTimer = (timer: Pick<Timer, "issueId"> & Partial<Timer>): Timer => ({
  id: crypto.randomUUID(),
  elapsedTime: 0,
  activeSession: undefined,
  sessions: [],
  ...timer,
});

/**
 * Hook to get timers
 */
const useTimers = () => {
  const { data } = useSuspenseStorage<Record<string, Timer>>(TIMERS_KEY, _defaultTimers);

  const timersArray = Object.values(data);

  return {
    getIssuesIds: () => Array.from(new Set(timersArray.map((t) => t.issueId))),

    getActiveTimerCount: () => timersArray.reduce((count, t) => count + (t.activeSession ? 1 : 0), 0),

    getAllTimers: () => timersArray,

    getTimersByIssue: (issueId: number) => {
      const timers = timersArray.filter((t) => t.issueId === issueId);
      if (timers.length === 0) timers.push(newTimer({ issueId }));
      return timers.sort((a, b) => (a.activeSession ? -1 : 0) - (b.activeSession ? -1 : 0) || calculateTimerTotalElapsedTime(b) - calculateTimerTotalElapsedTime(a));
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

const startTimerSession = (timer: Timer): Timer => ({
  ...timer,
  activeSession: { start: Date.now() },
});

const stopTimerSession = (timer: Timer): Timer => {
  if (!timer.activeSession) return timer;
  const activeSession = { start: timer.activeSession.start, end: Date.now() };
  const duration = activeSession.end - activeSession.start;
  return {
    ...timer,
    activeSession: undefined,
    ...(duration > 1000 && {
      elapsedTime: timer.elapsedTime + duration,
      sessions: [...timer.sessions, { id: crypto.randomUUID(), ...activeSession }],
    }),
  };
};

const stopAllTimers = (all: Record<string, Timer>): Record<string, Timer> =>
  Object.entries(all).reduce<Record<string, Timer>>((res, [id, timer]) => {
    res[id] = timer.activeSession ? stopTimerSession(timer) : timer;
    return res;
  }, {});

/**
 * Hook to get timer API functions such as start, pause, reset, etc.
 */
export const useTimerApiActions = () => {
  const { settings } = useSettings();
  const { setData } = useSuspenseStorage<Record<string, Timer>>(TIMERS_KEY, _defaultTimers);

  const withAutoPauseSessions = (all: Record<string, Timer>) => (settings.features.autoPauseOnSwitch ? stopAllTimers(all) : all);

  return {
    startTimer: async (timer: Timer) => {
      await setData((prev) => ({ ...withAutoPauseSessions(prev), [timer.id]: startTimerSession(timer) }));
    },

    pauseTimer: async (timer: Timer) => {
      await setData((prev) => ({ ...prev, [timer.id]: stopTimerSession(timer) }));
    },

    toggleTimer: async (timer: Timer) => {
      if (timer.activeSession) {
        await setData((prev) => ({ ...prev, [timer.id]: stopTimerSession(timer) }));
      } else {
        await setData((prev) => ({ ...withAutoPauseSessions(prev), [timer.id]: startTimerSession(timer) }));
      }
    },

    resetTimer: async (timer: Timer) => {
      await setData((prev) => ({ ...prev, [timer.id]: { ...timer, elapsedTime: 0, activeSession: undefined, sessions: [] } }));
    },

    deleteTimer: async (timer: Timer) => {
      await setData((prev) => {
        const next = { ...prev };
        delete next[timer.id];
        return next;
      });
    },

    setTotalElapsedTime: async (timer: Timer, totalElapsedTime: number) => {
      await setData((prev) => ({
        ...prev,
        [timer.id]: {
          ...timer,
          ...(timer.activeSession && startTimerSession(stopTimerSession(timer))),
          elapsedTime: totalElapsedTime,
        },
      }));
    },

    setName: async (timer: Timer, name: string) => {
      await setData((prev) => ({ ...prev, [timer.id]: { ...timer, name } }));
    },

    addTimer: async (issueId: number) => {
      const timer = newTimer({ issueId });
      await setData((prev) => ({ ...prev, [timer.id]: timer }));
    },

    addTimers: async (timers: (Pick<Timer, "issueId"> & Partial<Timer>)[]) => {
      const additions = timers.reduce<Record<string, Timer>>((acc, timer) => {
        const t = newTimer(timer);
        acc[t.id] = t;
        return acc;
      }, {});
      await setData((prev) => ({ ...prev, ...additions }));
    },

    removeTimerSession: async (timer: Timer, sessionId: string) => {
      if (sessionId === "active" && timer.activeSession) {
        await setData((prev) => ({
          ...prev,
          [timer.id]: {
            ...timer,
            activeSession: undefined,
          },
        }));
        return;
      }

      const session = timer.sessions.find((s) => s.id === sessionId);
      if (!session) return;

      await setData((prev) => ({
        ...prev,
        [timer.id]: {
          ...timer,
          elapsedTime: Math.max(0, timer.elapsedTime - (session.end - session.start)),
          sessions: timer.sessions.filter((s) => s.id !== sessionId),
        },
      }));
    },
  };
};

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
          elapsedTime: issue.time,
          activeSession: issue.active && issue.start ? { start: issue.start } : undefined,
          sessions: [],
        }) satisfies Omit<Timer, "id">
    )
    .reduce((acc, timer) => {
      const t = newTimer(timer);
      acc[t.id] = t;
      return acc;
    }, timers);

  await setStorage(TIMERS_KEY, newTimers);
};

export default useTimers;
