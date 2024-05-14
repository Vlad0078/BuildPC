import { Assembly, AvailFilters, Filters } from "../models/assembly";
import { ComponentType } from "../models/component_types";
import { PCComponent, Spec } from "../models/pc_component";

import ComponentService from "../services/component_service";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { PersistStorage, persist } from "zustand/middleware";

export enum ListLoadingState {
  INITIAL,
  LOADING,
  RELOADING,
  LOADED,
  FAILED,
}

interface ComponentListState {
  loadingState: ListLoadingState;
  componentType: ComponentType | undefined;
  components: PCComponent[];
  searchQuery: string;
  availFilters: AvailFilters;
  page: number;
  pages: number;
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
    searchQuery: "",
    availFilters: {},
    page: 1,
    pages: 1,
  },
};

// * налаштування persist
const storage: PersistStorage<AssemblyState> = {
  getItem: (storageName: string) => {
    const jsonData = localStorage.getItem(storageName);
    if (!jsonData) return null;
    const parsedData = JSON.parse(jsonData);

    if ("assembly" in parsedData.state) {
      parsedData.state.assembly = new Assembly(parsedData.state.assembly);
    }

    return parsedData;
  },

  setItem: (storageName: string, value: { state: AssemblyState }) => {
    value.state = {
      ...initialAssemblyState,
      assembly: value.state.assembly,
      loadedComponents: {
        ...initialAssemblyState.loadedComponents,
        componentType: value.state.loadedComponents.componentType,
      },
    };
    localStorage.setItem(storageName, JSON.stringify(value));
  },

  removeItem: (name: string) => localStorage.removeItem(name),
};

// !* никода не экспортируем сам хук с его методами доступа к хранилищу! //?
const useAssemblyStore = createWithEqualityFn<AssemblyState>()(
  persist(
    () => ({
      ...initialAssemblyState,
    }),
    { name: "assemblyStore", storage }
  ),
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

export const useListPage = () =>
  useAssemblyStore((state) => state.loadedComponents.page);

export const useListPages = () =>
  useAssemblyStore((state) => state.loadedComponents.pages);

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
export const addComponent = (component: PCComponent) => {
  const state = useAssemblyStore.getState();
  const newAssembly = state.assembly.clone();
  newAssembly.addComponent(component);
  useAssemblyStore.setState({ assembly: newAssembly });
};

export const removeComponent = (id: number, component: PCComponent) => {
  const state = useAssemblyStore.getState();
  const newAssembly = state.assembly.clone();
  newAssembly.removeComponent(id, component);
  useAssemblyStore.setState({ assembly: newAssembly });
};

export const resetStore = () => {
  useAssemblyStore.setState(initialAssemblyState);
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
export const setComponentListType = (componentType: ComponentType) => {
  useAssemblyStore.setState({
    loadedComponents: {
      ...initialAssemblyState.loadedComponents,
      componentType,
    },
  });
};

export const loadComponentList = async (
  page: number = 1,
  searchQuery?: string
) => {
  const state = useAssemblyStore.getState();
  const componentType = state.loadedComponents.componentType;
  if (!componentType) throw new Error("component type not provided");
  const loadedComponents = state.loadedComponents;
  const userFilters = state.userFilters[componentType];
  if (searchQuery === undefined)
    searchQuery = state.loadedComponents.searchQuery;

  const loadingState =
    state.loadedComponents.loadingState === ListLoadingState.LOADED ||
    state.loadedComponents.loadingState === ListLoadingState.RELOADING
      ? ListLoadingState.RELOADING
      : ListLoadingState.LOADING;

  // переходимо в стан завантаження
  useAssemblyStore.setState({
    loadedComponents: {
      ...loadedComponents,
      loadingState,
      componentType,
    },
  });

  // отримуємо комплектуючі
  const newComponents = await ComponentService.fetchComponents(
    componentType,
    userFilters,
    state.assembly.compatibilityFilters,
    page,
    searchQuery
  );

  // отримуємо к-ть сторінок та доступні фільтри, якщо завантажуємо першу сторінку
  let availFilters: AvailFilters;
  let pages: number;
  if (page === 1) {
    // сторінки
    pages = await ComponentService.countPages(
      componentType,
      userFilters,
      state.assembly.compatibilityFilters,
      searchQuery
    );

    // доступні фільтри
    availFilters = await ComponentService.fetchAvailFilters(
      componentType,
      userFilters,
      state.assembly.compatibilityFilters,
      searchQuery
    );
  } else {
    availFilters = state.loadedComponents.availFilters;
    pages = state.loadedComponents.pages;
  }

  // переходимо в стан із завантаженими комплектуючими
  useAssemblyStore.setState({
    loadedComponents: {
      components: newComponents,
      loadingState: ListLoadingState.LOADED,
      availFilters,
      componentType,
      searchQuery,
      page,
      pages,
    },
  });
};
