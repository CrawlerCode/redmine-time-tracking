import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useHotKey from "../../hooks/useHotkey";
import InputField from "../general/InputField";
import Switch from "../general/Switch";

export type SearchQuery = {
  searching: boolean;
  mode: "issue" | "project";
  query: string;
};

export const defaultSearchQuery: SearchQuery = { searching: false, mode: "issue", query: "" };

type PropTypes = {
  onSearch: (search: SearchQuery) => void;
};

const Search = ({ onSearch }: PropTypes) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<SearchQuery["mode"]>(defaultSearchQuery.mode);
  const [query, setQuery] = useState(defaultSearchQuery.query);

  useEffect(() => {
    onSearch({
      searching,
      mode,
      query,
    });
  }, [searching, mode, query]);

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
    },
    { key: "Escape" },
    searching
  );

  return (
    <>
      {searching && (
        <div className="relative">
          <InputField ref={searchRef} icon={<FontAwesomeIcon icon={faSearch} />} name="query" placeholder="Search..." className="select-none mb-3 pr-[7.25rem]" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus autoComplete="off" />
          <Switch
            name="mode"
            value={mode}
            options={[
              { value: "issue", name: "Issue" },
              { value: "project", name: "Project" },
            ]}
            onChange={(e) => setMode(e.target.value as SearchQuery["mode"])}
            className="absolute top-1.5 end-1 bg-gray-300 dark:bg-gray-800"
          />
        </div>
      )}
    </>
  );
};

export default Search;
