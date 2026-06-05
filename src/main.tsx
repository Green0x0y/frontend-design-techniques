
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initializeAnalytics } from "./firebase";

  void initializeAnalytics();

  createRoot(document.getElementById("root")!).render(<App />);
  