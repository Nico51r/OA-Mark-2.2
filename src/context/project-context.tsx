import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { getRandomData } from "../utils";
import { ContextProps, StateProps, StoreProps } from "./types";

export const ProjectContext = createContext({} as ContextProps);

export function useProjectContextState() {
  const [state, setState] = useState<StateProps>({
    selected: false,
    target: null,
  });

  // const [data, setData] = useState([[0, 1, -10.5]]);
  const [data, setData] = useState(getRandomData());

  const storeRef = useRef<StoreProps>({
    panels: {},
    lastPosZ: 0,
    lastPosXY: [0, 0],
    lastPointXY: [10e-5, 10e-5],
    target: null!,
    plane: null!,
    dragging: false,
    control: null!,
    camera: null!,
    initScene: () => {},
  });

  const updateState = useCallback((newItem: Partial<StateProps>) => {
    setState((prev) => ({ ...prev, ...newItem }));
  }, []);

  return { data, setData, store: storeRef.current, state, updateState };
}

export function useProjectContext() {
  const all = useContext(ProjectContext);
  return all;
}
