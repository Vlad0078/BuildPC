import cloneDeep from "lodash.clonedeep";
import { ComponentType } from "./component_types";
import { PCComponent, componentOfType } from "./pc_component";

/**
 * ключ - назва характеристики
 *
 * значення - масив значень для фільтрації за характеристикою
 */
export type Filters = { [specName: string]: unknown[] };

export type AvailFilters = {
  [specName: string]: { [specValue: string]: number };
};

/**
 * ключ - id комплектуючщого у збірці
 *
 * значення - комплектуюче
 */

interface AssemblyData {
  components: Record<ComponentType, { [id: number]: PCComponent }>;
  userFilters: Record<ComponentType, Filters>;
  nextComponentId: number;
}

export class Assembly implements AssemblyData {
  constructor(assemblyData?: AssemblyData) {
    if (assemblyData) {
      assemblyData = cloneDeep(assemblyData);
      this.components = assemblyData.components;
      // перетворюємо комплектуючі
      for (const typeKey in this.components) {
        const componentType = parseInt(typeKey) as ComponentType;
        const componentsOfType = this.components[componentType];
        for (const id in componentsOfType) {
          const component = componentsOfType[id];
          if (!(component instanceof PCComponent)) {
            this.components[componentType][id] = componentOfType(
              component,
              componentType
            );
          }
        }
      }

      this.userFilters = assemblyData.userFilters;
      this.nextComponentId = assemblyData.nextComponentId;
    }
  }

  components: Record<ComponentType, { [id: number]: PCComponent }> = {
    [ComponentType.MOTHERBOARD]: {},
    [ComponentType.CPU]: {},
    [ComponentType.GPU]: {},
    [ComponentType.RAM]: {},
    [ComponentType.SSD]: {},
    [ComponentType.HDD]: {},
    [ComponentType.POWER_SUPPLY]: {},
    [ComponentType.CASE]: {},
    // ! [ComponentType.CPU_COOLER]: [],
    // ! [ComponentType.FAN]: [],
  };

  // ! deprecated
  userFilters: Record<ComponentType, Filters> = {
    [ComponentType.MOTHERBOARD]: {},
    [ComponentType.CPU]: {},
    [ComponentType.GPU]: {},
    [ComponentType.RAM]: {},
    [ComponentType.SSD]: {},
    [ComponentType.HDD]: {},
    [ComponentType.POWER_SUPPLY]: {},
    [ComponentType.CASE]: {},
    // ! [ComponentType.CPU_COOLER]: {},
    // ! [ComponentType.FAN]: {},
  };

  nextComponentId: number = 0;

  addComponent(component: PCComponent) {
    const componentType = component.componentType;
    const id = this.nextComponentId;
    this.nextComponentId += 1;
    this.components[componentType][id] = component;
  }

  /**
   * Видаляє комплектуюче, яке знаходиться за вказаним id в components
   * @param id - id комплектуючого в межах збірки
   * @param componentType - тип комплектуючого
   */
  removeComponent(id: number, componentType: ComponentType) {
    delete this.components[componentType][id];
  }

  clone() {
    return new Assembly(this);
  }
}
