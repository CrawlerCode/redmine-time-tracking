import { Skeleton } from "@/components/ui/skeleton";
import { clsxm } from "@/utils/clsxm";
import { SearchIcon } from "lucide-react";
import { createContext, PropsWithChildren, use, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useHotKey from "../../hooks/useHotkey";
import { useSettings } from "../../provider/SettingsProvider";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

export type TimerSearchContext = {
  isSearching: boolean;
  query: string;
};

type TimerSearchInternalContext = TimerSearchContext & {
  isSearchOpen: boolean;
  rawQuery: string;
  setRawQuery: (query: string) => void;
  focusTrigger: number;
};

const SearchContext = createContext<TimerSearchInternalContext | undefined>(undefined);

const TimerSearchProvider = ({ children }: PropsWithChildren) => {
  const { settings } = useSettings();

  const [isSearchOpen, setIsSearchOpen] = useState(settings.style.displaySearchAlways);
  const [query, setQuery] = useState("");
  const [focusTrigger, setFocusTrigger] = useState(0);

  const requestFocus = () => setFocusTrigger((prev) => prev + 1);

  // hotkeys
  useHotKey({ ctrl: true, key: "k" }, () => {
    setIsSearchOpen(true);
    requestFocus();
  });
  useHotKey({ ctrl: true, key: "f" }, () => {
    setIsSearchOpen(true);
    requestFocus();
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
    <SearchContext
      value={{
        isSearching: isSearchOpen && query.length > 0,
        query,
        isSearchOpen,
        rawQuery: query,
        setRawQuery: setQuery,
        focusTrigger,
      }}
    >
      {children}
    </SearchContext>
  );
};

const TimerSearchInput = ({ className }: { className?: string }) => {
  const { formatMessage } = useIntl();
  const ctx = useTimerSearchInternal();

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ctx.focusTrigger > 0) {
      searchRef.current?.focus();
      searchRef.current?.select();
    }
  }, [ctx.focusTrigger]);

  if (!ctx.isSearchOpen) return null;

  return (
    <div className={className}>
      <InputGroup>
        <InputGroupInput ref={searchRef} name="query" placeholder={formatMessage({ id: "issues.search" })} value={ctx.rawQuery} onChange={(e) => ctx.setRawQuery(e.target.value)} autoFocus />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

const useTimerSearchInternal = () => {
  const context = use(SearchContext);
  if (!context) {
    throw new Error("useTimerSearch must be used within a TimerSearch.Provider component");
  }
  return context;
};

export const useTimerSearch = (): TimerSearchContext => {
  const { isSearching, query } = useTimerSearchInternal();
  return { isSearching, query };
};

const TimerSearchInputSkeleton = ({ className }: { className?: string }) => {
  const { settings } = useSettings();

  if (!settings.style.displaySearchAlways) return null;

  return (
    <div className={clsxm("flex flex-col gap-2", className)}>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};
const TimerSearch = {
  Provider: TimerSearchProvider,
  Input: TimerSearchInput,
  Skeleton: {
    Input: TimerSearchInputSkeleton,
  },
};

export default TimerSearch;
