import clsx from "clsx";

const IssuesListSkeleton = () => {
  return (
    <>
      {[...Array(Math.floor(Math.random() * 2 + 2)).keys()].map(() => (
        <>
          <div className="animate-pulse h-2.5 my-0.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
          {[...Array(Math.floor(Math.random() * 5 + 1)).keys()].map(() => {
            return (
              <div className={clsx("animate-pulse block w-full p-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:shadow-gray-700 dark:bg-gray-800 dark:border-gray-700 relative")}>
                <div className="h-2.5 my-0.5 w-52 mb-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-row justify-between gap-x-2">
                  <div className="mt-1">
                    <div className="h-5 w-[80px] rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="flex flex-col mr-2">
                    <div className="flex items-center gap-x-3 justify-end">
                      <div className="h-5 my-0.5 w-14 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ))}
    </>
  );
};

export default IssuesListSkeleton;
