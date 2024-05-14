import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PCComponent,
  PCComponentData,
  componentOfType,
} from "../models/pc_component";
import { ComponentType } from "../models/component_types";
import {
  addComponent,
  clearUserFilters,
  loadComponentList,
  removeComponent,
  resetStore,
} from "../store/assembly_store";

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

  // * меню
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleAddComponent = () => {
    const componentData: PCComponentData = location.state.component;
    const componentType: ComponentType = location.state.componentType;
    const component = componentOfType(componentData, componentType);

    addComponent(component);
    navigate("/");
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;

    setMenuAnchor(null);
  };

  const handleRemoveComponent = () => {
    const componentId: number = location.state.componentId;
    const component: PCComponent = location.state.component;

    removeComponent(componentId, component);
    navigate("/");
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;

    setMenuAnchor(null);
  };

  const handleReloadList = () => {
    clearUserFilters();
    loadComponentList(1, "");

    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;

    setMenuAnchor(null);
  };

  const handleResetAssembly = () => {
    resetStore();
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;

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
          <MenuIcon />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={menuOpen} onClose={handleCloseMenu}>
          {location.pathname === "/" && (
            <MenuItem onClick={handleResetAssembly}>Скинути збірку</MenuItem>
          )}
          {location.pathname === "/component_list" && (
            <MenuItem onClick={handleReloadList}>
              Скинути фільтри та оновити список
            </MenuItem>
          )}
          {location.pathname === "/component" &&
            (location.state.isAssemblyComponent ? (
              <MenuItem onClick={handleRemoveComponent}>
                Видалити зі збірки
              </MenuItem>
            ) : (
              <MenuItem onClick={handleAddComponent}>Додати до збірки</MenuItem>
            ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
