// Routing manual ringan: tidak pakai react-router agar bundle tetap kecil
// sesuai steering/tech.md (initial JS target < 500 KB gzip).

import { StudioApp } from "./components/StudioApp";
import { EmbedPage } from "./components/EmbedPage";

function App() {
  const isEmbedRoute = window.location.pathname === "/embed";
  return isEmbedRoute ? <EmbedPage /> : <StudioApp />;
}

export default App;
