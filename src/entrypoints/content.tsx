import { createShadowRootUi, defineContentScript } from "#imports";
import CurrentIssueTimerWrapper from "@/components/timer/CurrentIssueTimer";
import Providers from "@/provider/Providers";
import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  registration: "runtime",
  cssInjectionMode: "ui",
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "current-issue-timer",
      position: "inline",
      anchor: "#content .contextual",
      append: "after",
      inheritStyles: true,
      onMount: (container, _, shadowHost) => {
        shadowHost.id = "redmine-time-tracking-shadow-host";
        shadowHost.style.float = "right";
        shadowHost.style.marginRight = "5px";

        const reactRoot = document.createElement("div");
        reactRoot.id = "root";
        container.append(reactRoot);

        const root = ReactDOM.createRoot(reactRoot);
        root.render(
          <React.StrictMode>
            <Providers>
              <CurrentIssueTimerWrapper />
            </Providers>
          </React.StrictMode>
        );
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
