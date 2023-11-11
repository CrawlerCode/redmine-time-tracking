import { faSliders, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import useMyProjects from "../../hooks/useMyProjects";
import useStorage from "../../hooks/useStorage";
import CheckBox from "../general/CheckBox";
import ReactSelect from "../general/ReactSelect";

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

  // On "Escape" => close filter
  useHotKey(() => setShowFilter(false), { key: "Escape" });

  const { data: projects, isLoading: isLoadingProjects } = useMyProjects({
    enabled: showFilter,
  });

  const { data: filter, setData: setFilter, isLoading } = useStorage<FilterQuery>("filter", defaultFilter);

  return (
    <>
      {(!showFilter && (
        <div className="mb-1 flex justify-end">
          <FilterButton onClick={() => setShowFilter((show) => !show)} />
        </div>
      )) || (
        <fieldset className="mb-2 rounded-md border border-gray-300 p-1.5 dark:border-gray-600">
          <legend className="cursor-pointer px-2 text-right" onClick={() => setShowFilter((show) => !show)}>
            <FilterButton />
            <FontAwesomeIcon icon={faX} className="ml-2" />
          </legend>
          <div className="-mt-2 flex flex-col gap-y-2">
            <ReactSelect
              title={formatMessage({ id: "issues.filter.projects" })}
              placeholder={formatMessage({ id: "issues.filter.projects" })}
              noOptionsMessage={() => formatMessage({ id: "issues.filter.projects.no-projects" })}
              options={projects.map((project) => ({ value: project.id, label: project.name }))}
              isLoading={isLoadingProjects}
              value={filter.projects.map((id) => ({ value: id, label: projects.find((p) => p.id === id)?.name ?? "..." }))}
              onChange={(selected) => {
                setFilter({
                  ...filter,
                  projects: selected.map((v) => v.value),
                });
              }}
              isMulti
              isClearable
              closeMenuOnSelect={false}
            />
            <CheckBox
              title={formatMessage({ id: "issues.filter.hide-completed-issues.title" })}
              description={formatMessage({ id: "issues.filter.hide-completed-issues.description" })}
              checked={filter.hideCompletedIssues}
              onChange={(e) => setFilter({ ...filter, hideCompletedIssues: e.target.checked })}
            />
          </div>
        </fieldset>
      )}
      {children({ filter, isLoading })}
    </>
  );
};

const FilterButton = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <button className="text-sm text-slate-500 dark:text-slate-300" tabIndex={-1} onClick={onClick}>
      <FontAwesomeIcon icon={faSliders} className="mr-1" />
      <FormattedMessage id="issues.filter" />
    </button>
  );
};

export default Filter;
