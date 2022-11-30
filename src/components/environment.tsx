import { Environment as Env } from "@react-three/drei";
import { assets } from "../assets/assets";

export const Environment = () => {
  return (
    <>
      {/* <fog attach="fog" args={["#d8d0d0", 20, 35]} /> */}
      {/* <Env preset="warehouse" background={false} /> */}
      <Env files={assets.royalEnv} />
      {/* <gridHelper
        args={[80, 40, 0xeeeeee, 0xeeeeee]}
        position={[0, 0.3, -40]}
      /> */}
      <axesHelper />

      <ambientLight intensity={0.4} />

      <directionalLight
        color="gray"
        intensity={0.2}
        position={[0, 8, 5]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50]} />
      </directionalLight>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.5, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </>
  );
};
