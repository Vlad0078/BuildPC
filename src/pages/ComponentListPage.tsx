import React, { useEffect } from "react";
import {
  ListLoadingState as LoadingState,
  useComponentList,
  useListComponentType,
  useListLoadingState,
} from "../store/assembly_store";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Grid, Typography } from "@mui/material";
import ComponentCard from "../components/ComponentCard";
import SearchAndFilter from "../components/SearchAndFilter";

const ComponentListPage: React.FC = () => {
  const navigate = useNavigate();

  const components = useComponentList();
  const componentType = useListComponentType();
  const loadingState = useListLoadingState();

  useEffect(() => {
    // якщо сторінку відкрили через рядок браузера і componentType не вказаний - повертаємо null і переходимо на сторінку збірки
    // ! його треба скидати при розмонтуванні сторінки, якщо зберігати збірку
    if (!componentType) {
      navigate("/");
      window.scrollTo(0, 0);
      // console.error("component type not provided");
    }
  }, [componentType, navigate]);

  return (
    <Grid container flexDirection="column" flexGrow={1}>
      {
        // поле пошуку лише якщо комплектуючі вже було завантажено
        (loadingState === LoadingState.LOADED ||
          loadingState === LoadingState.RELOADING) && <SearchAndFilter />
      }
      {loadingState === LoadingState.LOADING ||
      (loadingState === LoadingState.RELOADING && !components.length) ? (
        <Grid item alignSelf="center" alignContent="center" flexGrow={1}>
          <CircularProgress size="8rem" />
        </Grid>
      ) : (
        <Grid container flexDirection="column" spacing={1} flexGrow={1}>
          {loadingState === LoadingState.RELOADING && (
            <Grid item alignSelf="center">
              <CircularProgress size="3rem" />
            </Grid>
          )}
          {components.length ? (
            // комплектуючі
            components.map((component) => (
              <Grid item key={component.id}>
                <ComponentCard component={component} />
              </Grid>
            ))
          ) : (
            <Grid
              item
              alignSelf="center"
              alignContent="center"
              flexGrow={1}
              padding="1rem !important"
            >
              <Typography variant="h4" textAlign="center">
                {"Не знайдено комплектуючих за вашим запитом :("}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default ComponentListPage;
