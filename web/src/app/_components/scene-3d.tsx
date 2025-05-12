"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Cloud } from "@react-three/drei";
import ParticleField from "./particle-field";

import FloatingCube from "./floating-cube";
import FloatingSphere from "./floating-sphere";

const Scene3D = () => {
  return (
    <div className="absolute top-0 left-0 -z-1 h-[100vh] w-[100%] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />

        {/* Background stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <ParticleField count={300} />
        <FloatingCube
          position={[-2.5, 0, 0]}
          scale={0.6}
          color="#9b87f5"
          speed={0.8}
        />
        <FloatingSphere
          position={[2, -1, -2]}
          scale={0.8}
          color="#7E69AB"
          speed={1.2}
        />
        <FloatingCube
          position={[3, 1, -1]}
          scale={0.5}
          color="#D6BCFA"
          speed={0.5}
        />
        <FloatingSphere
          position={[-3, -1, -3]}
          scale={0.7}
          color="#9b87f5"
          speed={0.9}
        />

        {/* Add more floating elements */}
        <FloatingCube
          position={[4, -2, -2]}
          scale={0.4}
          color="#9b87f5"
          speed={1.1}
        />
        <FloatingSphere
          position={[-4, 2, -1]}
          scale={0.6}
          color="#D6BCFA"
          speed={0.7}
        />
        <FloatingCube
          position={[0, 3, -3]}
          scale={0.5}
          color="#7E69AB"
          speed={1.0}
        />
        <FloatingSphere
          position={[-1, -3, -2]}
          scale={0.5}
          color="#9b87f5"
          speed={0.6}
        />

        {/* Decorative clouds */}
        <Cloud position={[-4, -2, -10]} speed={0.2} opacity={0.2} />
        <Cloud position={[4, 2, -12]} speed={0.2} opacity={0.1} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Scene3D;
