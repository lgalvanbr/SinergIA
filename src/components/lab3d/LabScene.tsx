"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera, Grid, ContactShadows } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";
import { labZones } from "./labZones";

/** Coarse-pointer / narrow-viewport devices (phones, most tablets) get a
 * lighter render config — lower pixel ratio, smaller shadow maps, no MSAA —
 * since this scene's cost (shadows + antialiasing) scales with GPU fill rate,
 * which is the first thing to choke on mobile GPUs. */
const MOBILE_GPU_QUERY = "(max-width: 640px), (pointer: coarse)";

function useIsMobileGPU() {
  // LabScene is only ever mounted client-side (dynamic import, ssr:false in
  // Laboratorio.tsx), so `window` is safe to read directly in the
  // initializer — no need to set it from an effect body.
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_GPU_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_GPU_QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const INK = "#1d1d1f";
const INK_SOFT = "#3a3a3d";
const PAPER = "#f2f1ec";
const WOOD = "#c9a877";
const YELLOW = "#ffde00";

/* ---------- small reusable primitives ---------- */

function Desk({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.15, 0.06, 0.6]} />
        <meshStandardMaterial color={WOOD} roughness={0.7} />
      </mesh>
      {[-0.5, 0.5].map((x) =>
        [-0.25, 0.25].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.25, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color={INK_SOFT} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Monitor({ position, glow = INK }: { position: [number, number, number]; glow?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color={INK_SOFT} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.02]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0, 0.3, 0.012]}>
        <planeGeometry args={[0.36, 0.2]} />
        <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={glow === INK ? 0.15 : 0.7} />
      </mesh>
    </group>
  );
}

function Chair({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.15, 0.06, 16]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0, 0.42, -0.15]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.04]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
        <meshStandardMaterial color={INK_SOFT} />
      </mesh>
    </group>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.11, 0.32, 12]} />
        <meshStandardMaterial color={PAPER} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.24, 10, 10]} />
        <meshStandardMaterial color="#5b6b4f" roughness={1} />
      </mesh>
    </group>
  );
}

/* ---------- zone content ---------- */

function ServerRack() {
  return (
    <group>
      {[0, 0.55, 1.1].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 1.5, 0.55]} />
            <meshStandardMaterial color={INK} roughness={0.5} />
          </mesh>
          {[0.3, 0.6, 0.9, 1.2].map((y, j) => (
            <mesh key={j} position={[0, y, 0.28]}>
              <boxGeometry args={[0.34, 0.02, 0.01]} />
              <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function WorkstationRow({ count = 4 }: { count?: number }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const x = i * 1.3;
        return (
          <group key={i}>
            <Desk position={[x, 0, 0]} />
            <Monitor position={[x, 0.5, -0.02]} />
            <Chair position={[x, 0, 0.55]} rotationY={Math.PI} />
          </group>
        );
      })}
    </group>
  );
}

function SensorBench() {
  return (
    <group>
      {/* shake-table platform */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.16, 1.1]} />
        <meshStandardMaterial color={INK_SOFT} roughness={0.5} />
      </mesh>
      {/* scaled two-story house on top */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.55, 0.3, 0.5]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.5, 0.24, 0.45]} />
        <meshStandardMaterial color={PAPER} roughness={0.8} />
      </mesh>
      {/* sensor markers */}
      {[
        [0.3, 0.5, 0.26],
        [-0.3, 0.5, 0.26],
        [0.3, 0.72, -0.24],
        [-0.24, 0.3, 0.26],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={1} />
        </mesh>
      ))}
      {/* small monitor beside the rig */}
      <Desk position={[-1.1, 0, 0.3]} rotationY={Math.PI / 2} />
      <Monitor position={[-1.1, 0.5, 0.05]} glow={YELLOW} />
      <Chair position={[-1.55, 0, 0.3]} rotationY={-Math.PI / 2} />
    </group>
  );
}

function MeetingPod() {
  const glassProps = {
    color: "#eaf2ff",
    transparent: true,
    opacity: 0.38,
    roughness: 0.05,
    transmission: 0.55,
    side: THREE.DoubleSide,
  } as const;

  return (
    <group>
      <mesh position={[0, 0.5, -0.75]} castShadow>
        <boxGeometry args={[1.7, 1, 0.03]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>
      <mesh position={[-0.85, 0.5, 0]} castShadow>
        <boxGeometry args={[0.03, 1, 1.5]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>
      <mesh position={[0.85, 0.5, 0]} castShadow>
        <boxGeometry args={[0.03, 1, 1.5]} />
        <meshPhysicalMaterial {...glassProps} />
      </mesh>
      {/* thin frame edges for legibility from any angle */}
      {[
        [0, 1.0, -0.75, 1.7, 0.03, 0.04] as const,
        [0, 0, -0.75, 1.7, 0.03, 0.04] as const,
        [-0.85, 1.0, 0, 0.04, 0.03, 1.5] as const,
        [0.85, 1.0, 0, 0.04, 0.03, 1.5] as const,
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial color={INK_SOFT} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 24]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return <Chair key={i} position={[Math.sin(a) * 0.75, 0, Math.cos(a) * 0.75]} rotationY={a} />;
      })}
    </group>
  );
}

