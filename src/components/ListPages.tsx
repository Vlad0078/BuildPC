import { IconButton, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import React from "react";
import {
  loadComponentList,
  useListPage,
  useListPages,
} from "../store/assembly_store";

const ListPages: React.FC = () => {
  const page = useListPage();
  const pages = useListPages();

  const nextPage = () => {
    if (page < pages) {
      const mainContainer = document.getElementById("main-container");
      if (mainContainer) mainContainer.scrollTop = 0;
      loadComponentList(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const mainContainer = document.getElementById("main-container");
      if (mainContainer) mainContainer.scrollTop = 0;
      loadComponentList(page - 1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <IconButton edge="start" color="inherit" onClick={prevPage}>
        <ArrowBackIosRoundedIcon />
      </IconButton>
      <Typography
        variant="h5"
        component="div"
        sx={{ ml: "0.5rem", mr: "0.2rem" }}
      >
        Сторінка <b>{page}</b> із <b>{pages}</b>
      </Typography>
      <IconButton edge="end" color="inherit" onClick={nextPage}>
        <ArrowForwardIosRoundedIcon />
      </IconButton>
    </div>
  );
};

export default ListPages;
