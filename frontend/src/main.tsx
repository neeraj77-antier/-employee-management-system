import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ui/Toast";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
