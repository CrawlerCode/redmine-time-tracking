import { getErrorMessage } from "@/utils/error";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorComponentProps } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { AlertCircleIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export function ErrorComponent({ error, reset: resetPage }: ErrorComponentProps) {
  const { reset: resetQueries } = useQueryErrorResetBoundary();

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>
        {isAxiosError(error) ? (
          <FormattedMessage id="general.error.api-error" />
        ) : (
          <FormattedMessage
            id="general.error.unknown-error"
            values={{
              name: error.name,
            }}
          />
        )}
      </AlertTitle>
      <AlertDescription>
        {getErrorMessage(error)}
        <div className="flex w-full justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              resetQueries();
              resetPage();
            }}
          >
            <FormattedMessage id="general.retry" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
