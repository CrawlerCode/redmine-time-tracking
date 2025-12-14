import { useStorage } from "@/hooks/useStorage";
import { TriangleAlertIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

type PropTypes = {
  name: string;
  children: React.ReactNode;
};

function DismissibleWarning({ name, children }: PropTypes) {
  const { data: hideWarning, setData, isLoading } = useStorage<boolean>(`hideWarning.${name}`, false);

  if (hideWarning || isLoading) return null;

  return (
    <Alert>
      <TriangleAlertIcon />
      <AlertTitle>
        <FormattedMessage id="dismissible-warning.title" />
      </AlertTitle>
      <AlertDescription>{children}</AlertDescription>
      <Button type="button" variant="ghost" size="sm" onClick={() => setData(true)} className="absolute top-1 right-1">
        <FormattedMessage id="dismissible-warning.dont-show-again" />
      </Button>
    </Alert>
  );
}

export default DismissibleWarning;
