import axios, { AxiosResponse } from "axios";
import {
  CPU,
  PCComponent,
  PCComponentData,
  Spec,
} from "../models/pc_component";
import { ComponentType } from "../models/component_types";
import { Filters } from "../models/assembly";

const host = "https://buildpcserver.onrender.com"; // !
// const host = "http://192.168.0.106:5000"; // !

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
  static getComponents = async (
    componentType: ComponentType,
    userFilters: Filters,
    page: number,
    searchQuery: string
  ): Promise<PCComponent[]> => {
    const componentTypeName = "cpu"; // ! hardcode

    let response: AxiosResponse;

    try {
      response = await axios.post(
        `${host}/api/components/${componentTypeName}/${page}`,
        {
          userFilters: userFilters,
          compatibilytyFilters: {}, // !
          searchQuery: searchQuery,
        }
      );
    } catch (error) {
      throw new Error("Couldn't get data from server");
    }

    const data: ServerPCComponentData[] = response.data; // масив комплектуючих з сервера
    const componentList: PCComponent[] = data.map((component) => {
      // видаляємо характеристики, для яких не вказане значення // !
      const specs = component.specs;
      Object.keys(specs).forEach((key) => {
        if (specs[key] === null) {
          delete specs[key];
        }
      });

      // конвертуємо характеристики, отримані з API, в колекцію виду <назва: характеристика (Spec)>
      const prettySpecs: { [specName: string]: Spec<unknown> } = {};
      for (const key in specs) {
        prettySpecs[key] = new Spec(key, specs[key]);
      }

      const componentData: PCComponentData = {
        id: component["id"],
        name: component["name"],
        price: component["price"],
        link: component["link"],
        imageSmall: component["image_small"],
        imageBig: component["image_big"],
        specs: prettySpecs,
      };

      return new CPU(componentData); // ! hardcode
    });

    return componentList;
  };
}
