import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import { Close, DarkMode, LightMode } from "@mui/icons-material";
import { usePiHome } from "../../providers/PihomeStateProvider";
import { VERSION } from "../../Version";

export type DrawerCommand = {
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  payload?: any;
};

export type NavItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface Props {
  open: boolean;
  currentView: string;
  navItems: NavItem[];
  commands: DrawerCommand[];
  dark: boolean;
  onNavigate: (view: string) => void;
  onThemeToggle: () => void;
  onClose: () => void;
}

const sectionLabel = (text: string) => (
  <Typography
    variant="caption"
    sx={{
      px: 2,
      pt: 2,
      pb: 0.5,
      display: "block",
      color: "rgba(255,255,255,0.25)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontSize: "0.65rem",
    }}
  >
    {text}
  </Typography>
);

const PihomeDrawer = ({
  open,
  currentView,
  navItems,
  commands,
  dark,
  onNavigate,
  onThemeToggle,
  onClose,
}: Props) => {
  const pihome = usePiHome();

  const handleCommand = (command: DrawerCommand) => {
    if (command.payload) pihome.send_payload(command.payload);
    command.onClick?.();
    onClose();
  };

  const handleNavigate = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          background: "rgba(10, 12, 22, 0.98)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header — app branding */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "9px",
              background: "linear-gradient(135deg, #818cf8, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.5px",
              flexShrink: 0,
            }}
          >
            Pi
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9", lineHeight: 1.2 }}>
              PiHome
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: "#334155" }}>
              v{VERSION}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.3)",
            borderRadius: "8px",
            "&:hover": { background: "rgba(255,255,255,0.07)", color: "#f1f5f9" },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Navigation */}
      {sectionLabel("Navigate")}
      <List sx={{ px: 1.5, pb: 0 }}>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <ListItemButton
              key={item.id}
              selected={isActive}
              onClick={() => handleNavigate(item.id)}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                py: 1.1,
                px: 1.5,
                color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.65)",
                background: isActive
                  ? "rgba(129, 140, 248, 0.12) !important"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(129,140,248,0.2)"
                  : "1px solid transparent",
                transition: "all 0.15s ease",
                "&:hover": {
                  background: isActive
                    ? "rgba(129,140,248,0.16) !important"
                    : "rgba(255,255,255,0.05) !important",
                  color: isActive ? "#a5b4fc" : "#f1f5f9",
                },
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ minWidth: 34, color: "inherit", "& svg": { fontSize: 18 } }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, my: 1.5, borderColor: "rgba(255,255,255,0.06)" }} />

      {/* Commands */}
      {sectionLabel("Actions")}
      <List sx={{ px: 1.5, pb: 0, flex: 1 }}>
        {commands.map((command, i) => (
          <ListItemButton
            key={command.name + i}
            onClick={() => handleCommand(command)}
            sx={{
              borderRadius: "10px",
              mb: 0.5,
              py: 0.9,
              px: 1.5,
              color: "rgba(255,255,255,0.5)",
              transition: "all 0.15s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.05) !important",
                color: "rgba(255,255,255,0.85)",
              },
            }}
          >
            {command.icon && (
              <ListItemIcon sx={{ minWidth: 34, color: "inherit", "& svg": { fontSize: 18 } }}>
                {command.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={command.name}
              primaryTypographyProps={{ fontSize: "0.825rem", fontWeight: 400 }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Chip
          label={pihome.online ? "Connected" : "Offline"}
          color={pihome.online ? "success" : "error"}
          size="small"
          variant="outlined"
          sx={{ borderRadius: "8px", fontSize: "0.68rem", fontWeight: 600 }}
        />
        <IconButton
          onClick={onThemeToggle}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.35)",
            borderRadius: "8px",
            "&:hover": { background: "rgba(255,255,255,0.07)", color: "#f1f5f9" },
          }}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default PihomeDrawer;
