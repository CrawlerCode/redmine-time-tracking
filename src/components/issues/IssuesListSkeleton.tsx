import clsx from "clsx";
import { Fragment } from "react";

const IssuesListSkeleton = () => {
  return (
    <>
      {[...Array(Math.floor(Math.random() * 2 + 2)).keys()].map((i) => (
        <Fragment key={i}>
          <div className="my-0.5 h-2.5 w-28 animate-pulse rounded-full bg-background-inner" />
          {[...Array(Math.floor(Math.random() * 5 + 1)).keys()].map((_, i) => {
            return (
              <div key={i} className={clsx("relative block w-full animate-pulse rounded-lg border border-gray-200 bg-background p-1 dark:border-gray-700")}>
                <div className="my-0.5 mb-2 h-2.5 w-52 rounded-full bg-background-inner" />
                <div className="flex flex-row justify-between gap-x-2">
                  <div className="mt-1">
                    <div className="h-5 w-[80px] rounded bg-background-inner" />
                  </div>
                  <div className="mr-2 flex flex-col">
                    <div className="flex items-center justify-end gap-x-3">
                      <div className="my-0.5 h-5 w-14 rounded-2xl bg-background-inner" />
                      <div className="size-5 rounded-full bg-background-inner" />
                      <div className="size-5 rounded-full bg-background-inner" />
                      <div className="size-5 rounded-full bg-background-inner" />
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
