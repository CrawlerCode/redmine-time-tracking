import { Alert, AlertTitle } from "@//components/ui/alert";
import Navbar from "@/components/general/Navbar";
import { clsxm } from "@/utils/clsxm";
import { createPopOut, getWindowLocationType } from "@/utils/popout";
import { AlertCircleIcon, CalendarDaysIcon, ListIcon, SettingsIcon, SquareArrowOutUpRightIcon, TimerIcon } from "lucide-react";
import { Suspense, lazy } from "react";
import { useIntl } from "react-intl";
import { Navigate, Route, Routes } from "react-router-dom";

const TimersPage = lazy(() => import("@/pages/TimersPage"));
const IssuesPage = lazy(() => import("@/pages/IssuesPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const TimePage = lazy(() => import("@/pages/TimePage"));

function MainApp() {
  const { formatMessage } = useIntl();

  const locationType = getWindowLocationType();

  return (
    <div
      className={clsxm("mx-auto flex h-screen w-[320px] flex-col overflow-hidden", {
        "w-full min-w-[320px]": ["popout", "options"].includes(locationType),
        "h-[550px]": ["popup", "options"].includes(locationType),
      })}
      // disable context menu
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
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
          <Routes>
            <Route index element={<Navigate to="/issues" replace />} />

            <Route
              path="/timers"
              element={
                <Suspense>
                  <TimersPage />
                </Suspense>
              }
            />
            <Route
              path="/issues"
              element={
                <Suspense>
                  <IssuesPage />
                </Suspense>
              }
            />
            <Route
              path="/time"
              element={
                <Suspense>
                  <TimePage />
                </Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <Suspense>
                  <SettingsPage />
                </Suspense>
              }
            />

            <Route
              path="*"
              element={
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{formatMessage({ id: "nav.error.page-not-found" })}</AlertTitle>
                </Alert>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default MainApp;
