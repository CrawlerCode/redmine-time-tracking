import { Tooltip } from "react-tooltip";
import { TTimeEntry } from "../../types/redmine";

type PropTypes = {
  entries: TTimeEntry[];
  maxHours?: number;
};

const TimeEntry = ({ entries, maxHours = 24 }: PropTypes) => {
  const hours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  return (
    <div className="flex gap-x-0.5 items-center">
      {entries.map((entry) => (
        <>
          <Tooltip id={`tooltip-time-entry-${entry.id}`} place="bottom" className="z-10 opacity-100">
            <h4 className="text-base">
              {entry.issue ? (
                <>
                  #{entry.issue?.id} <span className="text-sm">({entry.hours} h)</span>
                </>
              ) : (
                <>{entry.hours} h</>
              )}
            </h4>
            <p>{entry.comments}</p>
          </Tooltip>
          <div
            className="h-4 bg-primary rounded"
            style={{
              width: `${(entry.hours / maxHours) * 100}%`,
            }}
            data-tooltip-id={`tooltip-time-entry-${entry.id}`}
          />
        </>
      ))}
      <div
        className="h-3 bg-gray-400/40 dark:bg-gray-700/40 rounded"
        style={{
          width: `${((maxHours - hours) / maxHours) * 100}%`,
          backgroundSize: "1rem 1rem",
          backgroundImage: "linear-gradient(45deg,rgba(255,255,255,.05) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.05) 50%,rgba(255,255,255,.05) 75%,transparent 75%,transparent)",
        }}
      />
    </div>
  );
};

export default TimeEntry;
