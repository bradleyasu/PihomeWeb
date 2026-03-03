import "./ScreenButton.css";
import { Screen } from "../../pages/ScreenControl";

interface Props {
  screen: Screen;
  id: string;
  onClick?: () => void;
  isActive?: boolean;
}

const ScreenButton = ({ screen, id, onClick, isActive = false }: Props) => {
  return (
    <div
      role="button"
      aria-label={screen.label}
      aria-pressed={isActive}
      onClick={() => onClick?.()}
      className={`screen-btn${isActive ? ' active' : ''}`}
    >
      {isActive && <span className="active-dot" />}
      <img
        src={screen.icon}
        alt={screen.label}
        className="screen-btn-icon"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <span className="screen-btn-label">{screen.label}</span>
    </div>
  );
};

export default ScreenButton;
