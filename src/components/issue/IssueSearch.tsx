/* eslint-disable react/no-children-prop */
import useRedmineIssuesSearch from "@/api/redmine/hooks/useRedmineIssuesSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppForm } from "@/hooks/useAppForm";
import { useSuspenseStorage } from "@/hooks/useStorage";
import { clsxm } from "@/utils/clsxm";
import { ChevronRightIcon, CloudIcon, ListTreeIcon, MoreHorizontalIcon, SearchIcon, XIcon } from "lucide-react";
import { createContext, PropsWithChildren, use, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { z } from "zod";
import { TIssue, TReference } from "../../api/redmine/types";
import { useDebouncedValue } from "@mantine/hooks";
import useHotKey from "../../hooks/useHotkey";
import { useSettings } from "../../provider/SettingsProvider";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Form, FormGrid } from "../ui/form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

const searchSettingsSchema = z.object({
  mode: z.enum(["local", "remote"]),
  remoteSearchOptions: z.object({
    titlesOnly: z.boolean(),
    openIssuesOnly: z.boolean(),
    assignedToMe: z.boolean(),
  }),
});

type SearchSettingsSchema = z.infer<typeof searchSettingsSchema>;

const defaultSearchSettings: SearchSettingsSchema = {
  mode: "local",
  remoteSearchOptions: {
    titlesOnly: false,
    openIssuesOnly: true,
    assignedToMe: true,
  },
};

export type IssueSearchContext = {
  isSearching: boolean;
  query: string;
  inProject?: TReference;
  settings: SearchSettingsSchema;
  searchInProject: (project: TReference) => void;
};

type IssueSearchInternalContext = IssueSearchContext & {
  isSearchOpen: boolean;
  rawQuery: string;
  setRawQuery: (query: string) => void;
  setInProject: (project: TReference | undefined) => void;
  setSettings: (settings: SearchSettingsSchema) => Promise<void>;
  focusTrigger: number;
};

const SearchContext = createContext<IssueSearchInternalContext | undefined>(undefined);

const IssueSearchProvider = ({ children }: PropsWithChildren) => {
  const { settings } = useSettings();

  const [isSearchOpen, setIsSearchOpen] = useState(settings.style.displaySearchAlways);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [inProject, setInProject] = useState<TReference | undefined>(undefined);
  const [focusTrigger, setFocusTrigger] = useState(0);

  const { data: searchSettings, setData: setSearchSettings } = useSuspenseStorage<SearchSettingsSchema>("search", defaultSearchSettings);

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
      setInProject(undefined);
    },
    isSearchOpen
  );

  return (
    <SearchContext
      value={{
        isSearching: isSearchOpen && (searchSettings.mode === "local" ? query.length > 0 : debouncedQuery.length >= 3),
        query: searchSettings.mode === "local" ? query : debouncedQuery,
        inProject,
        setInProject,
        settings: searchSettings,
        setSettings: setSearchSettings,
        isSearchOpen,
        rawQuery: query,
        setRawQuery: setQuery,
        searchInProject: (project: TReference) => {
          setInProject(project);
          setIsSearchOpen(true);
          requestFocus();
        },
        focusTrigger,
      }}
    >
      {children}
    </SearchContext>
  );
};

