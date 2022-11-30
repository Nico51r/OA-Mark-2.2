import { useEffect, useMemo, useRef } from "react";
import { CameraControls } from "./camera-controls";
import CameraControlsDefault from "camera-controls";
import { useFrame, useThree } from "@react-three/fiber";
import { useProjectContext } from "../../context/project-context";
import { config } from "../../config";

export const Camera = () => {
  const { store, data } = useProjectContext();
  const { camera } = useThree();
  const controls = useRef<CameraControls | null>(null);
  const moveState = useMemo(
    () => ({
      forward: false,
      backward: false,
      right: false,
      left: false,
    }),
    []
  );

  // add key event listeners
  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          moveState.forward = true;
          break;
        case "ArrowLeft":
        case "a":
          moveState.left = true;
          break;
        case "ArrowDown":
        case "s":
          moveState.backward = true;
          break;
        case "ArrowRight":
        case "d":
          moveState.right = true;
          break;
        default:
          break;
      }
    };
    const keyupHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          moveState.forward = false;
          break;
        case "ArrowLeft":
        case "a":
          moveState.left = false;
          break;
        case "ArrowDown":
        case "s":
          moveState.backward = false;
          break;
        case "ArrowRight":
        case "d":
          moveState.right = false;
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };
  }, [moveState]);

  // initialize camera
  useEffect(() => {
    if (!controls.current) return;
    const c = controls.current;

    // negative value to invert rotation direction
    c.azimuthRotateSpeed = 0; // -0.5;
    // negative value to invert rotation direction
    c.polarRotateSpeed = 0; // -0.3;

    c.mouseButtons.wheel = CameraControlsDefault.ACTION.DOLLY;
    c.touches.two = CameraControlsDefault.ACTION.TOUCH_ZOOM_TRUCK;

    c.moveTo(0, 5, -1);
    c.rotateTo(0, Math.PI / 2);

    c.dampingFactor = 0.1;
    c.draggingDampingFactor = 0.1;
    c.saveState();
    store.control = c;
    store.camera = camera;
  }, [store, camera]);

  useEffect(() => {
    if (!controls.current) return;
    controls.current.moveTo(0, 5, -1);
  }, [data, controls]);

  useFrame(() => {
    if (!controls.current) return;
    const { speed, minDistance, maxDistance } = config;
    if (moveState.forward) controls.current.forward(speed, false);
    if (moveState.backward) controls.current.forward(-speed, false);
    if (moveState.right) controls.current.truck(speed, 0, false);
    if (moveState.left) controls.current.truck(-speed, 0, false);
    if (camera.position.z > minDistance) controls.current.forward(speed, false);
    if (camera.position.z < maxDistance)
      controls.current.forward(-speed, false);
    if (camera.position.x < -config.width + 10)
      controls.current.truck(speed, 0, false);
    if (camera.position.x > config.width - 10)
      controls.current.truck(-speed, 0, false);
  });

  return (
    <>
      <CameraControls ref={controls} />
    </>
  );
};