function RobotDuo() {
  return (
    <group>
      {/* humanoid-style robot */}
      <group>
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.36, 10]} />
            <meshStandardMaterial color={INK_SOFT} />
          </mesh>
        ))}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.34, 0.4, 0.22]} />
          <meshStandardMaterial color={INK} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0.115]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={1} />
        </mesh>
        {[-0.24, 0.24].map((x) => (
          <mesh key={x} position={[x, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.34, 10]} />
            <meshStandardMaterial color={INK_SOFT} />
          </mesh>
        ))}
        <mesh position={[0, 0.82, 0]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={INK} roughness={0.3} />
        </mesh>
        {[-0.05, 0.05].map((x) => (
          <mesh key={x} position={[x, 0.83, 0.12]}>
            <circleGeometry args={[0.025, 12]} />
            <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={1.2} />
          </mesh>
        ))}
      </group>

      {/* quadruped helper robot beside it */}
      <group position={[0.75, 0, 0.35]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.34, 0.14, 0.18]} />
          <meshStandardMaterial color={INK_SOFT} roughness={0.5} />
        </mesh>
        {[
          [-0.13, -0.08],
          [0.13, -0.08],
          [-0.13, 0.08],
          [0.13, 0.08],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.06, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
            <meshStandardMaterial color={INK} />
          </mesh>
        ))}
        <mesh position={[0.2, 0.2, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={1.2} />
        </mesh>
      </group>
    </group>
  );
}

function HoveringDrone() {
  return (
    <group position={[0, 0.85, 0]}>
      <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.02, 0.03]} />
        <meshStandardMaterial color={INK_SOFT} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.02, 0.03]} />
        <meshStandardMaterial color={INK_SOFT} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.16, 0.07, 0.16]} />
        <meshStandardMaterial color={INK} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.08, 0]} castShadow>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={INK_SOFT} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={1.5} />
      </mesh>
      {[
        [0.28, 0.28],
        [-0.28, 0.28],
        [0.28, -0.28],
        [-0.28, -0.28],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.015, z]}>
          <cylinderGeometry args={[0.16, 0.16, 0.01, 24]} />
          <meshStandardMaterial color={INK} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig() {
  return (
    <group>
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0, 0.28, 0.22]} rotation={[Math.PI / 8, 0, 0]} castShadow>
              <cylinderGeometry args={[0.014, 0.014, 0.58, 8]} />
              <meshStandardMaterial color={INK_SOFT} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.06, 12]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.2, 0.14, 0.16]} />
        <meshStandardMaterial color={INK} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.62, 0.13]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.06, 0.12, 16]} />
        <meshStandardMaterial color={INK_SOFT} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.62, 0.19]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.6} />
      </mesh>
      {/* second camera further back, on a lower mount, to read as a small station */}
      <group position={[-0.75, 0, -0.35]} scale={0.8}>
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[0.2, 0.14, 0.16]} />
          <meshStandardMaterial color={INK} roughness={0.35} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.56, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.06, 12]} />
          <meshStandardMaterial color={INK} />
        </mesh>
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.56, 10]} />
          <meshStandardMaterial color={INK_SOFT} />
        </mesh>
      </group>
    </group>
  );
}

function VizWall() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.2, 1.3, 0.06]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0, 0.9, 0.035]}>
        <planeGeometry args={[2, 1.1]} />
        <meshStandardMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.35} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[-0.75 + i * 0.5, 0.9, 0.04]}>
          <planeGeometry args={[0.02, 0.9]} />
          <meshStandardMaterial color={INK} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- hover-reactive zone wrapper ---------- */

