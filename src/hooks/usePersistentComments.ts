import { useEffect } from "react";
import { useStorage } from "./useStorage";

const _persistentComments = {};

type Options = {
  identifier: string;
  enabled?: boolean;
  onLoad: (comment: string) => void;
};

export const usePersistentComments = ({ identifier, enabled = true, onLoad }: Options) => {
  const { data, setData } = useStorage<Record<string, string | undefined>>("persistentComments", _persistentComments);

  const persistentComment = data[identifier];

  useEffect(() => {
    if (!enabled) return;
    if (persistentComment) {
      onLoad(persistentComment);
    }
  }, [enabled, onLoad, persistentComment]);

  return {
    isEnabled: enabled,
    isPersisted: !!persistentComment,
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
