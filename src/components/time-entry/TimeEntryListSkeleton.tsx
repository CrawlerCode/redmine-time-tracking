import { Skeleton } from "../ui/skeleton";

const TimeEntryListSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(2).keys()].map((i) => {
        return (
          <div key={i} role="group" className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5.5 w-15" />
            </div>
            {[...Array(5).keys()].map((i) => {
              const entries = [...Array(Math.floor(Math.random() * 4 + 1)).keys()].map(() => Math.floor(Math.random() * 2 + 1) / 8);
              const sumHours = entries.reduce((sum, entry) => sum + entry, 0);
              return (
                <div key={i} className="flex items-center gap-x-1">
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-17 justify-self-end" />
                  <div className="grow">
                    <div role="row" className="flex items-center gap-x-0.5">
                      {entries.map((hours, i) => (
                        <Skeleton
                          key={i}
                          role="cell"
                          data-type="time-entry-skeleton"
                          className="h-4"
                          style={{
                            width: `${hours * 100}%`,
                          }}
                        />
                      ))}
                      <Skeleton
                        className="h-3"
                        style={{
                          width: `${((24 - sumHours) / 24) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TimeEntryListSkeleton;
