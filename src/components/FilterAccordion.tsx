import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { Spec } from "../models/pc_component";
import { ComponentType } from "../models/component_types";
import { AvailFilters } from "../models/assembly";
import FilterToggleButton from "./FilterToggleButton";

interface FilterAccordionProps {
  specName: string;
  availFilters: AvailFilters;
  componentType: ComponentType;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({
  specName,
  availFilters,
  componentType,
}) => {
  const availValues = Object.keys(availFilters[specName]);

  const specs = availValues
    .map((specValue) => new Spec(specName, specValue, componentType))
    .filter((spec) => spec != undefined);

  return (
    <Accordion
      defaultExpanded
      disableGutters // щоб заголовок не опускався при розкритті акордеона
      sx={{
        boxShadow: "none",
        backgroundColor: "inherit",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: "2em" }} />}
      >
        <Typography variant="h6">{specs[0].prettyName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1} justifyContent={"stert"}>
          {availValues.map((specValue, index) => {
            const spec = specs[index];
            return (
              <FilterToggleButton
                spec={spec}
                nubmerOfComponents={availFilters[specName][specValue]}
                key={index}
              />
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
