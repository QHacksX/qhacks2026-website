"use client";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function AnimatedStars() {
  return (
    <div className="absolute inset-0">
      <Canvas>
        {/* Stars */}
        <Stars
          radius={100} // Inner sphere radius
          depth={50} // Star field depth
          count={3000} // Number of stars
          factor={4} // Size factor
          saturation={0} // 0 = white, 1 = colorful
          fade // Fades stars when moving
          speed={1} // Rotation speed
        />
      </Canvas>
    </div>
  );
}
