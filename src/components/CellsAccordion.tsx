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

  const assembly = useAssembly();
  const components = assembly.components[componentType];
  const compatibilityFilters = assembly.compatibilityFilters;
  const componentList = Object.entries(components); // [id: component]

  const handleAdd = () => {
    setComponentListType(componentType);
    navigate("/component_list");
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;
    loadComponentList();
  };

  // * визначаємо к-ть комплектуючих цього типу
  let n_slots = 1; // не стан, бо сторінка в будь-якому випадку перерендериться // !

  switch (componentType) {
    case ComponentType.CPU: // * cpu
      if (compatibilityFilters.integrated_cpu) n_slots = 0;
      break;
    case ComponentType.GPU: // * gpu
      if (!compatibilityFilters.mb_has_pci_e) n_slots = 0;
      break;
    case ComponentType.RAM: // * ram
      {
        const total_ram_volume = compatibilityFilters.total_ram_volume;
        const mb_max_ram_volume = compatibilityFilters.mb_max_ram_volume;
        const cpu_max_ram_volume = compatibilityFilters.cpu_max_ram_volume;
        if (
          (mb_max_ram_volume !== null &&
            total_ram_volume >= mb_max_ram_volume) ||
          (cpu_max_ram_volume !== null &&
            total_ram_volume >= cpu_max_ram_volume)
        ) {
          n_slots = componentList.length;
        } else {
          n_slots = compatibilityFilters.n_ram_slots;
        }
      }
      break;

    case ComponentType.SSD: // *ssd
      {
        const n_drive_bay_2_5 = compatibilityFilters.n_drive_bay_2_5;
        const n_m2_slots = compatibilityFilters.n_m2_slots;

        let n_sata = compatibilityFilters.n_sata;
        const psu_sata = compatibilityFilters.psu_sata;
        if (n_sata === null) {
          n_sata = psu_sata;
        } else if (typeof psu_sata === "number") {
          n_sata = Math.min(n_sata, psu_sata);
        }

        const occupied_sata = compatibilityFilters.occupied_sata;
        const n_sata_left = n_sata ? n_sata - occupied_sata : null;
        const n_m2_left =
          compatibilityFilters.n_m2_slots - compatibilityFilters.occupied_m2;
        n_slots =
          n_sata_left === null || n_sata_left + n_m2_left > 0
            ? n_drive_bay_2_5 + n_m2_slots
            : componentList.length;
      }
      break;

    case ComponentType.HDD:
      {
        const n_drive_bay_3_5 = compatibilityFilters.n_drive_bay_3_5;

        let n_sata = compatibilityFilters.n_sata;
        const psu_sata = compatibilityFilters.psu_sata;
        if (n_sata === null) {
          n_sata = psu_sata;
        } else if (typeof psu_sata === "number") {
          n_sata = Math.min(n_sata, psu_sata);
        }

        const occupied_sata = compatibilityFilters.occupied_sata;
        const n_sata_left = n_sata ? n_sata - occupied_sata : null;

        console.log(n_sata_left);

        n_slots =
          n_sata_left === null || n_sata_left > 0
            ? n_drive_bay_3_5
            : componentList.length;
      }
      break;

    default:
      break;
  }

  if (n_slots === 0) return null;

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
              {componentList.length < n_slots && (
                <Button
                  size="large"
                  color="primary"
                  fullWidth
                  sx={{ fontSize: "1.5rem" }}
                  onClick={handleAdd}
                >
                  {componentList.length ? "Додати" : "Обрати"}
                </Button>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Divider />
    </>
  );
};

export default CellsAccordion;
