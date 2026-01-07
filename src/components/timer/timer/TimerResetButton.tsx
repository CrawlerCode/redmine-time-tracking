import HelpTooltip from "@/components/general/HelpTooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TimerResetIcon } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useTimerContext } from "./TimerRoot";

export const TimerResetButton = () => {
  const { formatMessage } = useIntl();

  const { timer } = useTimerContext();

  const [confirmResetModal, setConfirmResetModal] = useState(false);

  return (
    <>
      <HelpTooltip message={formatMessage({ id: "issues.timer.action.reset.tooltip" })}>
        <TimerResetIcon role="button" data-type="reset-timer" className="size-6 shrink-0 cursor-pointer text-red-500 focus:outline-hidden" onClick={() => setConfirmResetModal(true)} tabIndex={-1} />
      </HelpTooltip>

      {confirmResetModal && (
        <AlertDialog open onOpenChange={() => setConfirmResetModal(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{formatMessage({ id: "issues.modal.reset-timer.title" })}</AlertDialogTitle>
              <AlertDialogDescription>{formatMessage({ id: "issues.modal.reset-timer.message" })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{formatMessage({ id: "issues.modal.reset-timer.cancel" })}</AlertDialogCancel>
              <AlertDialogAction onClick={() => timer.resetTimer()}>{formatMessage({ id: "issues.modal.reset-timer.reset" })}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
