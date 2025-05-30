import BrowserNotificationBadge from "../general/BrowserNotificationBadge";

type PropTypes = {
  activeTimerCount: number;
};

const TimersBadge = ({ activeTimerCount }: PropTypes) => {
  return <BrowserNotificationBadge backgroundColor="#1d4ed8" text={activeTimerCount > 0 ? activeTimerCount.toString() : ""} />;
};

export default TimersBadge;
