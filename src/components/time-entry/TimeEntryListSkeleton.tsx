const TimeEntryListSkeleton = () => {
  return (
    <>
      {[...Array(2).keys()].map((i) => {
        return (
          <div className="mb-5 flex animate-pulse flex-col gap-y-1" key={i}>
            <div className="flex items-center gap-x-3">
              <h1 className="bg-background-inner h-4 w-40"></h1>
              <span className="bg-background-inner h-5 w-12 rounded-sm"></span>
            </div>
            {[...Array(5).keys()].map((i) => {
              return (
                <div className="flex items-center gap-x-1" key={i}>
                  <h4 className="bg-background-inner h-3 w-8"></h4>
                  <h3 className="bg-background-inner h-3 w-14 justify-self-end"></h3>
                  <div className="grow">
                    <div className="flex items-center gap-x-0.5">
                      {[...Array(Math.floor(Math.random() * 4 + 1)).keys()].map((i) => (
                        <div
                          className="bg-background-inner h-4 rounded-sm"
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
