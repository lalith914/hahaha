import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handler
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

console.log("App starting...");

createRoot(document.getElementById("root")!).render(<App />);
