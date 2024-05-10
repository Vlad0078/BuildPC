import {
  Grid,
  OutlinedInput,
  InputAdornment,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React, { useEffect, useState } from "react";
import FilterDrawer from "./FilterDrawer";

const SearchAndFilter: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFiltersButton = () => {
    setDrawerOpen(true);
  };

  useEffect(() => {
    // визначаємо ширину вікна
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      padding={windowWidth >= 1216 ? 0 : 1}
      paddingBottom={1}
      paddingTop={0}
    >
      <Grid item flexGrow={1}>
        <OutlinedInput
          fullWidth
          placeholder="Пошук за назвою"
          type="search"
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="search">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Grid>
      <Grid item>
        <FormControl fullWidth>
          <InputLabel id="sort-select-label">Сортування</InputLabel>
          <Select
            labelId="sort-select-label"
            defaultValue=""
            label="Сортування"
            sx={{ width: "12.5rem" }}
          >
            <MenuItem value="prise-asc">За зростанням ціни</MenuItem>
            <MenuItem value="prise-desc">За спаданням ціни</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Button
          // color="secondary"
          variant="outlined"
          endIcon={<FilterAltOutlinedIcon />}
          sx={{ height: "100%" }}
          onClick={handleFiltersButton}
        >
          Фільтрація
        </Button>
        <FilterDrawer
          drawerOpen={drawerOpen}
          closeDrawer={() => setDrawerOpen(false)}
        />
      </Grid>
    </Grid>
  );
};

export default SearchAndFilter;
