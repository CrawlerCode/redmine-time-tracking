import { Settings } from "@/provider/SettingsProvider";

/**
 * Format milliseconds to timer format (H:MM:SS)
 */
export const formatTimer = (milliseconds: number) => {
  if (isNaN(milliseconds) || milliseconds < 0) return "";

  const seconds = milliseconds / 1000;

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

/**
 * Format hours to usual format (1:30)
 */
export const formatHoursUsually = (hours: number) => {
  if (isNaN(hours) || hours < 0) return "";

  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  return `${h}:${m.toString().padStart(2, "0")}`;
};

/**
 * Round hours to 2 decimal places
 */
export const roundHours = (hours: number) => {
  return Number(hours.toFixed(2));
};

/**
 * Round milliseconds to interval (in minutes)
 *
 * Modes:
 * - down: always round down
 * - up: always round up
 * - nearest: round to nearest
 *
 * for example with nearest 15 interval:
 * 0:07:29 => 0:00:00
 * 0:07:30 => 0:15:00
 * 0:23:00 => 0:30:00
 */
export const roundMillisecondsToInterval = (milliseconds: number, intervalInMinutes: number, mode: Settings["features"]["roundingMode"]) => {
  if (intervalInMinutes <= 0) return milliseconds;

  const minutes = milliseconds / 1000 / 60;

  switch (mode) {
    case "down": {
      const m = Math.floor(minutes / intervalInMinutes) * intervalInMinutes;
      return m * 60 * 1000;
    }
    case "up": {
      const m = Math.ceil(minutes / intervalInMinutes) * intervalInMinutes;
      return m * 60 * 1000;
    }
    case "nearest":
    default: {
      const m = Math.round(minutes / intervalInMinutes) * intervalInMinutes;
      return m * 60 * 1000;
    }
  }
};
