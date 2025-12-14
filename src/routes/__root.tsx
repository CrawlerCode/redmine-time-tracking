import { GlobalErrorComponent } from "@/components/error/GlobalErrorComponent";
import { NotFoundComponent } from "@/components/error/NotFoundComponent";
import Navbar from "@/components/general/Navbar";
import { RouteContext } from "@/main";
import { restoreQueryClient } from "@/provider/QueryClientProvider";
import { createPopOut, getWindowLocationType } from "@/utils/popout";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { CalendarDaysIcon, ListIcon, SettingsIcon, SquareArrowOutUpRightIcon, TimerIcon } from "lucide-react";
import { useIntl } from "react-intl";

export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootLayout,
  beforeLoad: async () => {
    // Restore query client state before loading any route
    await restoreQueryClient();
  },
  notFoundComponent: NotFoundComponent,
  errorComponent: GlobalErrorComponent,
});

function RootLayout() {
  const { formatMessage } = useIntl();

  const locationType = getWindowLocationType();

  return (
    <>
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
        {locationType === "popup" && (
          <SquareArrowOutUpRightIcon className="bg-card border-border/30 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full border p-1.5" onClick={createPopOut} />
        )}
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-2">
          <Outlet />
        </div>
      </main>
    </>
  );
}
