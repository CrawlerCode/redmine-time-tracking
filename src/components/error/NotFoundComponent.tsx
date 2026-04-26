import { AlertCircleIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Alert, AlertTitle } from "../ui/alert";

export function NotFoundComponent() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>
        <FormattedMessage id="general.error.page-not-found" />
      </AlertTitle>
    </Alert>
  );
}
