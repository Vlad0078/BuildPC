import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { ComponentType } from "../models/component_types";
import ComponentCard from "./ComponentCard";
import { useNavigate } from "react-router-dom";
import { setComponentListType, useAssembly } from "../store/assembly_store";
import { loadComponentList } from "../store/assembly_store";

interface CellsAccordionProps {
  summaryText: string;
  componentType: ComponentType;
}

const CellsAccordion: React.FC<CellsAccordionProps> = ({
  summaryText,
  componentType,
}) => {
  const navigate = useNavigate();

  const components = useAssembly().components[componentType];
  const componentList = Object.entries(components); // [id: component]

  const handleAdd = () => {
    setComponentListType(componentType);
    navigate("/component_list");
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;
    loadComponentList();
  };

  return (
    <>
      <Accordion
        defaultExpanded
        sx={{
          boxShadow: "none",
          backgroundColor: "inherit",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ fontSize: "2em" }} />}
        >
          <Typography variant="h4">{summaryText}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} flexDirection={"column"}>
            {componentList.map((component) => (
              <Grid item key={component[0]}>
                <ComponentCard
                  componentId={parseInt(component[0])}
                  component={component[1]}
                  isAssemblyComponent
                />
              </Grid>
            ))}
            <Grid item>
              <Button
                size="large"
                color="primary"
                fullWidth
                sx={{ fontSize: "1.5rem" }}
                onClick={handleAdd}
              >
                {componentList.length ? "Додати" : "Обрати"}
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Divider />
    </>
  );
};

export default CellsAccordion;
