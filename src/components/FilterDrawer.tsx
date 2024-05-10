import { Button, Drawer, Grid } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import React from "react";
import {
  clearUserFilters,
  loadComponentList,
  useAvailFilters,
  useListComponentType,
} from "../store/assembly_store";
import FilterAccordion from "./FilterAccordion";

interface FilterDrawerProps {
  drawerOpen: boolean;
  closeDrawer: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  drawerOpen,
  closeDrawer,
}) => {
  const availFilters = useAvailFilters();
  const componentType = useListComponentType();
  if (!componentType) throw new Error("component type not specified");

  const handleApply = () => {
    loadComponentList();
    closeDrawer();
  };

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
      <div
        style={{ padding: "0 1rem", display: "flex", flexDirection: "column" }}
      >
        <Button
          variant="text"
          size="large"
          color="primary"
          startIcon={<CheckRoundedIcon />}
          sx={{ marginTop: 1 }}
          onClick={handleApply}
        >
          Застосувати фільтри
        </Button>
        <Button
          variant="text"
          size="large"
          color="error"
          startIcon={<ClearRoundedIcon />}
          sx={{ marginBottom: 1 }}
          onClick={clearUserFilters}
        >
          Очистити фільтри
        </Button>
        <Grid container flexDirection="column" sx={{ maxWidth: "800px" }}>
          <Grid container flexDirection="column" spacing={4}>
            {Object.keys(availFilters).map((specName, index) => (
              <Grid item key={index}>
                <FilterAccordion
                  specName={specName}
                  availFilters={availFilters}
                  componentType={componentType}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
