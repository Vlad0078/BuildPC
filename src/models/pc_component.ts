import cloneDeep from "lodash.clonedeep";
import { ComponentType } from "./component_types";
import { Spec } from "./spec";

export interface PCComponentData {
  id: number;
  name: string;
  price: number;
  link: string;
  imageSmall: string;
  imageBig: string;
  specs: Record<string, Spec<unknown>>;
  componentType: ComponentType;
}

/// клас, який представляє комп'ютерне комплектуюче
export class PCComponent implements PCComponentData {
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
    this.componentType = componentData.componentType;
  }

  id: number;
  name: string;
  price: number;
  link: string;
  imageSmall: string;
  imageBig: string;
  specs: { [specName: string]: Spec<unknown> };
  componentType: ComponentType;
}
