import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  menuText: string;
  menuAction: () => void;
}

const Header: React.FC<HeaderProps> = ({ menuText, menuAction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLogoClick = () => navigate("/");

  const handleGoBack = () => navigate(-1);

  // * меню
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleMenuAction = () => {
    menuAction();
    setMenuAnchor(null);
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 0 }}>
      <Toolbar>
        {!isHomePage && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={handleGoBack}
          >
            <ArrowBackIosRoundedIcon />
          </IconButton>
        )}
        <Typography
          component="div"
          sx={{
            fontFamily: "Black Ops One, Roboto",
            fontSize: 42,
            ":hover": {
              cursor: "pointer",
              userSelect: "none",
            },
          }}
          onClick={handleLogoClick}
        >
          BuildPC
        </Typography>
        <div style={{ flexGrow: 1 }}></div>
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleOpenMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={menuOpen} onClose={handleCloseMenu}>
          <MenuItem onClick={handleMenuAction}>{menuText}</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
