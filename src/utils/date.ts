export const formatTime = (milliseconds: number) => {
  if (isNaN(milliseconds) || milliseconds < 0) return "";
  const seconds = milliseconds / 1000;

  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 60 / 60);
  return `${h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
};

/**
 * convert 2.5 => 2:30
 */
export const formatHours = (hours: number) => {
  if (isNaN(hours) || hours < 0) return "";

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}:${m > 9 ? m : "0" + m}`;
};

/**
 * Round time to nearest quarter hour
 *
 * for example:
 * 0:07:59 => 0:00:00
 * 0:08:00 => 0:15:00
 * 0:23:00 => 0:30:00
 */
export const roundTimeNearestQuarterHour = (milliseconds: number) => {
  const seconds = milliseconds / 1000;
  const m = Math.round(Math.floor((seconds / 60) % 60) / 15) * 15;
  const h = Math.floor(seconds / 60 / 60) + Math.floor(m / 60);
  return (h * 60 + (m % 60)) * 60 * 1000;
};
