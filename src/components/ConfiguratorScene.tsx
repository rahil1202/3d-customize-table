/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useConfigStore } from "@/store/configStore";
import { Chair } from "@/components/chairs";
import { Table } from "@/components/tables";
import { useTableDimensions } from "@/components/tables/TableUtils";

// --- Constants & Types ---
export type FocusPart =
  | "table-design"
  | "size"
  | "tabletop"
  | "legs"
  | "finish"
  | "chairs"
  | "scene"
  | null;

// --- Helper Hooks ---

// ChairsLayout now uses the imported modular Chair component
function ChairsLayout() {
  const { length, width } = useTableDimensions();
  const sizePreset = useConfigStore((s) => s.sizePreset);
  const endOffset = length / 2 + 0.35;
  const sideOffset = width / 2 + 0.35;

  const chairs = useMemo(() => {
    const list: {
      pos: [number, number, number];
      rot: [number, number, number];
    }[] = [];
    list.push({ pos: [-endOffset, 0, 0], rot: [0, Math.PI / 2, 0] });
    list.push({ pos: [endOffset, 0, 0], rot: [0, -Math.PI / 2, 0] });

    if (sizePreset === "4_seater") {
      list.push({ pos: [0, 0, sideOffset], rot: [0, Math.PI, 0] });
      list.push({ pos: [0, 0, -sideOffset], rot: [0, 0, 0] });
    } else if (sizePreset === "6_seater") {
      [-0.35, 0.35].forEach((x) => {
        list.push({ pos: [x, 0, sideOffset], rot: [0, Math.PI, 0] });
        list.push({ pos: [x, 0, -sideOffset], rot: [0, 0, 0] });
      });
    } else {
      [-0.6, 0, 0.6].forEach((x) => {
        list.push({ pos: [x, 0, sideOffset], rot: [0, Math.PI, 0] });
        list.push({ pos: [x, 0, -sideOffset], rot: [0, 0, 0] });
      });
    }
    return list;
  }, [sizePreset, endOffset, sideOffset]);

  return (
    <group>
      {chairs.map((c, i) => (
        <Chair key={i} position={c.pos} rotation={c.rot} />
      ))}
    </group>
  );
}

// --- Camera Logic ---

function CameraController({ focusPart }: { focusPart: FocusPart }) {
  const { camera, controls } = useThree() as any;
  const { resetKey } = useConfigStore();

  const vec = new THREE.Vector3();
  const targetVec = new THREE.Vector3();

  // Reset Logic
  useEffect(() => {
    if (controls) {
      controls.reset();
      // Manually set camera to default position
      camera.position.set(3, 2.5, 3);
      controls.target.set(0, 0.5, 0);
    }
  }, [resetKey, controls, camera]);

  // Define target positions based on selection
  const targets = useMemo(() => {
    return {
      default: { pos: [3, 2.5, 3], look: [0, 0.5, 0] },
      tabletop: { pos: [0, 2.2, 0.1], look: [0, 0, 0] },
      chairs: { pos: [1.8, 1.2, 0.8], look: [0, 0.6, 0] },
      finish: { pos: [0.8, 1.2, 0.8], look: [0, 0.76, 0] },
      scene: { pos: [4, 3, 4], look: [0, 0.2, 0] },
    };
  }, []);

  useFrame((state, delta) => {
    if (focusPart) {
      const dest = targets[focusPart] || targets.default;
      // Smoothly interpolate Camera Position
      vec.set(dest.pos[0], dest.pos[1], dest.pos[2]);
      camera.position.lerp(vec, 2.5 * delta);

      // Smoothly interpolate OrbitControls Target
      if (controls) {
        targetVec.set(dest.look[0], dest.look[1], dest.look[2]);
        controls.target.lerp(targetVec, 2.5 * delta);
        controls.update();
      }
    }
  });

  return null;
}

// --- Main Scene ---

export function ConfiguratorScene({ focusPart }: { focusPart: FocusPart }) {
  const { scene } = useConfigStore();

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2.5, 3], fov: 45 }}>
      {/* Background changes based on environment preset */}
      <color
        attach="background"
        args={[scene.environment === "studio" ? "#f0f0f0" : "#202020"]}
      />

      <ambientLight intensity={scene.environment === "night" ? 0.2 : 0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={scene.environment === "night" ? 0.3 : 1.2}
        castShadow
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5]} />
      </directionalLight>

      {/* Ground Plane */}
      <group position={[0, -0.01, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color={scene.environment === "studio" ? "#ffffff" : "#333333"}
            roughness={0.8}
          />
        </mesh>
        <ContactShadows
          resolution={1024}
          scale={10}
          blur={2}
          opacity={0.4}
          far={1}
          color="#000000"
        />
      </group>

      {/* Modular Table Component */}
      <Table />

      <ChairsLayout />

      <Environment
        preset={scene.environment}
        blur={0.8}
        background={scene.environment !== "studio"}
      />

      <CameraController focusPart={focusPart} />

      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.05}
        enablePan={false}
      />
    </Canvas>
  );
}
