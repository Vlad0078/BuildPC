import React, { useEffect, useState } from "react";
import { Spec } from "../models/spec";
import {
  checkIfFilterActive,
  toggleUserFilter,
  useUserFilters,
} from "../store/assembly_store";
import { Grid, Button } from "@mui/material";

interface FilterToggleButtonProps {
  spec: Spec<string>;
  nubmerOfComponents: number;
}

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({
  spec,
  nubmerOfComponents,
}) => {
  // callback, щоб ф-ція виконалась лише 1 раз при першому рендері
  // зберігаємо в локальному стані, щоб не перевіряти щоразу чи містять користувацькі фільтри потрібне значення
  const [isActive, setActive] = useState(() => checkIfFilterActive(spec));

  const userFilters = useUserFilters();

  useEffect(() => {
    if (Object.keys(userFilters).length === 0) setActive(false);
  }, [userFilters]);

  const handleClick = () => {
    setActive((state) => !state);
    toggleUserFilter(spec);
  };

  return (
    <Grid item flexGrow={1}>
      <Button
        fullWidth
        variant={isActive ? "contained" : "outlined"}
        sx={{ borderRadius: "30px" }}
        onClick={handleClick}
      >
        {/* значення фільтра (к-ть комплектуючих з таким значенням характеристики) */}
        {spec.prettyValue} ({nubmerOfComponents})
      </Button>
    </Grid>
  );
};

export default FilterToggleButton;
