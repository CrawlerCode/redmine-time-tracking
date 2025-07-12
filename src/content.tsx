import CurrentIssueTimerWrapper from "@/components/timer/CurrentIssueTimer.tsx";
import Providers from "@/provider/Providers";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
config.autoAddCss = false;

(() => {
  if (document.querySelector<HTMLDivElement>("#redmine-time-tracking-host")) return;

  const contextual = document.querySelector<HTMLDivElement>("#content .contextual");
  if (!contextual) return;

  // Add host element at the correct position
  const hostElement = document.createElement("div");
  hostElement.id = "redmine-time-tracking-host";
  hostElement.style.float = "right";
  hostElement.style.marginRight = "5px";
  contextual.parentElement?.insertBefore(hostElement, contextual.nextSibling);

  // Create a shadow root
  const shadowRoot = hostElement.attachShadow({ mode: "open" });

  // Add the react root element inside the shadow root
  const reactRoot = document.createElement("div");
  reactRoot.id = "root";
  shadowRoot.appendChild(reactRoot);

  // Add the styles (content.css)
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("index.css");
  shadowRoot.appendChild(style);

  // Render the react app
  ReactDOM.createRoot(reactRoot).render(
    <React.StrictMode>
      <Providers>
        <CurrentIssueTimerWrapper />
      </Providers>
    </React.StrictMode>
  );
})();
