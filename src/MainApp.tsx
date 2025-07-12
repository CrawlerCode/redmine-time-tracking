import { Alert, AlertTitle } from "@//components/ui/alert";
import Navbar from "@/components/general/Navbar";
import { clsxm } from "@/utils/clsxm";
import { getPlatform } from "@/utils/platform";
import { createPopOut, getWindowLocationType } from "@/utils/popout";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faCalendarDays, faGear, faList, faStopwatch, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { AlertCircleIcon } from "lucide-react";
import { Suspense, lazy } from "react";
import { useIntl } from "react-intl";
import { Navigate, Route, Routes } from "react-router-dom";
config.autoAddCss = false;

const TimersPage = lazy(() => import("@/pages/TimersPage"));
const IssuesPage = lazy(() => import("@/pages/IssuesPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const TimePage = lazy(() => import("@/pages/TimePage"));

// TODO: Fix browser options page
function MainApp() {
  const { formatMessage } = useIntl();

  const locationType = getWindowLocationType();

  return (
    <div
      className={clsx("mx-auto w-[320px]", {
        "w-full min-w-[320px]": locationType === "popout" || locationType === "options",
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
              icon: <FontAwesomeIcon icon={faStopwatch} />,
              name: formatMessage({ id: "nav.tabs.timers" }),
            },
            {
              href: "/issues",
              icon: <FontAwesomeIcon icon={faList} />,
              name: formatMessage({ id: "nav.tabs.issues" }),
            },
            {
              href: "/time",
              icon: <FontAwesomeIcon icon={faCalendarDays} />,
              name: formatMessage({ id: "nav.tabs.time" }),
            },
            {
              href: "/settings",
              icon: <FontAwesomeIcon icon={faGear} />,
              name: formatMessage({ id: "nav.tabs.settings" }),
            },
          ]}
        />
        {locationType === "popup" && (
          <FontAwesomeIcon icon={faUpRightFromSquare} size="sm" className="bg-card absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full p-1.5" onClick={createPopOut} />
        )}
      </header>
      <main
        className={clsxm("h-[500px] overflow-y-scroll", {
          "h-[calc(100vh-3rem)]": locationType === "popout" || (locationType === "options" && getPlatform() === "Edge"),
        })}
      >
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
