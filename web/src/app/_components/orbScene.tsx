import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AnimatedCube from "./animatedCube";
interface OrbSceneProps {
  className?: string;
}

const OrbScene: React.FC<OrbSceneProps> = ({ className }) => {
  return (
    <div className={`${className || ""} h-full w-full`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

        <Suspense fallback={null}>
          <AnimatedCube position={[-2, 0, 0]} size={0.8} color="#3b82f6" />
          <AnimatedCube
            position={[0, 0, -1]}
            size={1.2}
            color="#8b5cf6"
            rotationSpeed={0.007}
          />
          <AnimatedCube
            position={[2, 0, 0]}
            size={0.5}
            color="#ec4899"
            rotationSpeed={0.015}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};

export default OrbScene;
