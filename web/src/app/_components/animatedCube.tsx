import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedCubeProps {
  position?: [number, number, number];
  size?: number;
  color?: string;
  wireframe?: boolean;
  rotationSpeed?: number;
}

const AnimatedCube: React.FC<AnimatedCubeProps> = ({
  position = [0, 0, 0],
  size = 1,
  color = "#3b82f6",
  wireframe = false,
  rotationSpeed = 0.01,
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeed * 0.5;
      mesh.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        wireframe={wireframe}
        roughness={0.5}
        metalness={0.8}
        transparent={true}
        opacity={0.8}
      >
        {color && <color attach="color" args={[color]} />}
      </meshStandardMaterial>
      {!wireframe && <Edges threshold={15} color="#ffffff" />}
    </mesh>
  );
};

export default AnimatedCube;
