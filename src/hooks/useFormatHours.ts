import { useIntl } from "react-intl";
import { useSettings } from "../provider/SettingsProvider";
import { formatHoursUsually } from "../utils/date";

const useFormatHours = () => {
  const { formatMessage, formatNumber } = useIntl();
  const { settings } = useSettings();

  return (hours: number) =>
    formatMessage(
      { id: "format.hours" },
      {
        hours: settings.style.timeFormat === "decimal" ? formatNumber(hours) : formatHoursUsually(hours),
      }
    );
};

export default useFormatHours;
