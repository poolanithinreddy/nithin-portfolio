"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, Html } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

import { StaticFallback } from "./StaticFallback";

const chipLabels = [
  { label: "UI", color: "#60a5fa" },
  { label: "API", color: "#34d399" },
  { label: "Workers", color: "#a855f7" },
  { label: "vCenter", color: "#f97316" },
] satisfies Array<{ label: string; color: string }>;

type TiltRef = { x: number; y: number };

function usePointerTilt(intensity = 0.35) {
  const pointer = useRef<TiltRef>({ x: 0, y: 0 });
  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    pointer.current.x = THREE.MathUtils.clamp((relativeX - 0.5) * 2 * intensity, -1, 1);
    pointer.current.y = THREE.MathUtils.clamp((relativeY - 0.5) * 2 * intensity, -1, 1);
  };

  return { pointer, handlePointerMove } as const;
}

function Chip({ index, exploded }: { index: number; exploded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.6;
    meshRef.current.rotation.x += delta * 0.4;
    invalidate();
  });

  const radius = useMemo(() => (exploded ? 2.7 : 2.1), [exploded]);
  const angle = (index / chipLabels.length) * Math.PI * 2;

  return (
    <group position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.2, 2.2]} />
        <meshPhysicalMaterial
          color={chipLabels[index].color}
          metalness={0.45}
          roughness={0.1}
          transmission={0.75}
          thickness={0.65}
          envMapIntensity={1.6}
        />
      </mesh>
      <Html
        position={[0, 0.6, 0]}
        center
        className="pointer-events-none select-none text-xs font-semibold uppercase tracking-[0.28em] text-slate-100 drop-shadow"
      >
        {chipLabels[index].label}
      </Html>
    </group>
  );
}

function CyberSphere({ exploded, tilt }: { exploded: boolean; tilt: React.MutableRefObject<TiltRef> }) {
  const groupRef = useRef<THREE.Group>(null);
  const bloomRef = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetX = THREE.MathUtils.lerp(groupRef.current.rotation.x, tilt.current.y * 0.6, 0.1);
    const targetY = THREE.MathUtils.lerp(groupRef.current.rotation.y, tilt.current.x * 0.6, 0.1);
    groupRef.current.rotation.x = targetX;
    groupRef.current.rotation.y = targetY;

    if (bloomRef.current) {
      bloomRef.current.rotation.y += delta * 0.12;
      bloomRef.current.rotation.x -= delta * 0.08;
    }

    invalidate();
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow onPointerMove={() => {}}>
        <sphereGeometry args={[2.4, 128, 128]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.12}
          metalness={0.4}
          transmission={0.85}
          thickness={1.5}
          envMapIntensity={1.25}
          clearcoat={1}
          clearcoatRoughness={0.1}
          sheen={1}
          sheenColor={new THREE.Color("#60a5fa")}
        />
      </mesh>
      <mesh ref={bloomRef}>
        <icosahedronGeometry args={[3.2, 2]} />
        <meshStandardMaterial
          color="#1e293b"
          opacity={0.16}
          transparent
          emissive="#312e81"
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
      {chipLabels.map((_, index) => (
        <Chip key={index} index={index} exploded={exploded} />
      ))}
    </group>
  );
}

function HeroSceneInner() {
  const { pointer, handlePointerMove } = usePointerTilt();
  const [exploded, setExploded] = useState(false);

  return (
  <group onClick={() => setExploded((prev) => !prev)} onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={1.6} color="#60a5fa" />
      <pointLight position={[-4, -2, -6]} intensity={1.2} color="#a855f7" />
      <CyberSphere exploded={exploded} tilt={pointer} />
      <Environment resolution={256} frames={1}>
        <group rotation={[0, Math.PI, 0]}>
          <Lightformer
            intensity={0.9}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
            color="#60a5fa"
          />
          <Lightformer
            intensity={0.6}
            rotation-y={Math.PI / 2}
            position={[-10, 0, 0]}
            scale={[6, 8, 1]}
            color="#a855f7"
          />
        </group>
      </Environment>
    </group>
  );
}

export function HeroScene() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <StaticFallback />
      </div>
    );
  }

  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Suspense fallback={<StaticFallback />}>
        <Canvas
          frameloop="demand"
          shadows
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 8], fov: 40 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        >
          <color attach="background" args={["#030712"]} />
          <HeroSceneInner />
        </Canvas>
      </Suspense>
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-60" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.25)_0,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.18)_0,transparent_55%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/15 shadow-[0_50px_120px_-50px_rgba(59,130,246,0.6)]" aria-hidden />
    </div>
  );
}
