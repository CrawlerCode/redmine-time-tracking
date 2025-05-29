import { useEffect } from "react";
import useStorage from "./useStorage";

const _defaultCachedComments = {};

type Options = {
  identifier: number;
  enabled?: boolean;
  onLoad: (comment: string) => void;
};

const useCachedComments = ({ identifier, enabled = true, onLoad }: Options) => {
  const cachedComments = useStorage<Record<number, string | undefined>>("cachedComments", _defaultCachedComments);

  useEffect(() => {
    if (!enabled) return;
    const comment = cachedComments.data[identifier];
    if (comment) {
      onLoad(comment);
    }
  }, [enabled, identifier, onLoad, cachedComments.data]);

  return {
    isEnabled: enabled,
    isCached: !!cachedComments.data[identifier],
    saveComment: (comment: string) =>
      cachedComments.setData({
        ...cachedComments.data,
        [identifier]: comment,
      }),
    removeComment: () =>
      cachedComments.setData({
        ...cachedComments.data,
        [identifier]: undefined,
      }),
  };
};

export default useCachedComments;
