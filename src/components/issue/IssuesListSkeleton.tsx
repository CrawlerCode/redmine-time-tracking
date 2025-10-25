import clsx from "clsx";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const IssuesListSkeleton = () => {
  const groups = useMemo(
    () =>
      [...Array(Math.floor(Math.random() * 2 + 2)).keys()].map((i) => ({
        key: i,
        groups: [...Array(Math.floor(Math.random() * 5 + 1)).keys()],
      })),
    []
  );

  return (
    <div className="flex flex-col gap-y-4">
      {groups.map(({ key, groups }) => (
        <div key={key} className="flex flex-col gap-y-2">
          <div className="flex justify-between gap-x-2">
            <Skeleton className="h-5.5 w-28" />
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-4" />
              <Skeleton className="size-4" />
            </div>
          </div>
          {groups.map((key) => (
            <div key={key} role="listitem" data-type="issue" className={clsx("bg-card relative flex w-full flex-col gap-1 rounded-lg p-1", "border-card border")}>
              <Skeleton className="h-5 w-52" />
              <div className="flex justify-between gap-x-2">
                <div className="mt-1">
                  <Skeleton className="h-5.5 w-[80px] rounded-sm" />
                </div>
                <div>
                  <div role="listitem" data-type="timer" className="flex items-center gap-x-3">
                    <Skeleton className="my-1 h-5.5 w-16" />
                    <Skeleton className="size-6 rounded-lg" />
                    <Skeleton className="size-6 rounded-lg" />
                    <Skeleton className="size-6 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default IssuesListSkeleton;
