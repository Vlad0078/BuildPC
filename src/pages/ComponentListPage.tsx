import React, { useEffect } from "react";
import {
  ListLoadingState as LoadingState,
  useComponentList,
  useListComponentType,
  useListLoadingState,
} from "../store/assembly_store";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Grid } from "@mui/material";
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
    !componentType && navigate("/");
  }, [componentType, navigate]);

  if (!componentType) {
    return null;
  }
  return (
    <Grid container flexDirection="column" flexGrow={1}>
      {
        // поле пошуку лише якщо комплектуючі вже було завантажено
        (loadingState === LoadingState.LOADED ||
          (loadingState === LoadingState.LOADING &&
            components.length !== 0)) && <SearchAndFilter />
      }
      {
        loadingState === LoadingState.LOADING ? (
          <>
            <Grid
              container
              flexDirection="column"
              alignContent="center"
              justifyContent="center"
              flexGrow={1}
            >
              <CircularProgress size="8rem" />
            </Grid>
          </>
        ) : LoadingState.LOADED ? (
          <Grid container flexDirection="column" spacing={1}>
            {components.map((component) => (
              <Grid item key={component.id}>
                <ComponentCard component={component} />
              </Grid>
            ))}
          </Grid>
        ) : null // !
      }
    </Grid>
  );
};

export default ComponentListPage;
