const TimeEntryListSkeleton = () => {
  return (
    <>
      {[...Array(2).keys()].map((i) => {
        return (
          <div className="mb-5 flex animate-pulse flex-col gap-y-1" key={i}>
            <div className="flex items-center gap-x-3">
              <h1 className="h-4 w-40 bg-gray-200 dark:bg-gray-700"></h1>
              <span className="h-5 w-12 rounded bg-gray-200 dark:bg-gray-700"></span>
            </div>
            {[...Array(5).keys()].map((i) => {
              return (
                <div className="grid grid-cols-10 items-center gap-x-1" key={i}>
                  <h4 className="col-span-1 h-3 w-8 bg-gray-200 dark:bg-gray-700"></h4>
                  <h3 className="col-span-2 h-3 w-6 justify-self-end bg-gray-200 dark:bg-gray-700"></h3>
                  <div className="col-span-7">
                    <div className="flex items-center gap-x-0.5">
                      {[...Array(Math.floor(Math.random() * 4 + 1)).keys()].map((i) => (
                        <div
                          className="h-4 rounded bg-gray-200 dark:bg-gray-700"
                          style={{
                            width: `${(Math.floor(Math.random() * 2 + 1) / 8) * 100}%`,
                          }}
                          key={i}
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
