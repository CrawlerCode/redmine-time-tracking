import { faGear, faList, faStopwatch, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Suspense, lazy } from "react";
import { useIntl } from "react-intl";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/general/Navbar";
import Toast from "./components/general/Toast";
import { createPopOut, getWindowLocationType } from "./utils/popout";

const IssuesPage = lazy(() => import("./pages/IssuesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const TimePage = lazy(() => import("./pages/TimePage"));

function App() {
  const { formatMessage } = useIntl();

  const locationType = getWindowLocationType();

  return (
    <div
      className={clsx("mx-auto w-[320px]", {
        "w-full min-w-[320px]": locationType === "popout",
      })}
      // disable context menu
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <header className="relative h-12">
        <Navbar
          navigation={[
            {
              href: "/issues",
              icon: <FontAwesomeIcon icon={faList} />,
              name: formatMessage({ id: "nav.tabs.issues" }),
            },
            {
              href: "/time",
              icon: <FontAwesomeIcon icon={faStopwatch} />,
              name: formatMessage({ id: "nav.tabs.time" }),
            },
            {
              href: "/settings",
              icon: <FontAwesomeIcon icon={faGear} />,
              name: formatMessage({ id: "nav.tabs.settings" }),
            },
          ]}
        />
        {locationType === "popup" && <FontAwesomeIcon icon={faUpRightFromSquare} size="lg" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer" onClick={createPopOut} />}
      </header>
      <main
        className={clsx("overflow-y-scroll p-2", {
          "h-[500px]": locationType !== "popout",
          "absolute bottom-0 top-12 w-full min-w-[320px]": locationType === "popout",
        })}
      >
        <Routes>
          <Route index element={<Navigate to="/issues" replace />} />

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

          <Route path="*" element={<Toast type="error" message={formatMessage({ id: "nav.error.page-not-found" })} allowClose={false} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
