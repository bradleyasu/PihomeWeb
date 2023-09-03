import { AppBar } from "@mui/material";
import { TfiMenu } from "react-icons/tfi"
import "./TopBar.css";
import IconButton from "../IconButton/IconButton";

const TopBar = () => {
    return (
      <AppBar 
        position="static" 
        className="top-bar"
        elevation={0}
      >
        <div>
          <IconButton 
            icon={<TfiMenu />} 
            onClick={() => console.log("clicked")}
          />
          <span>
            PiHome
          </span>
        </div>
      </AppBar>
    )
}

export default TopBar;