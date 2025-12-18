import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";

function DnaParticles({ count = 2000, radius = 2, length = 15 }) {
  const points = useRef();

  // Generate particles for a double helix
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const color1 = new THREE.Color("#ff3a3a"); // Vibrant Red
    const color2 = new THREE.Color("#46d369"); // Vibrant Green
    const color3 = new THREE.Color("#ffffff"); // White accents

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const t = (i / count) * Math.PI * 12; // More turns

      // Split into two strands
      const isStrandA = i % 2 === 0;
      const angle = t + (isStrandA ? 0 : Math.PI);

      // Base position on helix
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (t / (Math.PI * 12)) * length - length / 2;

      // Add some randomness/spread to make it look like a cloud
      const spread = 0.4;
      positions[i3] = x + (Math.random() - 0.5) * spread;
      positions[i3 + 1] = y + (Math.random() - 0.5) * spread;
      positions[i3 + 2] = z + (Math.random() - 0.5) * spread;

      // Colors
      const color = isStrandA ? color1 : color2;
      // Mix in some white randomly
      if (Math.random() > 0.85) color.lerp(color3, 0.6);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Random sizes
      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    return { positions, colors, sizes };
  }, [count, radius, length]);

  useFrame((state) => {
    if (!points.current) return;
    // Rotate the entire helix
    points.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    // Gentle floating wave
    points.current.position.y =
      Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
  });

  // Custom shader to render circles
  const shader = useMemo(
    () => ({
      vertexShader: `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
      fragmentShader: `
      varying vec3 vColor;
      void main() {
        // Circular particle
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        if (dot(cxy, cxy) > 1.0) discard;
        gl_FragColor = vec4(vColor, 0.8); // 0.8 opacity
      }
    `,
    }),
    []
  );

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <DnaParticles count={800} radius={2.5} length={20} />
      </Float>

      {/* Background ambient particles */}
      <Sparkles
        count={150}
        scale={15}
        size={2}
        speed={0.4}
        opacity={0.4}
        color="#ffffff"
      />

      <EffectComposer disableNormalPass>
        <Bloom
          luminanceThreshold={0.2}
          mipmapBlur
          intensity={1.5}
          radius={0.6}
        />
      </EffectComposer>
    </>
  );
}

export default function DnaBackground() {
  return (
    <div className="dna-canvas">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 35 }}
        gl={{
          antialias: false, // Post-processing handles AA usually, or better perf without
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Handle high DPI screens
      >
        <Scene />
      </Canvas>
    </div>
  );
}
