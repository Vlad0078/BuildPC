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
      this.prettyValue = `${this.value}`;
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
