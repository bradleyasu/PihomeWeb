import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Tv, MusicNote, Timer, CheckBox, Event } from "@mui/icons-material";
import "./App.css";
import TopBar from "./components/TopBar/TopBar";
import { useEffect, useState } from "react";
import { dark_theme, light_theme } from "./theme";
import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import PiHome from "./PiHome";
import { PihomeStateProvider } from "./providers/PihomeStateProvider";
import PihomeDrawer from "./components/Drawer/PihomeDrawer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 30,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const navItems = [
  { id: "screens", label: "Screens", icon: <Tv fontSize="small" /> },
  { id: "media", label: "Media", icon: <MusicNote fontSize="small" /> },
  { id: "timers", label: "Timers", icon: <Timer fontSize="small" /> },
  { id: "tasks_manager", label: "Tasks", icon: <CheckBox fontSize="small" /> },
  { id: "events", label: "Events", icon: <Event fontSize="small" /> },
];

const drawerCommands = [
  { name: "Shuffle Wallpaper", payload: { type: "wallpaper", action: "shuffle" } },
  { name: "Prev Wallpaper",    payload: { type: "wallpaper", action: "prev" } },
  { name: "Next Wallpaper",    payload: { type: "wallpaper", action: "next" } },
  { name: "Restart PiHome",    payload: { type: "restart" } },
  { name: "Shutdown PiHome",   payload: { type: "shutdown" } },
  { name: "Reload App",        onClick: () => window.location.reload() },
];

function App() {
  const [dark, setDark] = useState(localStorage.getItem("dark") !== "false");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("view") || "screens"
  );

  useEffect(() => { localStorage.setItem("dark", dark ? "true" : "false"); }, [dark]);
  useEffect(() => { localStorage.setItem("view", currentView); }, [currentView]);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ThemeProvider theme={dark ? dark_theme : light_theme}>
        <CssBaseline />
        <PihomeStateProvider>
          <div className="app-root">
            <TopBar
              onMenuClick={() => setDrawerOpen(true)}
              currentView={currentView}
              navItems={navItems}
            />

            <div className="app-content-area">
              <PiHome view={currentView} />
            </div>

            <PihomeDrawer
              open={drawerOpen}
              currentView={currentView}
              navItems={navItems}
              commands={drawerCommands}
              dark={dark}
              onNavigate={setCurrentView}
              onThemeToggle={() => setDark(!dark)}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </PihomeStateProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
