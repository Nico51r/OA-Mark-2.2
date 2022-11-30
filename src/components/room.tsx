import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { assets } from "../assets/assets";
import { useProjectContext } from "../context/project-context";
import { config } from "../config";

export const Room = () => {
  const { store } = useProjectContext();
  const roomGLTF = useLoader(GLTFLoader, assets.room) as GLTF;
  //@ts-ignore
  const room = roomGLTF.nodes.Cube;
  const mesh = useRef<Mesh>(null!);
  useEffect(() => {
    store.plane = mesh.current;
  }, [store]);
  return (
    <>
      {/* <mesh geometry={room.geometry} scale={[1.04, 1, 1]}>
        <meshBasicMaterial color="#bbbbbb" />
      </mesh> */}
      <mesh
        ref={mesh}
        position={[0, 9, -20]}
        onPointerMove={(e) => {
          const { lastPosXY, lastPointXY, target } = store;

          if (lastPointXY[0] === 10e-5) return;

          target.position.x = lastPosXY[0] + e.point.x - lastPointXY[0];
          target.position.y = lastPosXY[1] + e.point.y - lastPointXY[1];

          if (target && Math.abs(target.position.x) > config.width) {
            target.position.x = config.width * Math.sign(target.position.x);
          }

          if (target && target.position.y > 15) {
            target.position.y = 15;
          }

          if (target && target.position.y < 1.5) {
            target.position.y = 1.5;
          }
          if (target && target.position.y < 4 && target.name === 'mobile' ) {
            target.position.y = 4;
          }
          
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          store.lastPointXY = [10e-5, 10e-5];
          store.target = null!;
        }}
        onPointerLeave={() => {
          store.lastPointXY = [10e-5, 10e-5];
          store.target = null!;
        }}
      >
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial color="red" transparent={true} opacity={0} />
      </mesh>
    </>
  );
};
