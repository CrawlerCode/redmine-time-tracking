import clsx from "clsx";
import { Fragment } from "react";
import { Skeleton } from "../ui/skeleton";

const IssuesListSkeleton = () => {
  return (
    <>
      {[...Array(Math.floor(Math.random() * 2 + 2)).keys()].map((i) => (
        <Fragment key={i}>
          <div className="flex justify-between gap-x-2">
            <Skeleton className="h-4.5 w-28" />
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-3" />
              <Skeleton className="size-3" />
            </div>
          </div>
          {[...Array(Math.floor(Math.random() * 5 + 1)).keys()].map((_, i) => {
            return (
              <div key={i} role="listitem" data-type="issue" className={clsx("bg-card relative flex w-full flex-col gap-1 rounded-lg p-1", "border-card border")}>
                <Skeleton className="h-4.5 w-52" />
                <div className="flex justify-between gap-x-2">
                  <div className="mt-1">
                    <Skeleton className="h-5 w-[80px] rounded-sm" />
                  </div>
                  <div>
                    <div role="listitem" data-type="timer" className="flex items-center gap-x-3">
                      <Skeleton className="h-7 w-14" />
                      <Skeleton className="size-6" />
                      <Skeleton className="size-6" />
                      <Skeleton className="size-6" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Fragment>
      ))}
    </>
  );
};

export default IssuesListSkeleton;
