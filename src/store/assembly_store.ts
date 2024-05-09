import { Assembly } from "../models/assembly";
import { ComponentType } from "../models/component_types";
import { CPU, Spec } from "../models/pc_component";

import { create } from "zustand";

interface AssemblyState {
  assembly: Assembly;
}

const initialAssemblyState: AssemblyState = {
  assembly: new Assembly(),
};

// !
initialAssemblyState.assembly.addComponent(
  new CPU({
    id: 3534,
    imageBig: "",
    imageSmall: "",
    link: "",
    name: "Amd Ryzen 5 3500",
    price: 2000,
    specs: { d: new Spec("d", "d") },
  })
);
initialAssemblyState.assembly.addComponent(
  new CPU({
    id: 3534,
    imageBig: "",
    imageSmall: "",
    link: "",
    name: "Amd Ryzen 5 3500",
    price: 2000,
    specs: { d: new Spec("d", "d") },
  })
);

// никода не экспортируем сам хук с его методами доступа к хранилищу! //?
const useAssemblyStore = create<AssemblyState>(() => ({
  ...initialAssemblyState,
}));

// экспортируем пользовательский хук - не даем доступ ко всему содержимому хранилища
export const useAssembly = () =>
  useAssemblyStore((state) => state.assembly.clone());

// экспортируем метод
export const removeComponent = (id: number, componentType: ComponentType) => {
  const state = useAssemblyStore.getState();
  const newAssembly = state.assembly.clone();
  newAssembly.removeComponent(id, componentType);
  useAssemblyStore.setState({ assembly: newAssembly });
};
