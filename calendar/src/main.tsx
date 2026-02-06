import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Calendar from "./components/Calendar/Calendar.tsx";
import "./components/Calendar/Calendar.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Calendar Component</h1>
      <p>This component adapts to your Webflow site&apos;s design system.</p>
      <div style={{ marginTop: "1rem" }}>
        <Calendar />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h2>Compact size</h2>
        <Calendar size="compact" />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <h2>With dropdowns</h2>
        <Calendar captionLayout="dropdown" />
      </div>
    </div>
  </StrictMode>
);
