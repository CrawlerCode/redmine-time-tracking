import Providers from "@/provider/Providers.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import MainApp from "./MainApp";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <MainApp />
    </Providers>
  </React.StrictMode>
);
