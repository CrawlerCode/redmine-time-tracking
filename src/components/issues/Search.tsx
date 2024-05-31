import { faChevronRight, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ForwardedRef, ReactNode, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import { TReference } from "../../types/redmine";
import InputField from "../general/InputField";

export type SearchQuery = {
  searching: boolean;
  query: string;
  inProject?: TReference;
};

const defaultSearchQuery: SearchQuery = { searching: false, query: "" };

type PropTypes = {
  children: (state: { search: SearchQuery }) => ReactNode;
};

export type SearchRef = {
  searchInProject: (project: TReference) => void;
};

const Search = forwardRef(({ children }: PropTypes, ref: ForwardedRef<SearchRef>) => {
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
            type="search"
            name="query"
            placeholder={formatMessage({ id: "issues.search" })}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            autoComplete="off"
          />
          {inProject && (
            <div className="mt-1.5 flex items-center gap-x-1.5 whitespace-nowrap">
              <FontAwesomeIcon icon={faChevronRight} className="ps-2" />
              <FormattedMessage
                id="issues.search.search-in-project"
                values={{
                  projectName: inProject.name,
                  badge: (children) => <span className="truncate rounded-full bg-primary px-1.5 text-xs text-white">{children}</span>,
                }}
              />
              <div className="mr-2 flex grow justify-end">
                <FontAwesomeIcon icon={faX} className="cursor-pointer" onClick={() => setInProject(undefined)} />
              </div>
            </div>
          )}
        </div>
      )}
      {children({
        search: {
          searching,
          query,
          inProject,
        },
      })}
    </>
  );
});

Search.displayName = "Search";

export default Search;
