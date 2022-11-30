import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import {
  ProjectContext,
  useProjectContextState,
} from "./context/project-context";
import { Camera } from "./components/camera/camera";
import { Color, PCFSoftShadowMap, TextureLoader } from "three";
import { Room } from "./components/room";
import { Environment } from "./components/environment";
import { Card } from "./components/card";
import { Container, Panel } from "./components/panels/panels";
import { Button, Box as MBox } from "@mui/material";
import { getArrangedData, getRandomData } from "./utils";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { assets } from "./assets/assets";

const App: React.FC = () => {
  const states = useProjectContextState();
  const {
    data,
    setData,
    store,
    updateState,
    state: { target },
  } = states;

  const lastPoint = useRef<number>(0);
  const [toggle, setToggle] = useState(false);
  const [mobPosition,setMobPosition]= useState([-4 + Math.random() * 8, 4+ Math.random() * 4, -16]);
  return (
    <Container>
      <Canvas
        style={{ position: "absolute", top: 0, left: 0 }}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 0.001], near: 0.1, far: 1000 }}
        shadows
        onCreated={({ gl, scene }) => {
          gl.shadowMap.type = PCFSoftShadowMap;
          // scene.background = new TextureLoader().load(assets.background); //new Color(0xaaaaaa);
        }}
        onPointerDown={(e) => {
          lastPoint.current = e.clientY;
        }}
        onPointerMove={(e) => {
          if (!target) return;
          const delta = e.clientY - lastPoint.current;
          target.current.position.z = store.lastPosZ + delta / 15;
        }}
        onPointerUp={(e) => {
          updateState({ target: null, selected: false });
          store.dragging = false;
        }}
      >
        <ProjectContext.Provider value={states}>
          <Environment />

          <Camera />

          <Room />

          {data.map((s: number[], idx: number) => (
            <Card
              key={idx}
              hoverState={false}
              // @ts-ignore
              position={toggle ? s : [s[0], s[1], s[2] + 1e-10]}
            />
          ))}
          <Card
            key={"mobile"}
            hoverState={false}
            isMobile={true}
            // @ts-ignore
            position={mobPosition}
          />
        </ProjectContext.Provider>

        <EffectComposer>
          <Vignette
            offset={0.5} // vignette offset
            darkness={0.5} // vignette darkness
            eskil={false} // Eskil's vignette technique
            blendFunction={BlendFunction.NORMAL} // blend mode
          />
        </EffectComposer>
      </Canvas>
      <Panel>
        <MBox
          display={"flex"}
          justifyContent="space-between"
          component="div"
          p={"5px"}
        >
          <MBox component="div">
            <Button
              variant="contained"
              onClick={() => {
                setData(getArrangedData());
                setMobPosition([-4 + Math.random() * 8, 4+ Math.random() * 4, -16]);
                setToggle((p) => !p);
              }}
            >
              Arrange
            </Button>
          </MBox>
          <MBox component="div">
            <Button
              variant="contained"
              onClick={() => {
                setToggle((p) => !p);
                setMobPosition([-4 + Math.random() * 8, 4+ Math.random() * 4, -16]);
                setData(getRandomData());
              }}
            >
              Randomize
            </Button>
          </MBox>
        </MBox>
      </Panel>
    </Container>
  );
};

export default App;
