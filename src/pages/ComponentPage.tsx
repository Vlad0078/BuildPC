import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PCComponentData, componentOfType } from "../models/pc_component";
import {
  Fab,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import noImage from "../assets/no_image_placeholder.jpg";
import SpecTable from "../components/SpecTable";
import { addComponent } from "../store/assembly_store";
import { ComponentType } from "../models/component_types";

const ComponentPage: React.FC = () => {
  const location = useLocation();

  const navigate = useNavigate();

  // отримуємо компонент і тип
  if (!location.state || !location.state.component)
    throw Error("component not provided");

  if (!(location.state.componentType in ComponentType))
    throw Error("wrong component type provided");

  const componentData: PCComponentData = location.state.component;
  const componentType: ComponentType = location.state.componentType;
  const isAssemblyComponent: boolean = location.state.isAssemblyComponent;

  const component = componentOfType(componentData, componentType);

  const [imageLoadingFailed, setImageLoadingFailed] = useState(
    component.imageBig === ""
  );

  const handleAdd = () => {
    addComponent(component);
    navigate("/");
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;
  };

  return (
    <Grid
      container
      flexDirection="column"
      spacing="1rem"
      paddingTop="1rem"
      paddingBottom="1rem"
      alignItems="center"
    >
      {!isAssemblyComponent && (
        <Fab
          variant="extended"
          color="primary"
          size="large"
          sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
          onClick={handleAdd}
        >
          <AddRoundedIcon sx={{ mr: 1 }} />
          Додати до збірки
        </Fab>
      )}
      <Grid item>
        <Typography
          variant="h2"
          component="h1"
          textAlign="center"
          fontWeight={500}
        >
          {component.name}
        </Typography>
      </Grid>
      <Grid item width="min(800px, 100%)">
        <img
          src={imageLoadingFailed ? noImage : component.imageBig}
          style={{
            width: "100%",
          }}
          onError={() => setImageLoadingFailed(true)}
        />
      </Grid>
      {/* // * brain */}
      <Grid item width="min(1000px, 100%)">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          fontWeight={500}
        >
          Товар на brain.ua
        </Typography>
        <TableContainer>
          <Table sx={{ "*": { fontWeight: 900, border: "none !important" } }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontSize: "1.4rem" }}>
                  <Typography
                    component="span"
                    fontSize="inherit"
                    fontWeight={900}
                    color="primary"
                  >
                    <span style={{ fontWeight: 500, color: "#222222" }}>
                      Ціна:{" "}
                    </span>
                    {component.price} грн
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontSize: "1.4rem", fontWeight: 500 }}>
                  <Link
                    href={"https://brain.com.ua" + component.link}
                    rel="noopener"
                    target="_blank"
                  >
                    Переглянути сторінку товару
                  </Link>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* // * specs */}
      <Grid item width="min(1000px, 100%)">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          fontWeight={500}
        >
          Характеристики
        </Typography>
        <SpecTable specs={component.specs} />
      </Grid>
    </Grid>
  );
};

export default ComponentPage;