const IssueSearchInput = ({ className }: { className?: string }) => {
  const { formatMessage } = useIntl();
  const ctx = useIssueSearchInternal();

  const settingsForm = useAppForm({
    defaultValues: ctx.settings,
    validators: {
      onChange: searchSettingsSchema,
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (formApi.state.isValid) {
          formApi.handleSubmit();
        }
      },
    },
    onSubmit: async ({ value }) => {
      await ctx.setSettings(value);
    },
  });

  // Focus when requested by provider
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ctx.focusTrigger > 0) {
      searchRef.current?.focus();
      searchRef.current?.select();
    }
  }, [ctx.focusTrigger]);

  // Toggle search mode hotkey
  useHotKey(
    { ctrl: true, key: "m" },
    () => {
      settingsForm.setFieldValue("mode", (current) => (current === "local" ? "remote" : "local"));
      settingsForm.handleSubmit();
    },
    ctx.isSearchOpen
  );

  if (!ctx.isSearchOpen) return null;

  return (
    <div className={clsxm("flex flex-col gap-2", className)}>
      <Form onSubmit={settingsForm.handleSubmit}>
        <InputGroup>
          <InputGroupInput ref={searchRef} name="query" placeholder={formatMessage({ id: "issues.search" })} value={ctx.rawQuery} onChange={(e) => ctx.setRawQuery(e.target.value)} autoFocus />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="gap-1">
            <settingsForm.AppField
              name="mode"
              children={(field) => (
                <DropdownMenu>
                  <DropdownMenuTrigger render={<InputGroupButton variant="secondary" />}>
                    {field.state.value === "local"
                      ? formatMessage({ id: "issues.search.mode.local" })
                      : field.state.value === "remote"
                        ? formatMessage({ id: "issues.search.mode.remote" })
                        : "unknown"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={10} align="center" className="w-auto">
                    <DropdownMenuItem onClick={() => field.handleChange("local")}>
                      <ListTreeIcon />
                      {formatMessage({ id: "issues.search.mode.local" })}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => field.handleChange("remote")}>
                      <CloudIcon />
                      {formatMessage({ id: "issues.search.mode.remote" })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            />
            <Separator orientation="vertical" className="my-auto h-4" />
            <settingsForm.Subscribe
              selector={(state) => ({
                mode: state.values.mode,
              })}
              children={({ mode }) => (
                <Popover>
                  <PopoverTrigger render={<InputGroupButton variant="ghost" size="icon-xs" />} disabled={mode !== "remote"}>
                    <MoreHorizontalIcon />
                  </PopoverTrigger>
                  <PopoverContent sideOffset={10} collisionPadding={10} className="w-56">
                    <FormGrid className="gap-3">
                      <FieldSet>
                        <FieldLabel>{formatMessage({ id: "issues.search.remote-search-options.title" })}</FieldLabel>
                        <FieldGroup data-slot="checkbox-group">
                          <settingsForm.AppField
                            name="remoteSearchOptions.titlesOnly"
                            children={(field) => (
                              <field.SwitchField
                                title={formatMessage({ id: "issues.search.remote-search-options.titles-only.title" })}
                                info={formatMessage({ id: "issues.search.remote-search-options.titles-only.description" })}
                              />
                            )}
                          />
                          <settingsForm.AppField
                            name="remoteSearchOptions.openIssuesOnly"
                            children={(field) => <field.SwitchField title={formatMessage({ id: "issues.search.remote-search-options.open-issues-only.title" })} />}
                          />
                          <settingsForm.AppField
                            name="remoteSearchOptions.assignedToMe"
                            children={(field) => <field.SwitchField title={formatMessage({ id: "issues.search.remote-search-options.assigned-to-me.title" })} />}
                          />
                        </FieldGroup>
                      </FieldSet>
                    </FormGrid>
                  </PopoverContent>
                </Popover>
              )}
            />
          </InputGroupAddon>
        </InputGroup>
      </Form>
      {ctx.inProject && (
        <div className="flex items-center gap-x-1.5 px-1 whitespace-nowrap">
          <ChevronRightIcon className="size-4 shrink-0" />
          {formatMessage(
            {
              id: "issues.search.search-in-project",
            },
            {
              projectName: ctx.inProject.name,
              badge: (children) => (
                <Badge variant="secondary" className="shrink justify-start">
                  {children}
                </Badge>
              ),
            }
          )}
          <div className="flex grow justify-end">
            <XIcon className="size-4 cursor-pointer opacity-70 transition-opacity hover:opacity-100" onClick={() => ctx.setInProject(undefined)} />
          </div>
        </div>
      )}
    </div>
  );
};

const IssueSearchLoadMore = ({
  hasNextPage,
  isLoading,
  fetchNextPage,
  className,
}: Pick<ReturnType<typeof useRedmineIssuesSearch>, "hasNextPage" | "isLoading" | "fetchNextPage"> & {
  className?: string;
}) => {
  const { formatMessage } = useIntl();
  const ctx = useIssueSearchInternal();

  if (!(ctx.isSearching && ctx.settings.mode === "remote" && hasNextPage && !isLoading)) return null;

  return (
    <div className={clsxm("flex justify-center", className)}>
      <Button variant="outline" onClick={() => fetchNextPage()}>
        {formatMessage({ id: "issues.list.load-more" })}
      </Button>
    </div>
  );
};

const useIssueSearchInternal = () => {
  const context = use(SearchContext);
  if (!context) {
    throw new Error("useIssueSearch must be used within a IssueSearch.Provider component");
  }
  return context;
};

export const useIssueSearch = (): IssueSearchContext => {
  const { isSearching, query, inProject, settings, searchInProject } = useIssueSearchInternal();
  return { isSearching, query, inProject, settings, searchInProject };
};

export const filterIssuesByLocalSearch = (issues: TIssue[], search: IssueSearchContext) => {
  if (search.isSearching && search.settings.mode === "local") {
    // filter: project (search in project)
    if (search.inProject) {
      issues = issues.filter((issue) => issue.project.id === search.inProject!.id);
    }

    // search: local search
    if (search.query) {
      issues = issues.filter((issue) => new RegExp(search.query, "i").test(`#${issue.id} ${issue.subject}`));
    }
  }

  return issues;
};

const IssueSearchInputSkeleton = ({ className }: { className?: string }) => {
  const { settings } = useSettings();

  if (!settings.style.displaySearchAlways) return null;

  return (
    <div className={clsxm("flex flex-col gap-2", className)}>
      <Skeleton className="h-8 w-full" />
    </div>
  );
};

const IssueSearch = {
  Provider: IssueSearchProvider,
  Input: IssueSearchInput,
  LoadMore: IssueSearchLoadMore,
  Skeleton: {
    Input: IssueSearchInputSkeleton,
  },
};

export default IssueSearch;
