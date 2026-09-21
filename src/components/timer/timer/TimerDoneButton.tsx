import HelpTooltip from "@/components/general/HelpTooltip";
import CreateTimeEntryModal from "@/components/time-entry/CreateTimeEntryModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/provider/SettingsProvider";
import { useTimerApi } from "@/provider/TimerApiProvider";
import { roundMillisecondsToInterval } from "@/utils/date";
import { BadgeCheckIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerDoneButton = ({ canLogTime }: { canLogTime: boolean }) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const timerApi = useTimerApi();
  const { timer, issue, totalElapsedTime } = useTimerContext();

  const isDisabled = !canLogTime || !issue;
  const [createTimeEntryHours, setCreateTimeEntryHours] = useState<number | undefined>(undefined);

  return (
    <>
      <HelpTooltip message={formatMessage({ id: "issues.timer.action.add-spent-time.tooltip" })}>
        <Button
          variant="ghost"
          size="icon-sm"
          data-action="timer-done"
          className="text-green-600 hover:text-green-600"
          disabled={isDisabled}
          onClick={() => {
            if (isDisabled) return;
            const time = settings.features.roundToInterval ? roundMillisecondsToInterval(totalElapsedTime, settings.features.roundingInterval, settings.features.roundingMode) : totalElapsedTime;
            const hours = Number((time / 1000 / 60 / 60).toFixed(2));
            setCreateTimeEntryHours(hours);
          }}
          tabIndex={-1}
        >
          <BadgeCheckIcon />
        </Button>
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
            timerApi.deleteTimer(timer);
          }}
        />
      )}
    </>
  );
};

export const TimerDoneButtonSkeleton = () => <Skeleton className="size-6 rounded-md" />;
