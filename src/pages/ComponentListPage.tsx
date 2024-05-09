import React, { useEffect } from "react";
import { useComponentList } from "../store/component_list_store";
import { ListLoadingState as LoadingState } from "../store/component_list_store";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import ComponentCard from "../components/ComponentCard";

const ComponentListPage: React.FC = () => {
  const navigate = useNavigate();

  const { components, componentType, loadingState } = useComponentList();

  useEffect(() => {
    // якщо сторінку відкрили через рядок браузера і componentType не вказаний - повертаємо null і переходимо на сторінку збірки
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
            components.length !== 0)) && (
          <Grid item>
            <OutlinedInput
              fullWidth
              placeholder="Пошук за назвою"
              type="search"
              sx={{ marginBottom: 1 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
        )
      }
      {loadingState === LoadingState.LOADING ? (
        <>
          <Grid
            container
            flexDirection="column"
            alignContent="center"
            justifyContent="center"
            flexGrow={1}
          >
            <CircularProgress />
          </Grid>
        </>
      ) : LoadingState.LOADED ? (
        components.map((component) => (
          <Grid item key={component.id}>
            <ComponentCard component={component} />
          </Grid>
        ))
      ) : null}{" "}
      // !
    </Grid>
  );
};

export default ComponentListPage;
