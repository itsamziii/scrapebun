"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Trail } from "@react-three/drei";
import * as THREE from "three";

interface FloatingSphereProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  distort?: number;
  withTrail?: boolean;
  trailColor?: string;
  trailWidth?: number;
  trailLength?: number;
}

const FloatingSphere = ({
  position,
  scale = 1,
  color = "#7E69AB",
  speed = 1,
  distort = 0.3,
  withTrail = false,
  trailColor = "#9b87f5",
  trailWidth = 0.05,
  trailLength = 8,
}: FloatingSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime() * speed;

    // Complex floating motion
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.2;
    meshRef.current.position.x = position[0] + Math.sin(t * 0.4) * 0.1;
    meshRef.current.position.z = position[2] + Math.cos(t * 0.3) * 0.1;

    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.3;
  });

  const sphere = (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        speed={0.8}
        distort={distort}
        envMapIntensity={0.4}
        clearcoat={0.2}
        clearcoatRoughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );

  return withTrail ? (
    <Trail
      width={trailWidth}
      color={trailColor}
      length={trailLength}
      decay={1}
      attenuation={(width) => width}
    >
      {sphere}
    </Trail>
  ) : (
    sphere
  );
};

export default FloatingSphere;
