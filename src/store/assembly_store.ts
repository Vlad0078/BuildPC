import { Assembly, AvailFilters, Filters } from "../models/assembly";
import { ComponentType } from "../models/component_types";
import { CPU, PCComponent, Spec } from "../models/pc_component";

import ComponentService from "../services/component_service";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export enum ListLoadingState {
  INITIAL,
  LOADING,
  LOADED,
  FAILED,
}

interface ComponentListState {
  loadingState: ListLoadingState;
  componentType: ComponentType | undefined;
  components: PCComponent[];
  availFilters: AvailFilters;
}

interface AssemblyState {
  assembly: Assembly;
  userFilters: Record<ComponentType, Filters>;
  loadedComponents: ComponentListState;
}

const initialAssemblyState: AssemblyState = {
  assembly: new Assembly(),
  userFilters: {
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
  },
  loadedComponents: {
    loadingState: ListLoadingState.INITIAL,
    componentType: undefined,
    components: [],
    availFilters: {},
  },
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
    specs: { d: new Spec("d", "d", ComponentType.CPU) },
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
    specs: { d: new Spec("d", "d", ComponentType.CPU) },
  })
);

// !* никода не экспортируем сам хук с его методами доступа к хранилищу! //?
const useAssemblyStore = createWithEqualityFn<AssemblyState>(
  () => ({
    ...initialAssemblyState,
  }),
  shallow
);

// !* экспортируем пользовательский хук - не даем доступ ко всему содержимому хранилища
export const useAssembly = () =>
  useAssemblyStore((state) => state.assembly.clone());

export const useComponentList = () =>
  useAssemblyStore((state) => state.loadedComponents.components).map(
    (component) => component.clone()
  );
export const useListLoadingState = () =>
  useAssemblyStore((state) => state.loadedComponents.loadingState);

export const useListComponentType = () =>
  useAssemblyStore((state) => state.loadedComponents.componentType);

export const useAvailFilters = () => {
  const availFilters = useAssemblyStore(
    (state) => state.loadedComponents.availFilters
  );
  return availFilters;
};

export const useUserFilters = () => {
  const userFilters = useAssemblyStore((state) => state.userFilters);
  const componentType = useAssemblyStore(
    (state) => state.loadedComponents.componentType
  );
  if (!componentType) throw new Error("component type not specified");
  return userFilters[componentType];
};

export const useCheckFilterActive = (spec: Spec<string>): boolean => {
  const componentType = useAssemblyStore(
    (state) => state.loadedComponents.componentType
  );
  if (!componentType) throw new Error("component type not specified");
  const userFilters = useAssemblyStore((state) => state.userFilters)[
    componentType
  ];

  return (
    spec.name in userFilters && userFilters[spec.name].includes(spec.value)
  );
};

// * методи для роботи зі збіркою
export const removeComponent = (id: number, componentType: ComponentType) => {
  const state = useAssemblyStore.getState();
  const newAssembly = state.assembly.clone();
  newAssembly.removeComponent(id, componentType);
  useAssemblyStore.setState({ assembly: newAssembly });
};

// повертає новий стан фільтру (true - активний, false - ні)
export const toggleUserFilter = (spec: Spec<unknown>): boolean => {
  const state = useAssemblyStore.getState();
  const componentType = state.loadedComponents.componentType;
  if (!componentType) throw new Error("component type not specified");
  const userFilters = state.userFilters;

  let filterIsActive: boolean;

  if (spec.name in userFilters[componentType]) {
    // фільтри для цієї характеристики вже встановлено
    const specFilter = userFilters[componentType][spec.name];
    // індекс значення в масиві
    const valueIndex = specFilter.indexOf(spec.value);

    if (valueIndex == -1) {
      // в масиві значень фільтру немає цього значення - додаємо його
      specFilter.push(spec.value);
      filterIsActive = true;
    } else {
      // в масиві значень фільтру є це значення - видаляємо його
      specFilter.splice(valueIndex, 1);
      filterIsActive = false;
    }
  } else {
    // фільтри для цієї характеристики ще не встановлено - створюємо новий
    // масив допустимих значень для характеристики
    userFilters[componentType][spec.name] = [spec.value];
    filterIsActive = true;
  }

  useAssemblyStore.setState({ userFilters });

  return filterIsActive;
};

export const clearUserFilters = () => {
  const state = useAssemblyStore.getState();
  const componentType = state.loadedComponents.componentType;
  if (!componentType) throw new Error("component type not specified");
  const userFilters = state.userFilters;
  useAssemblyStore.setState({
    userFilters: { ...userFilters, [componentType]: {} },
  });
};

export const checkIfFilterActive = (spec: Spec<string>): boolean => {
  const state = useAssemblyStore.getState();
  const componentType = state.loadedComponents.componentType;
  if (!componentType) throw new Error("component type not specified");
  const userFilters = state.userFilters[componentType];

  return (
    spec.name in userFilters && userFilters[spec.name].includes(spec.value)
  );
};

// * методи для завантаження списку комплектуючих
export const loadComponentList = async (componentType?: ComponentType) => {
  const state = useAssemblyStore.getState();
  if (!componentType) {
    if (!state.loadedComponents.componentType)
      throw new Error("component type not provided");
    componentType = state.loadedComponents.componentType;
  }
  const loadedComponents = state.loadedComponents;
  const userFilters = state.userFilters[componentType];

  // переходимо в стан завантаження
  useAssemblyStore.setState({
    loadedComponents: {
      ...loadedComponents,
      loadingState: ListLoadingState.LOADING,
      componentType,
    },
  });

  // отримуємо комплектуючі
  const newComponents = await ComponentService.fetchComponents(
    componentType,
    userFilters,
    1,
    ""
  ); // ! hardcode

  // отримуємо доступні фільтри
  const availFilters = await ComponentService.fetchAvailFilters(
    componentType,
    userFilters,
    ""
  ); // ! hardcode

  // переходимо в стан із завантаженими комплектуючими
  useAssemblyStore.setState({
    loadedComponents: {
      components: newComponents,
      loadingState: ListLoadingState.LOADED,
      availFilters,
      componentType,
    },
  });
};
