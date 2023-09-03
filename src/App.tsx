import { ThemeProvider } from '@emotion/react';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import { useState } from 'react';
import { dark_theme, light_theme } from './theme';
import { TextField } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import MediaPlayer from './components/MediaPlayer/MediaPlayer';

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
  const [dark, setDark] = useState(false)
  
  const [test, setTest] = useState("test")
  
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ThemeProvider theme={dark ? dark_theme : light_theme}>
        <div className="root-container">
          <TopBar />
          <div style={{paddingTop: "100px"}}>
            <MediaPlayer />
          </div>
        </div>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}

export default App;
