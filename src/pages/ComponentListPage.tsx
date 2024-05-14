import React, { useEffect } from "react";
import {
  ListLoadingState as LoadingState,
  clearUserFilters,
  loadComponentList,
  useComponentList,
  useListComponentType,
  useListLoadingState,
} from "../store/assembly_store";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Grid, Typography } from "@mui/material";
import ComponentCard from "../components/ComponentCard";
import SearchAndFilter from "../components/SearchAndFilter";
import ListPages from "../components/ListPages";
import Header from "../components/Header";

const ComponentListPage: React.FC = () => {
  const navigate = useNavigate();

  const components = useComponentList();
  const componentType = useListComponentType();
  const loadingState = useListLoadingState();

  useEffect(() => {
    // якщо сторінку відкрили через рядок браузера і componentType не вказаний - повертаємо null і переходимо на сторінку збірки
    if (!componentType) {
      navigate("/");
      const mainContainer = document.getElementById("main-container");
      if (mainContainer) mainContainer.scrollTop = 0;
      // console.error("component type not provided");
    } else if (!components.length) {
      loadComponentList();
    }
  }, [componentType, components.length, navigate]);

  const handleReloadList = () => {
    clearUserFilters();
    loadComponentList();
  };

  return (
    <Grid container flexDirection="column" height="100%" wrap="nowrap">
      <Grid item>
        <Header
          menuText="Скинути фільтри та оновити список"
          menuAction={handleReloadList}
        />
      </Grid>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        overflow="hidden auto"
        id="main-container"
        sx={{ pt: 2 }}
      >
        <Grid container flexDirection="column" flexGrow={1} maxWidth="lg">
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
                <>
                  {components.map((component) => (
                    <Grid item key={component.id}>
                      <ComponentCard component={component} />
                    </Grid>
                  ))}
                  <Grid
                    item
                    sx={{ mt: "0.5rem", mb: "1rem" }}
                    alignSelf="center"
                  >
                    <ListPages></ListPages>
                  </Grid>
                </>
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
      </Grid>
    </Grid>
  );
};

export default ComponentListPage;
