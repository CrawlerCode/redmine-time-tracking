import { ChevronRightIcon, SearchIcon, XIcon } from "lucide-react";
import { ReactNode, Ref, useImperativeHandle, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import useDebounce from "../../hooks/useDebounce";
import useHotKey from "../../hooks/useHotkey";
import { useSettings } from "../../provider/SettingsProvider";
import { TReference } from "../../types/redmine";
import { Badge } from "../ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export type SearchQuery = {
  searching: boolean;
  query: string;
  debouncedQuery?: string;
  inProject?: TReference;
};

const defaultSearchQuery: SearchQuery = { searching: false, query: "" };

type PropTypes = {
  children: (state: { search: SearchQuery }) => ReactNode;
  ref: Ref<SearchRef>;
};

export type SearchRef = {
  searchInProject: (project: TReference) => void;
};

const Search = ({ children, ref }: PropTypes) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const searchRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(defaultSearchQuery.searching);
  const [query, setQuery] = useState(defaultSearchQuery.query);
  const debouncedQuery = useDebounce(query, 300);
  const [inProject, setInProject] = useState<TReference | undefined>(defaultSearchQuery.inProject);
  const isSearching = searching || settings.style.displaySearchAlways;

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
      {isSearching && (
        <div className="mb-4 flex flex-col gap-2">
          <InputGroup>
            <InputGroupInput ref={searchRef} type="search" name="query" placeholder={formatMessage({ id: "issues.search" })} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          {inProject && (
            <div className="flex items-center gap-x-1.5 px-1 whitespace-nowrap">
              <ChevronRightIcon className="size-4 shrink-0" />
              <FormattedMessage
                id="issues.search.search-in-project"
                values={{
                  projectName: inProject.name,
                  badge: (children) => (
                    <Badge variant="secondary" className="shrink justify-start">
                      {children}
                    </Badge>
                  ),
                }}
              />
              <div className="flex grow justify-end">
                <XIcon className="size-4 cursor-pointer opacity-70 transition-opacity hover:opacity-100" onClick={() => setInProject(undefined)} />
              </div>
            </div>
          )}
        </div>
      )}
      {children({
        search: {
          searching: isSearching,
          query,
          debouncedQuery,
          inProject,
        },
      })}
    </>
  );
};

export default Search;
