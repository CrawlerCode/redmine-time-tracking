export type Entrypoint = "index" | "popup" | "options";

export const getEntrypoint = (): Entrypoint => {
  return (window.location.pathname.match(/^\/(index|popup|options)\.html/)?.[1] as Entrypoint) ?? "index";
};
