import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/fonts.css";
import App from "./App.js";
import { GlobalProvider } from "./contexts/GlobalContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
