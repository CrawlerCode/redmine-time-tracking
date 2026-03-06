import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerNameField = () => {
  const { formatMessage } = useIntl();
  const { timer } = useTimerContext();

  return (
    <input
      type="text"
      className="placeholder:text-muted-foreground min-w-0 grow truncate bg-transparent text-foreground placeholder:italic focus:outline-hidden"
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
