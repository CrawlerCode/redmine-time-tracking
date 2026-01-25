/* eslint-disable react/no-children-prop */
import { TIssue } from "@/api/redmine/types";
import { useAppForm } from "@/hooks/useAppForm";
import { useStatuses } from "@/hooks/useIssueStatuses";
import deepmerge from "deepmerge";
import { SlidersHorizontalIcon } from "lucide-react";
import { createContext, PropsWithChildren, use, useState } from "react";
import { useIntl } from "react-intl";
import { z } from "zod";
import useMyProjects from "../../hooks/useMyProjects";
import { useSuspenseStorage } from "../../hooks/useStorage";
import { Button } from "../ui/button";
import { FieldGroup, FieldSet } from "../ui/field";
import { Form } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const filterSettingsSchema = z.object({
  projects: z.array(z.number()),
  statuses: z.array(z.number()),
  hideCompletedIssues: z.boolean(),
});

type FilterSettings = z.infer<typeof filterSettingsSchema>;

const defaultFilterSettings: FilterSettings = { projects: [], statuses: [], hideCompletedIssues: false };

type FilterContextType = {
  settings: FilterSettings;
  setSettings: (settings: FilterSettings) => Promise<void>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const FilterProvider = ({ children }: PropsWithChildren) => {
  const { data: filterSettings, setData: setFilterSettings } = useSuspenseStorage<FilterSettings>("filter", defaultFilterSettings);

  return (
    <FilterContext
      value={{
        settings: deepmerge(defaultFilterSettings, filterSettings),
        setSettings: setFilterSettings,
      }}
    >
      {children}
    </FilterContext>
  );
};

export const useFilter = () => {
  const context = use(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider component");
  }
  return context;
};

const FilterButton = () => {
  const { formatMessage } = useIntl();
  const filter = useFilter();

  const [showFilter, setShowFilter] = useState(false);

  const { data: projects, isLoading: isLoadingProjects } = useMyProjects({
    enabled: showFilter,
  });
  const { data: statuses, isLoading: isLoadingStatuses } = useStatuses({
    enabled: showFilter,
  });

  const form = useAppForm({
    defaultValues: filter.settings,
    validators: {
      onChange: filterSettingsSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
    },
    onSubmit: async ({ value }) => {
      await filter.setSettings(value);
    },
  });

  return (
    <Popover open={showFilter} onOpenChange={setShowFilter}>
      <PopoverTrigger render={<Button variant="secondary" size="sm" tabIndex={-1} />}>
        <SlidersHorizontalIcon />
        {formatMessage({ id: "issues.filter" })}
      </PopoverTrigger>
      <PopoverContent collisionPadding={10} className="bg-background w-[18.5rem]">
        <Form onSubmit={form.handleSubmit}>
          <FieldSet className="gap-3">
            <FieldGroup>
              <form.AppField
                name="projects"
                children={(field) => (
                  <field.ComboboxField
                    title={formatMessage({ id: "issues.filter.projects" })}
                    placeholder={formatMessage({ id: "issues.filter.projects" })}
                    noOptionsMessage={formatMessage({ id: "issues.filter.projects.no-options" })}
                    items={projects.map((project) => ({ value: project.id, label: project.name }))}
                    isLoading={isLoadingProjects}
                    mode="multiple"
                  />
                )}
              />
              <form.AppField
                name="statuses"
                children={(field) => (
                  <field.ComboboxField
                    title={formatMessage({ id: "issues.filter.statuses" })}
                    placeholder={formatMessage({ id: "issues.filter.statuses" })}
                    items={
                      statuses?.map((status) => ({
                        label: status.name,
                        value: status.id,
                        disabled: status.is_closed,
                      })) ?? []
                    }
                    isLoading={isLoadingStatuses}
                    mode="multiple"
                  />
                )}
              />
              <form.AppField
                name="hideCompletedIssues"
                children={(field) => (
                  <field.CheckboxField
                    title={formatMessage({ id: "issues.filter.hide-completed-issues.title" })}
                    description={formatMessage({ id: "issues.filter.hide-completed-issues.description" })}
                  />
                )}
              />
            </FieldGroup>
          </FieldSet>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export const filterIssues = (issues: TIssue[], settings: FilterSettings) => {
  // projects
  if (settings.projects.length > 0) {
    issues = issues.filter((issue) => settings.projects.includes(issue.project.id));
  }

  // statuses
  if (settings.statuses && settings.statuses.length > 0) {
    issues = issues.filter((issue) => settings.statuses.includes(issue.status.id));
  }

  // hide completed issues (done_ratio = 100%)
  if (settings.hideCompletedIssues) {
    issues = issues.filter((issue) => issue.done_ratio !== 100);
  }

  return issues;
};

const Filter = {
  Provider: FilterProvider,
  Button: FilterButton,
};

export default Filter;
