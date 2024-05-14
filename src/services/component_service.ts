import axios, { AxiosResponse } from "axios";
import {
  PCComponent,
  PCComponentData,
} from "../models/pc_component";
import { Spec } from "../models/spec";
import { ComponentType } from "../models/component_types";
import { AvailFilters, Filters } from "../models/assembly";
import CompatibilityFilters from "../models/compatibilityFilters";

// const host = "https://buildpcserver.onrender.com"; // !
const host = "http://192.168.0.106:5000"; // !

const categoryNames: Record<ComponentType, string> = {
  [ComponentType.MOTHERBOARD]: "motherboard",
  [ComponentType.CPU]: "cpu",
  [ComponentType.GPU]: "gpu",
  [ComponentType.RAM]: "ram",
  [ComponentType.SSD]: "ssd",
  [ComponentType.HDD]: "hdd",
  [ComponentType.POWER_SUPPLY]: "power_supply",
  [ComponentType.CASE]: "case",
};

interface ServerPCComponentData {
  id: number;
  name: string;
  price: number;
  link: string;
  image_small: string;
  image_big: string;
  specs: Record<string, { [specName: string]: unknown }>;
}

export default class ComponentService {
  static fetchComponents = async (
    componentType: ComponentType,
    userFilters: Filters,
    compatibilityFilters: CompatibilityFilters,
    page: number,
    searchQuery: string
  ): Promise<PCComponent[]> => {
    const categoryName = categoryNames[componentType];
    let response: AxiosResponse;

    try {
      response = await axios.post(
        `${host}/api/components/${categoryName}/${page}`,
        {
          userFilters,
          compatibilityFilters, // *
          searchQuery,
        }
      );
    } catch (error) {
      throw new Error("Couldn't get data from server");
    }

    const data: ServerPCComponentData[] = response.data; // масив комплектуючих з сервера
    const componentList: PCComponent[] = data.map((component) => {
      // видаляємо характеристики, для яких не вказане значення
      const specs = component.specs;
      Object.keys(specs).forEach((key) => {
        if (specs[key] === null) {
          delete specs[key];
        }
      });

      // конвертуємо характеристики, отримані з API, в колекцію виду <назва: характеристика (Spec)>
      const prettySpecs: { [specName: string]: Spec<unknown> } = {};
      for (const key in specs) {
        prettySpecs[key] = new Spec(key, specs[key], componentType);
      }

      const componentData: PCComponentData = {
        id: component["id"],
        name: component["name"],
        price: component["price"],
        link: component["link"],
        imageSmall: component["image_small"],
        imageBig: component["image_big"],
				specs: prettySpecs,
				componentType,
      };

      return new PCComponent(componentData);
    });

    return componentList;
  };

  static fetchAvailFilters = async (
    componentType: ComponentType,
    userFilters: Filters,
    compatibilityFilters: CompatibilityFilters,
    searchQuery: string
  ): Promise<AvailFilters> => {
    const categoryName = categoryNames[componentType];
    let response: AxiosResponse;

    // отримуємо дані з сервера
    try {
      response = await axios.post(`${host}/api/filters_avail/${categoryName}`, {
        userFilters,
        compatibilityFilters,
        searchQuery,
      });
    } catch (error) {
      throw new Error("Couldn't get data from server");
    }

    const availFilters: AvailFilters = response.data;
    return availFilters;
  };

  static countPages = async (
    componentType: ComponentType,
    userFilters: Filters,
    compatibilityFilters: CompatibilityFilters,
    searchQuery: string
  ): Promise<number> => {
    const categoryName = categoryNames[componentType];
    let response: AxiosResponse;

    // отримуємо дані з сервера
    try {
      response = await axios.post(`${host}/api/pages/${categoryName}`, {
        userFilters,
        compatibilityFilters,
        searchQuery,
      });
    } catch (error) {
      throw new Error("Couldn't get data from server");
    }

    const pages: number = response.data;
    return pages;
  };
}
