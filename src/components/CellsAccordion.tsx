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
import AssemblyCell from "./AssemblyCell";
import { useAssembly } from "../store/assembly_store";

interface CellsAccordionProps {
  summaryText: string;
  componentType: ComponentType;
}

const CellsAccordion: React.FC<CellsAccordionProps> = ({
  summaryText,
  componentType,
}) => {
  const components = useAssembly().components[componentType];
  const componentList = Object.entries(components); // [id: component]

  return (
    <>
      <Accordion
        defaultExpanded
        sx={{
          boxShadow: "none",
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
              <Grid key={component[0]} item>
                <AssemblyCell
                  componentId={parseInt(component[0])}
                  component={component[1]}
                />
              </Grid>
            ))}

            {/* {!componentList.length && (
              <Grid item>
                <Typography
                  variant="h4"
                  component="div"
                  textAlign="center"
                  color="text.secondary"
                  sx={{ fontSize: "1.5rem" }}
                >
                  Не обрано
                </Typography>
              </Grid>
            )} */}

            <Grid item>
              <Button
                size="large"
                color="primary"
                fullWidth
                sx={{ fontSize: "1.5rem" }}
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
