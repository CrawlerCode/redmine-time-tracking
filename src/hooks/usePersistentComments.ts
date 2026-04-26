import { useStorage } from "./useStorage";

const _persistentComments = {};

type Options = {
  identifier: string;
  enabled?: boolean;
};

export const usePersistentComments = ({ identifier, enabled = true }: Options) => {
  const { data, setData } = useStorage<Record<string, string | undefined>>("persistentComments", _persistentComments);

  const persistentComment = data[identifier];

  return {
    isEnabled: enabled,
    isPersisted: !!persistentComment,
    comment: persistentComment,
    saveComment: (comment?: string) =>
      setData({
        ...data,
        [identifier]: comment ? comment : undefined,
      }),
    removeComment: () =>
      setData({
        ...data,
        [identifier]: undefined,
      }),
  };
};
