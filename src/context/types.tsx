import React from "react";
import { Camera } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { Group, Mesh } from "three";

export interface StateProps {
  selected: boolean;
  target: React.MutableRefObject<Group> | null;
}

export interface StoreProps {
  panels: any;
  control: CameraControls;
  lastPosZ: number;
  lastPosXY: [number, number];
  lastPointXY: [number, number];
  target: Group;
  plane: Mesh;
  dragging: boolean;
  camera: Camera & {
    manual?: boolean | undefined;
  };
  initScene: () => void;
}

export interface ContextProps {
  store: StoreProps;
  state: StateProps;
  updateState: (s: Partial<StateProps>) => void;
  data: number[][];
  setData: (s: number[][]) => void;
}

export interface DraggingStateProps {
  lastPosZ: number;
  lastPointZ: number;
  lastPosXY: [number, number];
  lastPointXY: [number, number];
}
