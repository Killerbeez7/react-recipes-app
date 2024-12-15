import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./reset.css";
import { ScrollToTop } from "./components/utils/ScrollToTop";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>
);

reportWebVitals();
