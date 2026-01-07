import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerNameField = () => {
  const { formatMessage } = useIntl();
  const { timer } = useTimerContext();

  return (
    <input
      type="text"
      className="placeholder:text-muted-foreground min-w-0 grow truncate bg-transparent text-gray-600 placeholder:italic focus:outline-hidden dark:text-gray-200"
      value={timer.name}
      placeholder={formatMessage({ id: "timer.unnamed-timer" })}
      tabIndex={-1}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      onChange={(e) => timer.setName(e.target.value)}
    />
  );
};
