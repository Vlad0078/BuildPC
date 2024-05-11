import cloneDeep from "lodash.clonedeep";
import { specNames } from "../config/spec_names";
import { ComponentType } from "./component_types";

export class Spec<T> {
  constructor(
    public name: string,
    public value: T,
    componentType: ComponentType
  ) {
    this.prettyName = name;
    this.prettyValue = String(value);
    componentType && this.#prettify(componentType);
  }

  prettyName: string;
  prettyValue: string;

  #prettify = (componentType: ComponentType) => {
    // отримуємо назви характеристик для переданого типу комплектуючого та розділяємо їх за категоріями
    const stringSpecNames = specNames[componentType]["string_spec_names"] || {};
    const intSpecNames = specNames[componentType]["int_spec_names"] || {};
    const floatSpecNames = specNames[componentType]["float_spec_names"] || {};
    const boolSpecNames = specNames[componentType]["bool_spec_names"] || {};
    const freqSpecNames = specNames[componentType]["freq_spec_names"] || {};
    const otherSpecNames = specNames[componentType]["other_spec_names"] || {};

    // встановлюємо значення для prettyName та prettyValue залежно від категорії, до якої належить name характеристики
    let parsedValue;
    if (this.name in stringSpecNames) {
      this.prettyName = stringSpecNames[this.name];
      this.prettyValue = `${this.value}`.replace(/[\n\t]/g, ""); // !
    } else if (this.name in intSpecNames) {
      this.prettyName = intSpecNames[this.name];
      switch (this.name) {
        case "max_gpu_length":
          this.prettyValue = `до ${this.value} мм`;
          break;
        case "max_cpu_cooler_height":
        case "max_psu_length":
          this.prettyValue = `${this.value} мм`;
          break;
        case "volume":
        case "memory":
        case "max_total_ram":
          parsedValue = parseInt(`${this.value}`);
          this.prettyValue =
            parsedValue >= 1000
              ? `${parsedValue / 1000} Тб`
              : `${this.value} Гб`;
          break;
        case "memory_bus_width":
          this.prettyValue = `${this.value} Біт`;
          break;
        case "buffer_size":
          this.prettyValue = `${this.value} Мб`;
          break;
        case "data_speed":
          this.prettyValue = `${this.value} Мб/с`;
          break;
        case "noise_level":
          this.prettyValue = `${this.value} дБ`;
          break;
        case "power":
        case "psu_power":
        case "techprocess":
          this.prettyValue = `${this.value} нм`;
          break;
        case "max_temperature":
          this.prettyValue = `${this.value} °C`;
          break;
        case "max_tdp":
        case "power_consumption":
        case "max_power_consumption":
        case "min_psu_power":
          this.prettyValue = `${this.value} Вт`;
          break;
        case "lan_speed":
          parsedValue = parseInt(`${this.value}`);
          this.prettyValue =
            parsedValue >= 1000
              ? `${parsedValue / 1000} Гбіт`
              : `${this.value} Мбіт`;
          break;
        default:
          this.prettyValue = `${this.value}`;
      }
    } else if (this.name in floatSpecNames) {
      switch (this.name) {
        case "max_memory_bandwidth":
          this.prettyValue = `${this.value} Гб/с`;
          break;
        case "weight":
          this.prettyValue = `${this.value} кг`;
          break;
        default:
          this.prettyName = floatSpecNames[this.name];
          this.prettyValue = `${this.value}`;
      }
    } else if (this.name in boolSpecNames) {
      this.prettyName = boolSpecNames[this.name];
      this.prettyValue = this.value == 1 ? "так" : "немає";
    } else if (this.name in freqSpecNames) {
      this.prettyName = freqSpecNames[this.name];
      this.prettyValue = `${this.value} МГц`;
    } else if (this.name in otherSpecNames) {
      this.prettyName = otherSpecNames[this.name];
      switch (this.name) {
        case "has_cooler":
          this.prettyValue = this.value == 1 ? "кулер у комплекті" : "немає";
          break;
        case "has_psu":
          this.prettyValue = this.value == 1 ? "з блоком живлення" : "немає";
          break;
        default:
          this.prettyValue = `${this.value}`;
      }
    } else {
      this.prettyName = "undefined spec name";
      this.prettyValue = "undefined spec value";
    }
  };
}

export interface PCComponentData {
  id: number;
  name: string;
  price: number;
  link: string;
  imageSmall: string;
  imageBig: string;
  specs: Record<string, Spec<unknown>>;
}

/// Абстрактний клас, який представляє комп'ютерне комплектуюче
export abstract class PCComponent implements PCComponentData {
  constructor(componentData: PCComponentData) {
    // робимо глибоку копію, щоб скопіювати specs сам об'єкт specs, а не посилання на нього
    componentData = cloneDeep(componentData);
    this.id = componentData.id;
    this.name = componentData.name;
    this.price = componentData.price;
    this.link = componentData.link;
    this.imageSmall = componentData.imageSmall;
    this.imageBig = componentData.imageBig;
    this.specs = componentData.specs;
  }

  id: number;
  name: string;
  price: number;
  link: string;
  imageSmall: string;
  imageBig: string;
  specs: { [specName: string]: Spec<unknown> };

  abstract get componentType(): ComponentType;
  abstract clone(): PCComponent;
}

export class Motherboard extends PCComponent {
  get componentType() {
    return ComponentType.MOTHERBOARD;
  }
  clone() {
    return new Motherboard(this);
  }
}
export class CPU extends PCComponent {
  get componentType() {
    return ComponentType.CPU;
  }
  clone() {
    return new CPU(this);
  }
}
export class GPU extends PCComponent {
  get componentType() {
    return ComponentType.GPU;
  }
  clone() {
    return new GPU(this);
  }
}
export class RAM extends PCComponent {
  get componentType() {
    return ComponentType.RAM;
  }
  clone() {
    return new RAM(this);
  }
}
export class SSD extends PCComponent {
  get componentType() {
    return ComponentType.SSD;
  }
  clone() {
    return new SSD(this);
  }
}
export class HDD extends PCComponent {
  get componentType() {
    return ComponentType.HDD;
  }
  clone() {
    return new HDD(this);
  }
}
export class PowerSupply extends PCComponent {
  get componentType() {
    return ComponentType.POWER_SUPPLY;
  }
  clone() {
    return new PowerSupply(this);
  }
}
export class Case extends PCComponent {
  get componentType() {
    return ComponentType.CASE;
  }
  clone() {
    return new Case(this);
  }
}
// ! export class CPUCooler extends PCComponent {}
// ! export class Fan extends PCComponent {}

export const componentOfType = (
  componentData: PCComponentData,
  componentType: ComponentType
): PCComponent => {
  switch (componentType) {
    case ComponentType.MOTHERBOARD:
      return new Motherboard(componentData);
    case ComponentType.CPU:
      return new CPU(componentData);
    case ComponentType.GPU:
      return new GPU(componentData);
    case ComponentType.RAM:
      return new RAM(componentData);
    case ComponentType.SSD:
      return new SSD(componentData);
    case ComponentType.HDD:
      return new HDD(componentData);
    case ComponentType.POWER_SUPPLY:
      return new PowerSupply(componentData);
    case ComponentType.CASE:
      return new Case(componentData);
    default:
      throw new Error("wrong component type provided");
  }
};
