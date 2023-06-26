const TimeEntryListSkeleton = () => {
  return (
    <>
      {[...Array(2).keys()].map(() => {
        return (
          <div className="animate-pulse flex flex-col gap-y-1 mb-5">
            <div className="flex items-center gap-x-3">
              <h1 className="h-4 w-40 bg-gray-200 dark:bg-gray-700"></h1>
              <span className="rounded h-5 w-12 bg-gray-200 dark:bg-gray-700"></span>
            </div>
            {[...Array(5).keys()].map((d) => {
              return (
                <div className="grid grid-cols-10 items-center gap-x-1">
                  <h4 className="col-span-1 h-3 w-8 bg-gray-200 dark:bg-gray-700"></h4>
                  <h3 className="col-span-2 justify-self-end h-3 w-6 bg-gray-200 dark:bg-gray-700"></h3>
                  <div className="col-span-7">
                    <div className="flex gap-x-0.5 items-center">
                      {[...Array(Math.floor(Math.random() * 4 + 1)).keys()].map(() => (
                        <div
                          className="h-4 rounded bg-gray-200 dark:bg-gray-700"
                          style={{
                            width: `${(Math.floor(Math.random() * 2 + 1) / 8) * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default TimeEntryListSkeleton;
