import { faGear, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Toast from "./components/general/Toast";
import IssuesPage from "./pages/IssuesPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-1">
        <ul className="flex flex-wrap gap-x-2 -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li>
            <Link
              to="/issues"
              className={clsx(
                "inline-flex items-center gap-x-1 p-2 rounded-t-lg",
                location.pathname === "/issues" ? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500" : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-30 dark:hover:text-gray-300",
                "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600"
              )}
            >
              <FontAwesomeIcon icon={faList} />
              Issues
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={clsx(
                "inline-flex items-center gap-x-1 p-2 rounded-t-lg",
                location.pathname === "/settings" ? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500" : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-30 dark:hover:text-gray-300",
                "focus:ring-2 focus:ring-primary-300 focus:outline-none dark:focus:ring-primary-600"
              )}
            >
              <FontAwesomeIcon icon={faGear} />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <main className="h-[500px] overflow-y-auto p-2">
        <Routes>
          <Route index element={<Navigate to="/issues" replace />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Toast type="error" message="Page not found!" allowClose={false} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
