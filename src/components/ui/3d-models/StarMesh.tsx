"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function GoldStarImage({ textureUrl = "/stars/gold-star.png", size = 10 }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(textureUrl);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, [textureUrl]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.003; // slow spin
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default function GoldStarCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <GoldStarImage />
      </Canvas>
    </div>
  );
}
