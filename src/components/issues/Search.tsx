import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import { TReference } from "../../types/redmine";
import InputField from "../general/InputField";
import Switch from "../general/Switch";

export type SearchQuery = {
  searching: boolean;
  mode: "issue" | "project";
  query: string;
  inProject?: TReference;
};

// eslint-disable-next-line react-refresh/only-export-components
export const defaultSearchQuery: SearchQuery = { searching: false, mode: "issue", query: "" };

type PropTypes = {
  onSearch: (search: SearchQuery) => void;
};

export type SearchRef = {
  searchInProject: (project: TReference) => void;
};

const Search = forwardRef(({ onSearch }: PropTypes, ref: ForwardedRef<SearchRef>) => {
  const { formatMessage } = useIntl();

  const searchRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<SearchQuery["mode"]>(defaultSearchQuery.mode);
  const [query, setQuery] = useState(defaultSearchQuery.query);
  const [inProject, setInProject] = useState<TReference | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    searchInProject(project: TReference) {
      setMode("issue");
      setInProject(project);
      setSearching(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    },
  }));

  useEffect(() => {
    onSearch({
      searching,
      mode,
      query,
      inProject,
    });
  }, [searching, mode, query, inProject, onSearch]);

  // hotkeys
  useHotKey(
    () => {
      setSearching(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    },
    { ctrl: true, key: "k" }
  );
  useHotKey(
    () => {
      setSearching(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    },
    { ctrl: true, key: "f" }
  );
  useHotKey(
    () => {
      setSearching(false);
      setQuery("");
      setMode(defaultSearchQuery.mode);
      setInProject(undefined);
    },
    { key: "Escape" },
    searching
  );

  return (
    <>
      {searching && (
        <div className="relative mb-3">
          <InputField
            ref={searchRef}
            icon={<FontAwesomeIcon icon={faSearch} />}
            name="query"
            placeholder={formatMessage({ id: "issues.search" })}
            className="select-none pr-[7.25rem]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            autoComplete="off"
          />
          <Switch
            name="mode"
            value={mode}
            options={[
              { value: "issue", name: formatMessage({ id: "issues.search.mode.issue" }) },
              { value: "project", name: formatMessage({ id: "issues.search.mode.project" }), disabled: !!inProject },
            ]}
            onChange={(e) => setMode(e.target.value as SearchQuery["mode"])}
            className="absolute end-1 top-1.5 bg-gray-300 dark:bg-gray-800"
            tabIndex={-1}
          />
          {inProject && (
            <div className="mt-1.5 flex items-center gap-x-1.5 whitespace-nowrap ps-2">
              <FontAwesomeIcon icon={faChevronRight} />
              <FormattedMessage
                id="issues.search.search-in-project"
                values={{
                  projectName: inProject.name,
                  badge: (children) => <span className="truncate rounded-full bg-primary-300 px-1.5 text-xs dark:bg-primary-800">{children}</span>,
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
});

Search.displayName = "Search";

export default Search;
