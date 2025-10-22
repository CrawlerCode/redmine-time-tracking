import Providers from "@/provider/Providers.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MainApp from "./MainApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <MainApp />
    </Providers>
  </React.StrictMode>
);
