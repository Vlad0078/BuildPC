import cloneDeep from "lodash.clonedeep";
import { ComponentType } from "./component_types";
import { PCComponent, Spec, componentOfType } from "./pc_component";
import CompatibilityFilters from "./compatibilityFilters";

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
  compatibilityFilters: CompatibilityFilters;
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

      this.compatibilityFilters = assemblyData.compatibilityFilters;
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

  nextComponentId: number = 0;

  compatibilityFilters: CompatibilityFilters = new CompatibilityFilters();

  addComponent(component: PCComponent) {
    const componentType = component.componentType;
    const id = this.nextComponentId;
    this.nextComponentId += 1;
    this.components[componentType][id] = component;

    // * встановлення фільтрів сумісності
    switch (componentType) {
      case ComponentType.MOTHERBOARD: // * +mb
        {
          const socket = component.specs["socket"].value as string;
          const mb_ports = component.specs["internal_ports"].value as string;
          this.compatibilityFilters.mb_ports = mb_ports;
          this.compatibilityFilters.mb_ram_type = component.specs["ram_type"]
            .value as string;
          this.compatibilityFilters.mb_max_ram_volume = component.specs[
            "max_total_ram"
          ].value as number;

          const mb_ram_frequency = component.specs[
            "ram_frequency"
          ] as Spec<string> | null;
          this.compatibilityFilters.mb_ram_frequency = mb_ram_frequency
            ? mb_ram_frequency.value
            : null;

          this.compatibilityFilters.mb_socket = socket;
          this.compatibilityFilters.integrated_cpu =
            socket === "з вбудованним процесором";
          this.compatibilityFilters.mb_integrated_gpu_support = component.specs[
            "integrated_gpu_support"
          ].value as string;
          this.compatibilityFilters.mb_form_factor = component.specs[
            "form_factor"
          ].value as string;
          this.compatibilityFilters.mb_connectors = component.specs[
            "power_connector"
          ].value as string;

          // чи можна встановити відеокарту
          this.compatibilityFilters.mb_has_pci_e = (
            component.specs["expansion_slots"].value as string
          ).includes("PCI-E");

          // рахуємо кількість sata
          let n_sata = 0;
          const sataMatches = mb_ports.toLowerCase().match(/\d+\s[xх×]\ssata/g);
          if (sataMatches) {
            sataMatches.forEach((match) => {
              n_sata += parseInt(match);
            });
          }
          this.compatibilityFilters.n_sata = n_sata;

          // рахуємо кількість m2
          let n_m2_slots = 0;
          const m2Matches = mb_ports.toLowerCase().match(/\d+\s[xх×]\sm\.2\s/g);
          if (m2Matches) {
            m2Matches.forEach((match) => {
              n_m2_slots += parseInt(match);
            });
          }
          this.compatibilityFilters.n_m2_slots = n_m2_slots;
        }
        break;
      case ComponentType.CPU: // * +cpu
        {
          this.compatibilityFilters.cpu_ram_type = component.specs["ram_type"]
            .value as string;
          this.compatibilityFilters.cpu_socket = component.specs["socket"]
            .value as string;
          const max_total_ram = component.specs["max_total_ram"];
          this.compatibilityFilters.cpu_max_ram_volume = max_total_ram
            ? (max_total_ram.value as number)
            : null;
          this.compatibilityFilters.cpu_integrated_graphics = component.specs[
            "integrated_graphics"
          ].value as string;
        }
        break;
      case ComponentType.GPU: // * +gpu
        {
          const gpu_dimensions = component.specs[
            "dimensions"
          ] as Spec<string> | null;
          this.compatibilityFilters.gpu_dimensions = gpu_dimensions
            ? gpu_dimensions.value
            : "n/d";

          const min_psu_power = component.specs[
            "min_psu_power"
          ] as Spec<number> | null;
          this.compatibilityFilters.min_psu_power = min_psu_power
            ? min_psu_power.value
            : -1;
          this.compatibilityFilters.gpu_is_set = true;

          const gpu_connector = component.specs[
            "additional_power_connectors"
          ] as Spec<string> | null;
          this.compatibilityFilters.gpu_connector = gpu_connector
            ? gpu_connector.value
            : "відсутнє";
        }
        break;
      case ComponentType.RAM: // * +ram
        {
          this.compatibilityFilters.ram_type = component.specs["ram_type"]
            .value as string;
          this.compatibilityFilters.total_ram_volume += component.specs[
            "volume"
          ].value as number;
          this.compatibilityFilters.ram_frequency = component.specs["frequency"]
            .value as number;
        }
        break;
      case ComponentType.SSD: // * +ssd
        {
          const form_factor = component.specs["form_factor"].value as string;
          if (
            form_factor === '2.5"' ||
            form_factor === "U.2" ||
            form_factor === "U.3"
          ) {
            this.compatibilityFilters.occupied_2_5++;
            this.compatibilityFilters.occupied_sata++;
          } else this.compatibilityFilters.occupied_m2++;

          const m2_size = component.specs["m2_size"] as Spec<string> | null;
          this.compatibilityFilters.m2_size = m2_size ? m2_size.value : null;
        }
        break;
      case ComponentType.HDD: // * +hdd
        {
          this.compatibilityFilters.occupied_sata++;
          const form_factor = component.specs["form_factor"].value as string;
          if (form_factor === '2.5"') {
            this.compatibilityFilters.occupied_2_5++;
          } else {
            this.compatibilityFilters.occupied_3_5++;
          }
        }
        break;
      case ComponentType.POWER_SUPPLY: // * +psu
        {
          const psu_dimensions = component.specs[
            "dimensions"
          ] as Spec<string> | null;
          this.compatibilityFilters.psu_dimensions = psu_dimensions
            ? psu_dimensions.value
            : "n/d";

          this.compatibilityFilters.psu_power = component.specs["power"]
            .value as number;

          this.compatibilityFilters.psu_sata = component.specs[
            "n_sata_connectors"
          ].value as number;

          this.compatibilityFilters.psu_mb_connector = component.specs[
            "motherboard_connection"
          ].value as string;
          this.compatibilityFilters.psu_cpu_connector = component.specs[
            "processor_connection"
          ].value as string;

          const psu_gpu_connectors = component.specs[
            "gpu_connection"
          ] as Spec<string> | null;
          this.compatibilityFilters.psu_gpu_connectors = psu_gpu_connectors
            ? psu_gpu_connectors.value
            : "відсутнє";
        }
        break;
      case ComponentType.CASE: // * +case
        {
          const n_drive_bay_2_5 = component.specs[
            "n_drive_bay_2_5"
          ] as Spec<number> | null;
          const n_drive_bay_3_5 = component.specs[
            "n_drive_bay_3_5"
          ] as Spec<number> | null;
          const n_expansion_slots = component.specs[
            "n_expansion_slots"
          ] as Spec<number> | null;
          this.compatibilityFilters.n_drive_bay_2_5 = n_drive_bay_2_5
            ? n_drive_bay_2_5.value
            : 0;
          this.compatibilityFilters.n_drive_bay_3_5 = n_drive_bay_3_5
            ? n_drive_bay_3_5.value
            : 0;
          this.compatibilityFilters.n_expansion_slots = n_expansion_slots
            ? n_expansion_slots.value
            : 0;

          this.compatibilityFilters.case_supported_motherboards = component
            .specs["supported_motherboards"].value as string;

          const max_gpu_length = component.specs[
            "max_gpu_length"
          ] as Spec<number> | null;
          this.compatibilityFilters.max_gpu_length = max_gpu_length
            ? max_gpu_length.value
            : 0;

          const max_psu_length = component.specs[
            "max_psu_length"
          ] as Spec<number> | null;
          this.compatibilityFilters.max_psu_length = max_psu_length
            ? max_psu_length.value
            : 0;
        }
        break;
      default:
        break;
    }
  }

  /**
   * Видаляє комплектуюче, яке знаходиться за вказаним id в components
   * @param id - id комплектуючого в межах збірки
   * @param componentType - тип комплектуючого
   */
  removeComponent(id: number, component: PCComponent) {
    const componentType = component.componentType;
    delete this.components[componentType][id];

    // * скидання фільтрів сумісності
    switch (componentType) {
      case ComponentType.MOTHERBOARD: // * -mb
        {
          this.compatibilityFilters.mb_ports = null;
          this.compatibilityFilters.mb_ram_frequency = null;
          this.compatibilityFilters.mb_ram_type = null;
          this.compatibilityFilters.mb_max_ram_volume = null;
          this.compatibilityFilters.mb_socket = null;
          this.compatibilityFilters.n_sata = null;
          this.compatibilityFilters.n_m2_slots = 1;
          this.compatibilityFilters.integrated_cpu = false;
          this.compatibilityFilters.mb_integrated_gpu_support = null;
          this.compatibilityFilters.mb_form_factor = null;
          this.compatibilityFilters.mb_has_pci_e = true;
          this.compatibilityFilters.mb_connectors = null;
        }
        break;
      case ComponentType.CPU: // * -cpu
        this.compatibilityFilters.cpu_max_ram_volume = null;
        this.compatibilityFilters.cpu_ram_type = null;
        this.compatibilityFilters.cpu_socket = null;
        this.compatibilityFilters.cpu_integrated_graphics = null;
        break;
      case ComponentType.GPU: // * -gpu
        this.compatibilityFilters.gpu_dimensions = null;
        this.compatibilityFilters.min_psu_power = null;
        this.compatibilityFilters.gpu_is_set = false;
        this.compatibilityFilters.gpu_connector = null;
        break;
      case ComponentType.RAM: // * -ram
        {
          let total_ram_volume = 0;
          Object.values(this.components[componentType]).forEach(
            (ram) => (total_ram_volume += ram.specs["volume"].value as number)
          );
          this.compatibilityFilters.total_ram_volume = total_ram_volume;
          this.compatibilityFilters.ram_type = null;
          this.compatibilityFilters.ram_frequency = null;
        }
        break;
      case ComponentType.SSD: // * -ssd
        {
          const form_factor = component.specs["form_factor"].value as string;
          if (
            form_factor === '2.5"' ||
            form_factor === "U.2" ||
            form_factor === "U.3"
          ) {
            this.compatibilityFilters.occupied_2_5--;
            this.compatibilityFilters.occupied_sata--;
          } else this.compatibilityFilters.occupied_m2--;

          this.compatibilityFilters.m2_size = null;
        }
        break;
      case ComponentType.HDD: // * -hdd
        {
          this.compatibilityFilters.occupied_sata--;
          const form_factor = component.specs["form_factor"].value as string;
          if (form_factor === '2.5"') {
            this.compatibilityFilters.occupied_2_5--;
          } else {
            this.compatibilityFilters.occupied_3_5--;
          }
        }
        break;
      case ComponentType.POWER_SUPPLY: // * -psu
        this.compatibilityFilters.psu_dimensions = null;
        this.compatibilityFilters.psu_power = null;
        this.compatibilityFilters.psu_sata = null;
        this.compatibilityFilters.psu_mb_connector = null;
        this.compatibilityFilters.psu_cpu_connector = null;
        this.compatibilityFilters.psu_gpu_connectors = null;
        break;
      case ComponentType.CASE: // * -case
        {
          this.compatibilityFilters.n_drive_bay_2_5 = 4;
          this.compatibilityFilters.n_drive_bay_3_5 = 4;
          this.compatibilityFilters.n_expansion_slots = null;
          this.compatibilityFilters.case_supported_motherboards = null;
          this.compatibilityFilters.max_gpu_length = null;
          this.compatibilityFilters.max_psu_length = null;
        }
        break;
      default:
        break;
    }
  }

  clone() {
    return new Assembly(this);
  }
}
