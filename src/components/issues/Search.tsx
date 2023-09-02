import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import { TReference } from "../../types/redmine";
import InputField from "../general/InputField";

export type SearchQuery = {
  searching: boolean;
  query: string;
  inProject?: TReference;
};

// eslint-disable-next-line react-refresh/only-export-components
export const defaultSearchQuery: SearchQuery = { searching: false, query: "" };

type PropTypes = {
  onSearch: (search: SearchQuery) => void;
};

export type SearchRef = {
  searchInProject: (project: TReference) => void;
};

const Search = forwardRef(({ onSearch }: PropTypes, ref: ForwardedRef<SearchRef>) => {
  const { formatMessage } = useIntl();

  const searchRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(defaultSearchQuery.searching);
  const [query, setQuery] = useState(defaultSearchQuery.query);
  const [inProject, setInProject] = useState<TReference | undefined>(defaultSearchQuery.inProject);

  useImperativeHandle(ref, () => ({
    searchInProject(project: TReference) {
      setInProject(project);
      setSearching(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    },
  }));

  // sync states
  useEffect(() => {
    onSearch({
      searching,
      query,
      inProject,
    });
  }, [searching, query, inProject, onSearch]);

  // hotkeys
  useHotKey(
    () => {
      setSearching(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    },
    { ctrl: true, code: "KeyK" }
  );
  useHotKey(
    () => {
      setSearching(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    },
    { ctrl: true, code: "KeyF" }
  );
  useHotKey(
    () => {
      setSearching(false);
      setQuery("");
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
