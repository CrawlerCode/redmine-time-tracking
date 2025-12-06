import { SearchIcon } from "lucide-react";
import { createContext, PropsWithChildren, use, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import { useSettings } from "../../provider/SettingsProvider";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export type TimerSearchContext = {
  isSearching: boolean;
  query: string;
};

const SearchContext = createContext<TimerSearchContext | undefined>(undefined);

const TimerSearch = ({ children }: PropsWithChildren) => {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();

  const searchRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(settings.style.displaySearchAlways);

  const [query, setQuery] = useState("");

  // hotkeys
  useHotKey({ ctrl: true, key: "k" }, () => {
    setIsSearchOpen(true);
    searchRef.current?.focus();
    searchRef.current?.select();
  });
  useHotKey({ ctrl: true, key: "f" }, () => {
    setIsSearchOpen(true);
    searchRef.current?.focus();
    searchRef.current?.select();
  });
  useHotKey(
    { key: "Escape" },
    () => {
      if (!settings.style.displaySearchAlways) {
        setIsSearchOpen(false);
      }
      setQuery("");
    },
    isSearchOpen
  );

  return (
    <>
      {isSearchOpen && (
        <div className="mb-4 flex flex-col gap-2">
          <InputGroup>
            <InputGroupInput ref={searchRef} name="query" placeholder={formatMessage({ id: "issues.search" })} value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
      <SearchContext
        value={{
          isSearching: isSearchOpen && query.length > 0,
          query,
        }}
      >
        {children}
      </SearchContext>
    </>
  );
};

export const useTimerSearch = () => {
  const context = use(SearchContext);
  if (!context) {
    throw new Error("useTimerSearch must be used within a TimerSearch component");
  }
  return context;
};

export default TimerSearch;
