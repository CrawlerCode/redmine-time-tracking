import { faGear, faList, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense, lazy } from "react";
import { useIntl } from "react-intl";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/general/Navbar";
import Toast from "./components/general/Toast";

const IssuesPage = lazy(() => import("./pages/IssuesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const TimePage = lazy(() => import("./pages/TimePage"));

function App() {
  const { formatMessage } = useIntl();

  return (
    <div
      // disable context menu
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
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
      <main className="h-[500px] overflow-y-auto p-2">
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
