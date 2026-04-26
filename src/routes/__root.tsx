import { GlobalErrorComponent } from "@/components/error/GlobalErrorComponent";
import { NotFoundComponent } from "@/components/error/NotFoundComponent";
import Navbar from "@/components/general/Navbar";
import { RouteContext } from "@/main";
import { createPopOut } from "@/utils/popout";
import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import { CalendarDaysIcon, ListIcon, SettingsIcon, SquareArrowOutUpRightIcon, TimerIcon } from "lucide-react";
import { useIntl } from "react-intl";
import { browser } from "wxt/browser";

export const Route = createRootRouteWithContext<RouteContext>()({
  head: () => ({
    meta: [
      {
        title: browser.runtime.getManifest().name,
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFoundComponent,
  errorComponent: GlobalErrorComponent,
});

function RootLayout() {
  const { entrypoint } = Route.useRouteContext();
  const { formatMessage } = useIntl();

  return (
    <>
      <HeadContent />
      <header className="relative">
        <Navbar
          navigation={[
            {
              href: "/timers",
              icon: <TimerIcon />,
              name: formatMessage({ id: "nav.tabs.timers" }),
            },
            {
              href: "/issues",
              icon: <ListIcon />,
              name: formatMessage({ id: "nav.tabs.issues" }),
            },
            {
              href: "/time",
              icon: <CalendarDaysIcon />,
              name: formatMessage({ id: "nav.tabs.time" }),
            },
            {
              href: "/settings",
              icon: <SettingsIcon />,
              name: formatMessage({ id: "nav.tabs.settings" }),
            },
          ]}
        />
        {entrypoint === "popup" && (
          <SquareArrowOutUpRightIcon
            className="bg-card border-border/50 hover:bg-muted hover:border-border absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full border p-1.5 transition-colors"
            onClick={createPopOut}
          />
        )}
      </header>
      <main className="flex flex-1 flex-col overflow-y-auto p-2 sm:p-4">
        <Outlet />
      </main>
      <footer id="footer" className="bg-muted/50 flex w-full justify-end border-t p-4 empty:hidden" />
    </>
  );
}
