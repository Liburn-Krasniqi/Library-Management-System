import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./global.css";
import { AppRouter } from "./router";
import { AppRoutes } from "./routes";
import { AppProvider } from "./provider";

createRoot(document.getElementById("root")!).render(
  <AppRouter>
    {/* put the provider inside the router as to allow useNavigate() to be used */}
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </AppRouter>
);
