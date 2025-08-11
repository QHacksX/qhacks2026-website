"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  radius: number;
  color?: string;
};

function RotatingWireSphere({
  position,
  radius,
  color = "rgba(191, 159, 95, 0.32)",
}: Props) {
  const sphereRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={sphereRef} position={position}>
      <mesh>
        <sphereGeometry args={[radius, 28, 30]} />
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

export default function GoldWireSphereCanvas({
  position,
  radius,
  color,
}: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={1.2} position={[5, 5, 10]} />
        <RotatingWireSphere position={position} radius={radius} color={color} />
      </Canvas>
    </div>
  );
}
