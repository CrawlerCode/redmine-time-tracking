import useStorage from "./useStorage";

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
  const { data: localIssues, setData: setLocalIssues, isLoading } = useStorage<LocalIssueData[]>("localIssues", _defaultLocalIssues);

  return {
    isLoading,
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
  return issue.pinned === defaultLocalIssueData.pinned && issue.remembered === defaultLocalIssueData.remembered;
};

export default useLocalIssues;
