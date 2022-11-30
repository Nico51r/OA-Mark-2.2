import React, { Suspense } from "react";
import { GroupProps, useLoader, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh, sRGBEncoding, TextureLoader, Vector3 } from "three";
import gsap from "gsap";
import { assets } from "../assets/assets";
import { useProjectContext } from "../context/project-context";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

interface Props extends GroupProps {
  hoverState: boolean;
  isMobile?: boolean;
}

let originPos: any;
let zoom: boolean = false;

const CardContainer: React.FC<Props> = ({ hoverState, isMobile, ...props }) => {
  const { updateState, store } = useProjectContext();
  const { camera, gl } = useThree();
  const gltf = useLoader(GLTFLoader, assets.box);
  // @ts-ignore
  const geo = gltf.nodes.box.geometry;
  const arrowTexture = useLoader(TextureLoader, assets.arrow);
  arrowTexture.encoding = sRGBEncoding;
  const dashboard = useLoader(TextureLoader, assets.dashboard);
  dashboard.encoding = sRGBEncoding;
  dashboard.flipY = false;

  const size = 0.0012;
  const boxGeometry = new THREE.BoxGeometry(1560 * size, 0.01, 5824 * size);
  const mobileImg = useLoader(TextureLoader, assets.mobile);
  mobileImg.encoding = sRGBEncoding;

  const [hover, setHover] = useState(hoverState);

  const group = useRef<Group>(null!);
  const mesh = useRef<Mesh>(null!);

  return (
    <group ref={group} {...props} name={isMobile ? "mobile" : "dashboard"}>
      {hover && (
        <sprite
          scale={0.045}
          position={isMobile ? [-0.82, -3.33, 0.09] : [-1.35, -0.8, 0.09]}
          onPointerDown={(e) => {
            e.stopPropagation();
            store.dragging = true;
            store.lastPosZ = group.current.position.z;
            updateState({ target: group, selected: true });
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
          }}
        >
          <spriteMaterial
            map={arrowTexture}
            sizeAttenuation={false}
            color="#11f797"
          />
        </sprite>
      )}
      <mesh
        ref={mesh}
        rotation-x={Math.PI / 2}
        scale-y={0.01}
        onPointerDown={(e) => {
          e.stopPropagation();
          store.target = group.current;
          store.plane.position.z = group.current.position.z + 0.01;
          store.lastPointXY = [e.point.x, e.point.y];
          store.lastPosXY = [
            group.current.position.x,
            group.current.position.y,
          ];
          console.log("~~~");
        }}
        onPointerOver={(e) => {
          // e.stopPropagation();
          setHover(true);
        }}
        onPointerLeave={(e) => {
          // e.stopPropagation();
          setHover(false);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          zoom = !zoom;
          if (zoom) {
            originPos = new Vector3().copy(group.current.position);
            gsap.to(group.current.position, {
              x: camera.position.x,
              y: camera.position.y,
              z: camera.position.z - (isMobile ? 5 : 2),
            });
            gl.toneMappingExposure = 2;
          } else {
            gsap.to(group.current.position, {
              x: originPos.x,
              y: originPos.y,
              z: originPos.z,
            });
            gl.toneMappingExposure = 1;
          }
        }}
        castShadow
        geometry={isMobile ? boxGeometry : geo}
      >
        {/* <planeGeometry args={[3.5, 2]} /> */}
        <meshBasicMaterial
          map={isMobile ? mobileImg : dashboard}
          color={"#ffffff"}
        />
      </mesh>
    </group>
  );
};

export const Card: React.FC<Props> = (props) => {
  return (
    <Suspense>
      <CardContainer {...props} />
    </Suspense>
  );
};
