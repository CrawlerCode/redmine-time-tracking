import HelpTooltip from "@/components/general/HelpTooltip";
import CreateTimeEntryModal from "@/components/time-entry/CreateTimeEntryModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/provider/SettingsProvider";
import { roundMillisecondsToInterval } from "@/utils/date";
import { BadgeCheckIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerDoneButton = ({ canLogTime }: { canLogTime: boolean }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const { timer, issue, currentTime } = useTimerContext();

  const isDisabled = !canLogTime || !issue;
  const [createTimeEntryHours, setCreateTimeEntryHours] = useState<number | undefined>(undefined);

  return (
    <>
      <HelpTooltip message={formatMessage({ id: "issues.timer.action.add-spent-time.tooltip" })}>
        <BadgeCheckIcon
          role="button"
          data-action="timer-done"
          className="text-primary size-6 shrink-0 cursor-pointer focus:outline-hidden data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
          data-disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            const time = settings.features.roundToInterval ? roundMillisecondsToInterval(currentTime, settings.features.roundingInterval, settings.features.roundingMode) : currentTime;
            const hours = Number((time / 1000 / 60 / 60).toFixed(2));
            setCreateTimeEntryHours(hours);
          }}
          tabIndex={-1}
        />
      </HelpTooltip>

      {createTimeEntryHours !== undefined && issue && (
        <CreateTimeEntryModal
          timer={timer}
          issue={issue}
          initialValues={{
            hours: createTimeEntryHours,
            ...(timer.name && { comments: timer.name }),
          }}
          onClose={() => setCreateTimeEntryHours(undefined)}
          onSuccess={() => {
            setCreateTimeEntryHours(undefined);
            timer.deleteTimer();
          }}
        />
      )}
    </>
  );
};

export const TimerDoneButtonSkeleton = () => <Skeleton className="size-6 rounded-lg" />;
