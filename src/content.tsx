import CurrentIssueTimerWrapper from "@/components/timer/CurrentIssueTimer.tsx";
import Providers from "@/provider/Providers";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

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

  // Add the styles
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = chrome.runtime.getURL("style.css");
  shadowRoot.appendChild(style);

  const twProperties = document.createElement("link");
  twProperties.rel = "stylesheet";
  twProperties.href = chrome.runtime.getURL("tw-properties.css");
  document.head.appendChild(twProperties);

  // Render the react app
  ReactDOM.createRoot(reactRoot).render(
    <React.StrictMode>
      <Providers>
        <CurrentIssueTimerWrapper />
      </Providers>
    </React.StrictMode>
  );
})();
