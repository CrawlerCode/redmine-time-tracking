export const formatTimer = (milliseconds: number) => {
  if (isNaN(milliseconds) || milliseconds < 0) return "";
  const seconds = milliseconds / 1000;

  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 60 / 60);
  return `${h}:${m > 9 ? m : "0" + m}:${s > 9 ? s : "0" + s}`;
};

/**
 * Round time to nearest interval
 *
 * for example with interval 15:
 * 0:07:29 => 0:00:00
 * 0:07:30 => 0:15:00
 * 0:23:00 => 0:30:00
 */
export const roundTimeNearestInterval = (milliseconds: number, interval: number) => {
  const seconds = milliseconds / 1000;
  const m = Math.round(seconds / 60 / interval) * interval;
  const h = Math.floor(seconds / 60 / 60) + Math.floor(m / 60);
  return (h * 60 + (m % 60)) * 60 * 1000;
};

/**
 * Format hours to usually format (1:30)
 */
export const formatHoursUsually = (hours: number) => {
  if (isNaN(hours) || hours < 0) return "";

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  return `${h}:${m.toString().padStart(2, "0")}`;
};

/**
 * Round hours
 */
export const roundHours = (hours: number) => {
  return Number(hours.toFixed(2));
};
