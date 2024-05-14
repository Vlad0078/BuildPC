import React from "react";
import CellsAccordion from "../components/CellsAccordion";
import { ComponentType } from "../models/component_types";

const AssemblyPage: React.FC = () => {
  return (
    <>
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
      <CellsAccordion componentType={ComponentType.CASE} summaryText="Корпус" />
      {/* // ! <CellsAccordion summaryText="Кулер для процесора" /> */}
      {/* // ! <CellsAccordion summaryText="Корпусні вентилятори" /> */}
    </>
  );
};

export default AssemblyPage;
