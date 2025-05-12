"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ParticleField = ({ count = 2000, color = "#9b87f5" }) => {
  const points = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create a more spread out field
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, [count]);

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color("#9b87f5");
    const color2 = new THREE.Color("#D6BCFA");

    for (let i = 0; i < count; i++) {
      const mixedColor = color1.clone().lerp(color2, Math.random());

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return colors;
  }, [count]);

  const sizes = useMemo(() => {
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    return sizes;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const time = clock.getElapsedTime() * 0.2;
    const position = points.current.geometry.attributes.position!;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = position.array[i3]!;
      const y = position.array[i3 + 1]!;
      const z = position.array[i3 + 2]!;

      // Apply a more complex wave movement
      position.array[i3 + 1] = y + Math.sin(x * 0.5 + time) * 0.02;
      position.array[i3] = x + Math.cos(y * 0.5 + time) * 0.02;
      position.array[i3 + 2] = z + Math.sin(x * 0.3 + time) * 0.01;
    }

    position.needsUpdate = true;
    points.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          itemSize={3}
          array={particlesPosition}
          args={[particlesPosition, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          itemSize={1}
          array={sizes}
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          itemSize={3}
          array={colors}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.8}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleField;
