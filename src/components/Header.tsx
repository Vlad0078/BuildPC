import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleLogoClick = () => navigate("/");

  const handleGoBack = () => {
    let destinationPage: string;
    switch (location.pathname) {
      case "/component":
        destinationPage = location.state.isAssemblyComponent
          ? "/"
          : "/component_list";
        break;
      case "/component_list":
      default:
        destinationPage = "";
        break;
    }

    navigate(destinationPage);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {!isHomePage && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
