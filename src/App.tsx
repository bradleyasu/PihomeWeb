import { ThemeProvider } from '@emotion/react';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import { useEffect, useState } from 'react';
import { dark_theme, light_theme } from './theme';
import { Button, Drawer, TextField } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import MediaPlayer from './components/MediaPlayer/MediaPlayer';
import { useCurrentStatus } from './hooks/useStatus';
import PiHome from './PiHome';
import { PihomeStateProvider } from './providers/PihomeStateProvider';
import PihomeDrawer from './components/Drawer/PihomeDrawer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 30,// 30 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  }
});


const persister = createSyncStoragePersister({
  storage: window.localStorage,
});


function App() {
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState("media");

  useEffect(() => {
    localStorage.setItem("dark", dark ? "true" : "false");
  }, [dark]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ThemeProvider theme={dark ? dark_theme : light_theme}>
        <div className="root-container">
          <TopBar
            onMenuClick={() => setOpen(!open)}
          />
          <div>
            <PihomeStateProvider>
              <Drawer
                open={open}
              >
                <PihomeDrawer 
                  commands={[
                    {
                      name: "Toggle Dark Mode",
                      onClick: () => setDark(!dark)
                    },
                    {
                      name: "Shuffle Wallpaper",
                      payload: {
                        "type": "wallpaper_shuffle"
                      }
                    }
                  ]}
                  onClose={() => setOpen(false)}
                />
              </Drawer>
              <PiHome view={currentView} />
            </PihomeStateProvider>
          </div>
        </div>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