function ZoneGroup({
  id,
  position,
  active,
  onHover,
  onSelect,
  children,
}: {
  id: string;
  position: [number, number, number];
  active: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  // Scale is animated imperatively for a smooth "pop"; opacity is bound
  // declaratively below (see the ring mesh) so it can never drift out of
  // sync with `active` — no per-frame state for it to get stuck in.
  useFrame(() => {
    if (group.current) {
      const target = active ? 1.035 : 1;
      group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(id);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.35, 1.45, 48]} />
        <meshBasicMaterial color={YELLOW} transparent opacity={active ? 0.9 : 0} />
      </mesh>
      {children}
    </group>
  );
}

/* ---------- room shell ---------- */

function Room() {
  return (
    <group>
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial color={PAPER} roughness={1} />
      </mesh>
      <Grid
        position={[0, 0, 0]}
        args={[16, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#00000014"
        sectionSize={2}
        sectionThickness={0.7}
        sectionColor="#00000022"
        fadeDistance={16}
        fadeStrength={1}
        infiniteGrid={false}
      />
      <mesh position={[-8, 1.4, 0]} receiveShadow>
        <boxGeometry args={[0.15, 2.8, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.4, -5]} receiveShadow>
        <boxGeometry args={[16, 2.8, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ---------- scene contents (camera, lights, zones) ---------- */

function SceneContent({
  hovered,
  onHover,
  onSelect,
  autoRotate,
  isMobile,
}: {
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  autoRotate: boolean;
  isMobile: boolean;
}) {
  return (
    <>
      <OrthographicCamera makeDefault position={[9, 8, 9]} zoom={58} near={0.1} far={100} />
      <OrbitControls
        makeDefault
        target={[0, 0.6, 0]}
        enablePan={false}
        enableZoom={true}
        minZoom={38}
        maxZoom={90}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
      />

      <ambientLight intensity={0.65} />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.1}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.25} />

      <Room />

      <ZoneGroup id="computo" position={[-6, 0, -3.3]} active={hovered === "computo"} onHover={onHover} onSelect={onSelect}>
        <ServerRack />
      </ZoneGroup>

      <ZoneGroup id="analisis" position={[-2.2, 0, -3.3]} active={hovered === "analisis"} onHover={onHover} onSelect={onSelect}>
        <WorkstationRow count={4} />
      </ZoneGroup>

      <ZoneGroup id="visualizacion" position={[5.4, 0, -4.55]} active={hovered === "visualizacion"} onHover={onHover} onSelect={onSelect}>
        <VizWall />
      </ZoneGroup>

      <ZoneGroup id="colaboracion" position={[4.6, 0, 1.5]} active={hovered === "colaboracion"} onHover={onHover} onSelect={onSelect}>
        <MeetingPod />
      </ZoneGroup>

      <ZoneGroup id="instrumentacion" position={[-6, 0, 2.6]} active={hovered === "instrumentacion"} onHover={onHover} onSelect={onSelect}>
        <SensorBench />
      </ZoneGroup>

      <ZoneGroup id="robots" position={[1.5, 0, -1]} active={hovered === "robots"} onHover={onHover} onSelect={onSelect}>
        <RobotDuo />
      </ZoneGroup>

      <ZoneGroup id="drones" position={[2, 0, 3.5]} active={hovered === "drones"} onHover={onHover} onSelect={onSelect}>
        <HoveringDrone />
      </ZoneGroup>

      <ZoneGroup id="camaras" position={[-3.2, 0, -0.3]} active={hovered === "camaras"} onHover={onHover} onSelect={onSelect}>
        <CameraRig />
      </ZoneGroup>

      <Plant position={[-7.3, 0, 4.3]} />
      <Plant position={[7, 0, 4.3]} />

      {!isMobile && (
        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={16} blur={2} far={2} />
      )}
    </>
  );
}

export function LabScene() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(labZones[0].id);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobileGPU();

  const active = labZones.find((z) => z.id === (hovered ?? selected)) ?? labZones[0];

  return (
    <div className="relative">
      <div className="relative aspect-[16/10] w-full rounded-[1.75rem] overflow-hidden border border-border-soft bg-background-subtle">
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? [1, 1.5] : [1, 1.75]}
          gl={{ antialias: !isMobile }}
        >
          <Suspense fallback={null}>
            <SceneContent
              hovered={hovered}
              onHover={setHovered}
              onSelect={setSelected}
              autoRotate={!shouldReduceMotion}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 text-[11px] sm:text-xs font-medium text-foreground-secondary bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-border-soft">
          Arrastra para rotar · toca una zona
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {labZones.map((z) => {
          const isActive = z.id === (hovered ?? selected);
          return (
            <button
              key={z.id}
              type="button"
              onMouseEnter={() => setHovered(z.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(z.id)}
              className={`px-4 py-1.5 rounded-full border text-[13px] font-medium transition-colors cursor-pointer min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                isActive ? "border-black text-black bg-yellow/30" : "border-border-strong text-foreground-secondary hover:text-black"
              }`}
            >
              {z.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 p-6 rounded-2xl bg-background-subtle border border-border-soft min-h-[6.5rem]">
        <h3 className="text-lg font-semibold text-black mb-1.5">{active.label}</h3>
        <p className="text-[15px] text-foreground-secondary leading-relaxed">{active.description}</p>
      </div>
    </div>
  );
}
