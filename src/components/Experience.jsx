import {
  Float,
  Line,
  OrbitControls,
  PerspectiveCamera,
  useScroll,
} from "@react-three/drei";
import Background from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
export default function Experience() {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(-2, 0, -20),
        new THREE.Vector3(-3, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(5, 0, -50),
        new THREE.Vector3(7, 0, -60),
        new THREE.Vector3(5, 0, -70),
        new THREE.Vector3(0, 0, -80),
        new THREE.Vector3(0, 0, -90),
        new THREE.Vector3(0, 0, -100),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(2000);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.moveTo(0, 0.2);
  }, [curve]);
  const cameraGroup = useRef();
  const scroll = useScroll();
  useFrame((_state, delta) => {
    const cursorPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length),
      linePoints.length - 1
    );
    const cursorPoint = linePoints[cursorPointIndex];
    cameraGroup.current.position.lerp(cursorPoint, delta * 24);

    const pointAhead =
      linePoints[Math.min(cursorPointIndex + 1, linePoints.length - 1)];
    const xDisplacement = (pointAhead.x - cursorPoint.x) * 80;
    const angleRotation =
      (xDisplacement < 0 ? 1 : -1) *
      Math.min(Math.abs(xDisplacement), Math.PI / 3);

    const targrtAirPlaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angleRotation
      )
    );

    const targrtCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        angleRotation,
        airplane.current.rotation.z
      )
    );
    airplane.current.quaternion.slerp(targrtAirPlaneQuaternion, delta * 2);
    cameraGroup.current.quaternion.slerp(targrtCameraQuaternion, delta * 2);
  });
  const airplane = useRef();
  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera
          camera={{
            position: [0, 0, 5],
            fov: 30,
          }}
          makeDefault
        />
        <group ref={airplane}>
          <Float floatIntensity={2} speed={3}>
            <Airplane
              rotation-y={Math.PI / 2}
              scale={[0.2, 0.2, 0.2]}
              position-y={0.1}
            />
          </Float>
        </group>
      </group>
      <Cloud position={[-2, 1, -3]} scale={[0.3, 0.3, 0.3]} opacity={0.5} />
      <Cloud position={[1.5, -0.5, -2]} scale={[0.2, 0.3, 0.4]} opacity={0.5} />
      <Cloud position={[2, -0.2, -2]} scale={[0.3, 0.3, 0.4]} opacity={0.7} />
      <Cloud
        position={[1, -0.2, -12]}
        scale={[0.4, 0.4, 0.4]}
        opacity={0.7}
        rotation-y={Math.PI / 9}
      />
      <Cloud position={[-1, 1, -53]} scale={[0.5, 0.5, 0.5]} opacity={0.7} />
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              { steps: 2000, bevelEnabled: false, extrudePath: curve },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={0.7} transparent />
        </mesh>
      </group>{" "}
      <Cloud position={[0, 1, -100]} scale={[0.8, 0.8, 0.8]} opacity={0.3} />
    </>
  );
}
