export type Entrypoint = "index" | "popup" | "options";

export const getEntrypoint = (): Entrypoint => {
  // In production (built extension), pages are served at the root, e.g. "/options.html".
  // In dev (WXT dev server / preview), pages are served from "/src/entrypoints/options.html".
  return (window.location.pathname.match(/\/(index|popup|sidepanel|options)\.html$/)?.[1] as Entrypoint) ?? "index";
};
