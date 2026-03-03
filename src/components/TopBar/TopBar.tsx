import "./TopBar.css";
import { Menu } from "@mui/icons-material";
import { usePiHome } from "../../providers/PihomeStateProvider";

interface NavItem {
  id: string;
  label: string;
}

interface Props {
  onMenuClick: () => void;
  currentView?: string;
  navItems?: NavItem[];
}

const TopBar = ({ onMenuClick, currentView, navItems }: Props) => {
  const { online } = usePiHome();

  const currentLabel =
    navItems?.find((n) => n.id === currentView)?.label ?? "";

  return (
    <header className="top-bar">
      <button className="top-bar-hamburger" onClick={onMenuClick} aria-label="Open menu">
        <Menu fontSize="small" />
      </button>

      <div className="top-bar-brand">
        <div className="top-bar-logo-mark">Pi</div>
        <span className="top-bar-app-name">PiHome</span>
      </div>

      {currentLabel && (
        <>
          <span className="top-bar-separator" />
          <span className="top-bar-view-name">{currentLabel}</span>
        </>
      )}

      <div className="top-bar-spacer" />

      <div className="top-bar-status">
        <span className={`status-dot ${online ? "online" : "offline"}`} />
        <span className="status-label">{online ? "Connected" : "Offline"}</span>
      </div>
    </header>
  );
};

export default TopBar;
