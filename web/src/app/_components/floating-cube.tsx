"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Trail } from "@react-three/drei";
import * as THREE from "three";

interface FloatingCubeProps {
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

const FloatingCube = ({
  position,
  scale = 1,
  color = "#9b87f5",
  speed = 1,
  distort = 0.4,
  withTrail = false,
  trailColor = "#D6BCFA",
  trailWidth = 0.05,
  trailLength = 8,
}: FloatingCubeProps) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const t = clock.getElapsedTime() * speed;

    // More complex movement pattern
    mesh.current.position.y = position[1] + Math.sin(t) * 0.2;
    mesh.current.position.x = position[0] + Math.cos(t * 0.5) * 0.1;
    mesh.current.position.z = position[2] + Math.sin(t * 0.3) * 0.1;

    mesh.current.rotation.x = Math.sin(t * 0.4) * 0.5;
    mesh.current.rotation.y = Math.sin(t * 0.3) * 0.5;
    mesh.current.rotation.z = Math.sin(t * 0.2) * 0.5;
  });

  const cube = (
    <mesh ref={mesh} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1, 8, 8, 8]} />
      <MeshDistortMaterial
        color={color}
        speed={0.5}
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
      {cube}
    </Trail>
  ) : (
    cube
  );
};

export default FloatingCube;
