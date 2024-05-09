import { create } from "zustand";
import { PCComponent } from "../models/pc_component";
import { ComponentType } from "../models/component_types";
import ComponentService from "../services/component_service";

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
}

const initialComponentListState: ComponentListState = {
  loadingState: ListLoadingState.INITIAL,
  componentType: undefined,
  components: [],
};

const useComponentListStore = create<ComponentListState>(() => ({
  ...initialComponentListState,
}));

export const useComponentList = () =>
  useComponentListStore((state) => ({
    components: state.components.map((component) => component.clone()),
    componentType: state.componentType,
    loadingState: state.loadingState,
  }));

export const setComponentType = (componentType: ComponentType) => {
  // const state = useComponentListStore.getState();
  useComponentListStore.setState({ componentType });
};

export const loadComponentList = async () => {
  // const state = useComponentListStore.getState(); // !
  console.log("fetching");

  // переходимо в стан загрузки
  useComponentListStore.setState({ loadingState: ListLoadingState.LOADING });

  const components = await ComponentService.getComponents(
    ComponentType.CPU,
    {},
    1,
    ""
  ); // ! hardcode
  // переходимо в стан із завантаженими комплектуючими
  useComponentListStore.setState({
    components,
    loadingState: ListLoadingState.LOADED,
  });
};
