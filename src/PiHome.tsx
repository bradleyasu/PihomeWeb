import { Box, Typography, Button, CircularProgress, useTheme } from "@mui/material";
import { WifiOff, Refresh } from "@mui/icons-material";
import { usePiHome } from "./providers/PihomeStateProvider";
import ScreenControl from "./pages/ScreenControl";
import Media from "./pages/Media";
import Timers from "./pages/Timers";
import TaskManager from "./pages/TaskManager";
import EventManager from "./pages/EventManager";

interface Props {
  view: string;
}

const views: { [key: string]: React.ReactNode } = {
  media: <Media />,
  screens: <ScreenControl />,
  timers: <Timers />,
  tasks_manager: <TaskManager />,
  events: <EventManager />,
  default: (
    <Box p={4}>
      <Typography color="text.secondary">Select a view</Typography>
    </Box>
  ),
};

const PiHome = ({ view }: Props) => {
  const pihome = usePiHome();
  const theme = useTheme();

  const wallpaper = pihome.phstate?.wallpaper?.current_wallpaper;

  if (!pihome.online) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0d0f1a 0%, #111827 100%)"
              : "linear-gradient(135deg, #f0f4ff 0%, #e8eaf6 100%)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
            maxWidth: 340,
            textAlign: "center",
          }}
        >
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              size={64}
              thickness={2}
              sx={{
                color: "primary.main",
                animation: "spin 1.2s linear infinite",
                "@keyframes spin": {
                  from: { transform: "rotate(0deg)" },
                  to: { transform: "rotate(360deg)" },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WifiOff sx={{ color: "primary.main", fontSize: 24 }} />
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Connecting to PiHome
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.6 }}
          >
            Make sure your PiHome device is on the same network and the server
            is running.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
            sx={{ mt: 1, borderRadius: "10px" }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Wallpaper background */}
      {wallpaper && (
        <Box
          className="app-wallpaper"
          sx={{ backgroundImage: `url(${wallpaper})` }}
        />
      )}

      {/* Page content */}
      <Box className="app-content view-transition" key={view}>
        {views[view] ?? views["default"]}
      </Box>
    </Box>
  );
};

export default PiHome;
