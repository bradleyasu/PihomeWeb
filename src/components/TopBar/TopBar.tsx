import { AppBar } from "@mui/material";
import { TfiMenu } from "react-icons/tfi"
import "./TopBar.css";
import IconButton from "../IconButton/IconButton";

interface Props {

  onMenuClick?: () => void;
}

const TopBar = ({onMenuClick} : Props) => {
    return (
      <AppBar 
        position="static" 
        className="top-bar"
        elevation={0}
      >
        <div>
          <IconButton 
            icon={<TfiMenu />} 
            onClick={() => onMenuClick && onMenuClick()}
          />
          <span>
            PiHome
          </span>
        </div>
      </AppBar>
    )
}

export default TopBar;