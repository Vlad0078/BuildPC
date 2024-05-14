import React from "react";
import CellsAccordion from "../components/CellsAccordion";
import { ComponentType } from "../models/component_types";
import { Grid } from "@mui/material";
import Header from "../components/Header";
import { resetStore } from "../store/assembly_store";

const AssemblyPage: React.FC = () => {
  const handleResetAssembly = () => {
    resetStore();
    const mainContainer = document.getElementById("main-container");
    if (mainContainer) mainContainer.scrollTop = 0;
  };

  return (
    <Grid container flexDirection="column" height="100%" wrap="nowrap">
      <Grid item>
        <Header menuText="Скинути збірку" menuAction={handleResetAssembly} />
      </Grid>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        overflow="hidden auto"
        id="main-container"
        sx={{ pt: 2 }}
      >
        <Grid container flexDirection="column" flexGrow={1} maxWidth="lg">
          <CellsAccordion
            componentType={ComponentType.MOTHERBOARD}
            summaryText="Материнська плата"
          />
          <CellsAccordion
            componentType={ComponentType.CPU}
            summaryText="Процесор"
          />
          <CellsAccordion
            componentType={ComponentType.GPU}
            summaryText="Відеокарта"
          />
          <CellsAccordion
            componentType={ComponentType.RAM}
            summaryText="Оперативна пам'ять"
          />
          <CellsAccordion
            componentType={ComponentType.SSD}
            summaryText="SSD Накопичувач"
          />
          <CellsAccordion
            componentType={ComponentType.HDD}
            summaryText="Жорсткий диск"
          />
          <CellsAccordion
            componentType={ComponentType.POWER_SUPPLY}
            summaryText="Блок живлення"
          />
          <CellsAccordion
            componentType={ComponentType.CASE}
            summaryText="Корпус"
          />
          {/* // ! <CellsAccordion summaryText="Кулер для процесора" /> */}
          {/* // ! <CellsAccordion summaryText="Корпусні вентилятори" /> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AssemblyPage;
