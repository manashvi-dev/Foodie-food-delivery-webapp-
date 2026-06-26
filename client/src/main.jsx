import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import 'mapbox-gl/dist/mapbox-gl.css';
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")).render(
 <>
      <App />
       <Analytics />
       </>
);
