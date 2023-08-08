import clsx from "clsx";
import { Fragment } from "react";

const IssuesListSkeleton = () => {
  return (
    <>
      {[...Array(Math.floor(Math.random() * 2 + 2)).keys()].map((i) => (
        <Fragment key={i}>
          <div className="my-0.5 h-2.5 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          {[...Array(Math.floor(Math.random() * 5 + 1)).keys()].map((_, i) => {
            return (
              <div key={i} className={clsx("relative block w-full animate-pulse rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-700")}>
                <div className="my-0.5 mb-2 h-2.5 w-52 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-row justify-between gap-x-2">
                  <div className="mt-1">
                    <div className="h-5 w-[80px] rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="mr-2 flex flex-col">
                    <div className="flex items-center justify-end gap-x-3">
                      <div className="my-0.5 h-5 w-14 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
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
