import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import "./styles/terminal.css";
import App from "./App.jsx";
import LoreDocumentPage from "./pages/LoreDocumentPage.jsx";
import LoreIndexPage from "./pages/LoreIndexPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/lore" element={<LoreIndexPage />} />
        <Route path="/lore/:slug" element={<LoreDocumentPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
