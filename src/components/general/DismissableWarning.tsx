import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";
import useStorage from "../../hooks/useStorage";

type PropTypes = {
  name: string;
  children: React.ReactNode;
};

function DismissibleWarning({ name, children }: PropTypes) {
  const { data: hideWarning, setData, isLoading } = useStorage<boolean>(`hideWarning.${name}`, false);

  if (hideWarning || isLoading) return null;

  return (
    <p className="rounded-lg border border-background-inner p-1" role="alert">
      <FontAwesomeIcon icon={faWarning} className="mr-1 text-yellow-500 dark:text-yellow-400" />
      <span className="mr-1">{children}</span>
      <button className="text-blue-500 underline dark:text-blue-400" onClick={() => setData(true)}>
        <FormattedMessage id="dismissible-warning.dont-show-again" />
      </button>
    </p>
  );
}

export default DismissibleWarning;
