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
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import { loadComponentList } from "../store/assembly_store";

const SearchAndFilter: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    loadComponentList(searchQuery); // componentType буде визначено всередині функції
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFiltersOpen = () => {
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
          onChange={handleChange}
          onKeyDown={handleSearchKeyDown}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="search" onClick={handleSearch}>
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
          onClick={handleFiltersOpen}
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
