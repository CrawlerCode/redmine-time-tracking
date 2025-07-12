/* eslint-disable react/no-children-prop */
import { useAppForm } from "@/hooks/useAppForm";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { z } from "zod/v4";
import useMyProjects from "../../hooks/useMyProjects";
import useStorage from "../../hooks/useStorage";
import { Button } from "../ui/button";
import { Form, FormGrid } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type FilterQuery = {
  projects: number[];
  hideCompletedIssues: boolean;
};

const defaultFilter: FilterQuery = { projects: [], hideCompletedIssues: false };

type PropTypes = {
  children: (state: { filter: FilterQuery; isLoading: boolean }) => ReactNode;
};

const Filter = ({ children }: PropTypes) => {
  const { formatMessage } = useIntl();

  const [showFilter, setShowFilter] = useState(false);

  const { data: projects, isLoading: isLoadingProjects } = useMyProjects({
    enabled: showFilter,
  });

  const { data: filter, setData: setFilter, isLoading } = useStorage<FilterQuery>("filter", defaultFilter);

  const form = useAppForm({
    defaultValues: filter,
    validators: {
      onChange: z.object({
        projects: z.array(z.number()),
        hideCompletedIssues: z.boolean(),
      }),
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          setFilter(formApi.state.values);
        }
      },
    },
  });

  return (
    <>
      <Popover open={showFilter} onOpenChange={setShowFilter}>
        <div className="flex justify-end">
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="mb-1" tabIndex={-1}>
              <FontAwesomeIcon icon={faSliders} />
              {formatMessage({ id: "issues.filter" })}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="bg-background w-[300px]">
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
      {children({ filter, isLoading })}
    </>
  );
};

export default Filter;
