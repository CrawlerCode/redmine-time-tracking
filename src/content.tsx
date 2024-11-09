import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-tooltip/dist/react-tooltip.css";
import CurrentIssueTimer from "./components/issues/CurrentIssueTimer.tsx";
import "./content.css";
import Providers from "./provider/Providers.tsx";
config.autoAddCss = false;

(() => {
  const contextual = document.querySelector<HTMLDivElement>("#content .contextual");
  if (!contextual) return;

  let timerRoot = document.querySelector<HTMLDivElement>("#redmine-time-tracking-timer-root");
  if (!timerRoot) {
    // Add container at the correct position
    const container = document.createElement("div");
    container.style.float = "right";
    container.style.marginTop = "-4px";
    contextual.parentElement?.insertBefore(container, contextual.nextSibling);

    // Create a shadow root
    const shadowRoot = container.attachShadow({ mode: "open" });

    // Add the root element inside the shadow root
    timerRoot = document.createElement("div");
    timerRoot.id = "redmine-time-tracking-timer-root";
    timerRoot.className = "text-text";
    shadowRoot.appendChild(timerRoot);

    // Add the styles (content.css)
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = chrome.runtime.getURL("content.css");
    shadowRoot.appendChild(style);
  }

  // Render the react app
  ReactDOM.createRoot(timerRoot).render(
    <React.StrictMode>
      <Providers>
        <CurrentIssueTimer />
      </Providers>
    </React.StrictMode>
  );
})();
