import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => navigate("/");

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* // ! <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography
          component="div"
          sx={{
            flexGrow: 1,
            fontFamily: "Black Ops One, Roboto",
            fontSize: 42,
            ":hover": {
              cursor: "pointer",
              userSelect: "none",
            },
          }}
          onClick={() => handleLogoClick}
        >
          BuildPC
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
