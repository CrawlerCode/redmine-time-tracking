import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import useHotKey from "../../hooks/useHotkey";
import InputField from "../general/InputField";

type PropTypes = {
  onSearch: (search: { searching: boolean; query: string }) => void;
};

const Search = ({ onSearch }: PropTypes) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    onSearch({
      searching,
      query,
    });
  }, [searching, query]);

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
    },
    { key: "Escape" },
    searching
  );

  return <>{searching && <InputField ref={searchRef} icon={<FontAwesomeIcon icon={faSearch} />} placeholder="Search..." className="select-none mb-3" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus autoComplete="off" />}</>;
};

export default Search;
