import { useRedmineIssue } from "@/api/redmine/hooks/useRedmineIssue";
import useRedmineIssuesSearch from "@/api/redmine/hooks/useRedmineIssuesSearch";
import { ComboboxField } from "@/components/form/ComboboxField";
import { useFieldContext } from "@/hooks/useAppForm";
import { useDebouncedValue } from "@mantine/hooks";
import { type ComponentProps, useState } from "react";
import { useIntl } from "react-intl";

export const IssueField = (props: Omit<ComponentProps<typeof ComboboxField>, "items" | "isLoading">) => {
  const { formatMessage } = useIntl();

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const isSearching = debouncedQuery.length > 0;

  const redmineIssuesSearch = useRedmineIssuesSearch({
    isSearching,
    query: debouncedQuery,
    settings: {
      mode: "remote",
      remoteSearchOptions: {
        titlesOnly: true,
        openIssuesOnly: false,
        assignedToMe: false,
      },
    },
  });

  const { state } = useFieldContext<null | number>();
  const selectedIssue = useRedmineIssue(state.value ?? 0, {
    enabled: !!state.value,
  });

  const issues = isSearching ? [...redmineIssuesSearch.data] : selectedIssue.data ? [selectedIssue.data] : [];

  return (
    <ComboboxField
      title={formatMessage({ id: "time.time-entry.field.issue" })}
      placeholder={formatMessage({ id: "time.time-entry.field.issue.placeholder" })}
      {...props}
      filter={null}
      onInputValueChange={(value, { reason }) => {
        if (reason !== "input-change" && reason !== "input-clear" && reason !== "clear-press") return;
        setQuery(value);
      }}
      onOpenChange={(open) => {
        if (!open) setQuery("");
      }}
      items={issues.map((issue) => ({
        label: `${issue.tracker.name} #${issue.id}: ${issue.subject}`,
        value: issue.id,
      }))}
      isLoading={redmineIssuesSearch.isLoading || selectedIssue.isLoading}
    />
  );
};
