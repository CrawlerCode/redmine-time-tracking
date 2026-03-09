import { getStorage, setStorage, useSuspenseStorage } from "./useStorage";

export type LocalIssueData = {
  id: number;
  pinned: boolean;
  remembered: boolean;
};

export type LocalIssue = LocalIssueData & {
  setLocalIssue: (data: Partial<Omit<LocalIssueData, "id">>) => void;
};

const _defaultLocalIssues: LocalIssueData[] = [];

const defaultLocalIssueData: Omit<LocalIssueData, "id"> = {
  pinned: false,
  remembered: false,
};

const useLocalIssues = () => {
  const { data: localIssues, setData: setLocalIssues } = useSuspenseStorage<LocalIssueData[]>("localIssues", _defaultLocalIssues);

  return {
    localIssues,
    getIssuesIds: () => localIssues.map((issue) => issue.id),
    getLocalIssue: (id: number): LocalIssue => {
      const localIssue = localIssues.find((localIssue) => localIssue.id === id) ?? { id, ...defaultLocalIssueData };

      return {
        ...localIssue,
        setLocalIssue: (data) => {
          const newLocalIssues = localIssues.filter((l) => l.id !== id);
          const updatedLocalIssue = { ...localIssue, ...data };

          // Only add non-default local issues
          if (!isDefaultLocalIssue(updatedLocalIssue)) {
            newLocalIssues.push(updatedLocalIssue);
          }

          setLocalIssues(newLocalIssues);
        },
      };
    },
  };
};

const isDefaultLocalIssue = (issue: LocalIssueData) => {
  for (const key of Object.keys(defaultLocalIssueData) as (keyof typeof defaultLocalIssueData)[]) {
    const value = issue[key];
    if (value !== undefined && value !== defaultLocalIssueData[key]) {
      return false;
    }
  }
  return true;
};

/**
 * Migrate legacy issue data from "issues" storage to "localIssues" storage
 */
export const runLocalIssuesMigration = async (
  legacyIssues: Record<
    number,
    {
      pinned: boolean;
      remembered: boolean;
    }
  >
) => {
  const newLocalIssues = Object.entries(legacyIssues)
    .filter(([_, issue]) => issue.pinned || issue.remembered)
    .map(
      ([id, issue]) =>
        ({
          id: Number(id),
          pinned: issue.pinned,
          remembered: issue.remembered,
        }) satisfies LocalIssueData
    );

  const localIssues = await getStorage<LocalIssueData[]>("localIssues", _defaultLocalIssues);
  for (const issue of newLocalIssues) {
    if (localIssues.find((localIssue) => localIssue.id === issue.id)) continue;
    localIssues.push(issue);
  }
  await setStorage("localIssues", localIssues);
};

export default useLocalIssues;
