import {
  Card,
  CardContent,
  Grid,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { PCComponent } from "../models/pc_component";
import { removeComponent } from "../store/assembly_store";
import noImage from "../assets/no_image_placeholder.jpg";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  titleTypography: {
    display: "-webkit-box",
    overflow: "hidden",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    "@media (orientation: portrait)": {
      "-webkit-line-clamp": 3,
    },
  },

  subtitleTypography: {
    "@media (orientation: portrait)": {
      display: "none",
    },

    "@media (orientation: landscape)": {
      display: "-webkit-box",
      overflow: "hidden",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": 2,
    },
  },
}));

interface ComponentCardProps {
  componentId?: number; // індекс компонента в збірці
  component: PCComponent;
  isAssemblyComponent?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  componentId, // в межах збірки
  component,
  isAssemblyComponent = false,
}) => {
  const classes = useStyles();
  const [imageLoadingFailed, setImageLoadingFailed] = useState(
    component.imageSmall === ""
  );

  const navigate = useNavigate();

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (!isAssemblyComponent)
      throw new Error("can't remove a component outside of an assembly");
    if (componentId === undefined)
      throw new Error("can't remove a component without an id");
    removeComponent(componentId, component.componentType);
  };

  const specList = Object.values(component.specs);
  const specString = specList
    .map((spec) => `${spec.prettyName}: ${spec.prettyValue}`)
    .join(", ");

  const handleOpen: React.MouseEventHandler<HTMLDivElement> = () => {
    navigate("/component", {
      state: {
        component,
        componentType: component.componentType,
        isAssemblyComponent,
        componentId,
      },
    });
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;
  };

  return (
    <Card
      sx={
        isAssemblyComponent
          ? { ":hover": { cursor: "pointer" } }
          : {
              ":hover": { cursor: "pointer" },
              boxShadow: "0 0 1px #e0e0e0",
            }
      }
      onClick={handleOpen}
    >
      <CardContent sx={{ pb: "0.5rem" }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap">
          <Grid item>
            <img
              src={imageLoadingFailed ? noImage : component.imageSmall}
              style={{
                height: "min(150px, 25vw)",
                width: "min(150px, 25vw)",
              }}
              onError={() => setImageLoadingFailed(true)}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              component="div"
              className={classes.titleTypography}
            >
              {component.name}
            </Typography>
            <Typography
              color="text.secondary"
              variant="subtitle1"
              className={classes.subtitleTypography}
            >
              {specString}
            </Typography>
            {!isAssemblyComponent && (
              <Typography color="primary" variant="h6" component="div">
                {component.price} грн
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
      {isAssemblyComponent && (
        <CardActions>
          <Button size="large" color="primary">
            Відкрити
          </Button>
          <Button size="large" color="error" onClick={handleDelete}>
            Видалити зі збірки
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ComponentCard;
