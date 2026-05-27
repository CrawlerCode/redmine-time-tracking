import { MissingRedmineConfigError } from "@/api/redmine/MissingRedmineConfigError";
import { RedmineAuthenticationError } from "@/api/redmine/RedmineAuthenticationError";
import { getErrorMessage } from "@/utils/error";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorComponentProps } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { AlertCircleIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export function ErrorComponent({ error, reset: resetPage }: ErrorComponentProps) {
  const { formatMessage } = useIntl();
  const { reset: resetQueries } = useQueryErrorResetBoundary();

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>
        {isAxiosError(error)
          ? formatMessage({ id: "general.error.api-error" })
          : error instanceof MissingRedmineConfigError
            ? formatMessage({ id: "general.error.missing-redmine-configuration" })
            : error instanceof RedmineAuthenticationError
              ? formatMessage({ id: "general.error.redmine-authentication-error" })
              : formatMessage({ id: "general.error.unknown-error" }, { name: error.name })}
      </AlertTitle>
      {!(error instanceof MissingRedmineConfigError) && (
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
              {formatMessage({ id: "general.retry" })}
            </Button>
          </div>
        </AlertDescription>
      )}
    </Alert>
  );
}
