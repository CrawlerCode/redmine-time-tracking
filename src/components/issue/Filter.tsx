/* eslint-disable react/no-children-prop */
import { useAppForm } from "@/hooks/useAppForm";
import { TIssue } from "@/types/redmine";
import { SlidersHorizontalIcon } from "lucide-react";
import { createContext, PropsWithChildren, use, useState } from "react";
import { useIntl } from "react-intl";
import { z } from "zod/v4";
import useMyProjects from "../../hooks/useMyProjects";
import { useSuspenseStorage } from "../../hooks/useStorage";
import { Button } from "../ui/button";
import { Form, FormGrid } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const filterSettingsSchema = z.object({
  projects: z.array(z.number()),
  hideCompletedIssues: z.boolean(),
});

type FilterSettings = z.infer<typeof filterSettingsSchema>;

const defaultSettings: FilterSettings = { projects: [], hideCompletedIssues: false };

type FilterContextType = {
  settings: FilterSettings;
  setSettings: (settings: FilterSettings) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const FilterProvider = ({ children }: PropsWithChildren) => {
  const { data: settings, setData: setSettings } = useSuspenseStorage<FilterSettings>("filter", defaultSettings);

  return (
    <FilterContext
      value={{
        settings,
        setSettings,
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
    onSubmit: ({ value }) => {
      filter.setSettings(value);
    },
  });

  return (
    <Popover open={showFilter} onOpenChange={setShowFilter}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" tabIndex={-1}>
          <SlidersHorizontalIcon />
          {formatMessage({ id: "issues.filter" })}
        </Button>
      </PopoverTrigger>
      <PopoverContent collisionPadding={10} className="bg-background w-[18.5rem]">
        <Form onSubmit={form.handleSubmit}>
          <FormGrid className="gap-3">
            <form.AppField
              name="projects"
              children={(field) => (
                <field.ComboboxField
                  title={formatMessage({ id: "issues.filter.projects" })}
                  placeholder={formatMessage({ id: "issues.filter.projects" })}
                  noOptionsMessage={formatMessage({ id: "issues.filter.projects.no-options" })}
                  options={projects.map((project) => ({ value: project.id, label: project.name }))}
                  isLoading={isLoadingProjects}
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
                  className="border-input dark:bg-input/30 rounded-lg border bg-transparent p-1.5"
                />
              )}
            />
          </FormGrid>
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
