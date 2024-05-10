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
    if (this.name in stringSpecNames) {
      this.prettyName = stringSpecNames[this.name];
      this.prettyValue = `${this.value}`.replace(/[\n\t]/g, ""); // !
    } else if (this.name in intSpecNames) {
      this.prettyName = intSpecNames[this.name];
      switch (this.name) {
        case "psu_power":
          this.prettyValue = `${this.value} Вт`;
          break;
        case "volume":
          this.prettyValue = `${this.value} Гб`;
          break;
        default:
          this.prettyValue = `${this.value}`;
      }
    } else if (this.name in floatSpecNames) {
      this.prettyName = floatSpecNames[this.name];
      this.prettyValue = `${this.value}`;
    } else if (this.name in boolSpecNames) {
      this.prettyName = boolSpecNames[this.name];
      this.prettyValue = this.value == 1 ? "так" : "немає";
    } else if (this.name in freqSpecNames) {
      this.prettyName = freqSpecNames[this.name];
      this.prettyValue = `${this.value} МГц`;
    } else if (this.name in otherSpecNames) {
      this.prettyName = otherSpecNames[this.name];
      switch (this.name) {
        case "lan_speed":
          this.prettyValue = `${this.value} Мбіт`;
          break;
        case "has_cooler":
          this.prettyValue = this.value == 1 ? "кулер у комплекті" : "немає";
          break;
        case "volume":
          this.prettyValue = `${this.value} Мб`;
          break;
        case "power_consumption":
          this.prettyValue = `${this.value} Вт`;
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
