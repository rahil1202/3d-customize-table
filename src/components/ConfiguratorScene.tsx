/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { useConfigStore } from "@/store/configStore";
import { Chair } from "@/components/chairs";
import { getTableTopById } from "@/config/tableTopCatalog";

// --- Constants & Types ---
const TABLE_HEIGHT = 0.76;

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

function useTableDimensions() {
  const sizePreset = useConfigStore((s) => s.sizePreset);
  return useMemo(() => {
    if (sizePreset === "4_seater")
      return { length: 1.4, width: 0.9, thickness: 0.04, legInset: 0.15 };
    if (sizePreset === "6_seater")
      return { length: 2.0, width: 1.0, thickness: 0.05, legInset: 0.25 };
    return { length: 2.6, width: 1.1, thickness: 0.05, legInset: 0.35 };
  }, [sizePreset]);
}

function useMaterials() {
  const { selectedTableTopId, woodMaterial } = useConfigStore((s) => s);

  const marble = useMemo(() => {
    // Get the selected table top from the catalog
    const tableTopDef = getTableTopById(selectedTableTopId);
    const baseColor = tableTopDef?.baseColor || "#e8e8e8";

    return {
      color: baseColor,
      roughness: 0.05, // Polished
      metalness: 0.1,
      envMapIntensity: 1.0,
    };
  }, [selectedTableTopId]);

  const wood = useMemo(() => {
    const colors: Record<string, string> = {
      natural: "#dcb27e",
      walnut_dark: "#5c4033",
      oak_light: "#e0cda7",
      espresso: "#2b1d16",
      charcoal: "#2f2f2f",
    };
    return {
      color: colors[woodMaterial.color] || "#dcb27e",
      roughness: 0.3,
      metalness: 0.0,
      envMapIntensity: 0.5,
    };
  }, [woodMaterial]);

  return { marble, wood };
}

// --- Components ---

function TableTop() {
  const { marbleShape } = useConfigStore((s) => s);
  const { length, width, thickness } = useTableDimensions();
  const { marble } = useMaterials();

  // Create shapes using 2D geometry to prevent height bulging
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = width / 2;
    const l = length / 2;

    if (marbleShape.shape === "rectangle") {
      s.moveTo(-l, -w);
      s.lineTo(l, -w);
      s.lineTo(l, w);
      s.lineTo(-l, w);
      s.lineTo(-l, -w);
    } else if (marbleShape.shape === "rounded_rectangle") {
      const r = 0.15; // Corner radius
      s.moveTo(-l + r, -w);
      s.lineTo(l - r, -w);
      s.quadraticCurveTo(l, -w, l, -w + r);
      s.lineTo(l, w - r);
      s.quadraticCurveTo(l, w, l - r, w);
      s.lineTo(-l + r, w);
      s.quadraticCurveTo(-l, w, -l, w - r);
      s.lineTo(-l, -w + r);
      s.quadraticCurveTo(-l, -w, -l + r, -w);
    } else if (marbleShape.shape === "oval") {
      s.ellipse(0, 0, l, w, 0, Math.PI * 2, false, 0);
    } else if (marbleShape.shape === "boat") {
      s.moveTo(-l, -w * 0.7);
      s.quadraticCurveTo(0, -w, l, -w * 0.7);
      s.lineTo(l, w * 0.7);
      s.quadraticCurveTo(0, w, -l, w * 0.7);
      s.lineTo(-l, -w * 0.7);
    } else if (marbleShape.shape === "soft_organic") {
      // Asymmetric bean-like shape
      s.moveTo(-l, -w * 0.5);
      s.bezierCurveTo(-l * 0.5, -w * 1.2, l * 0.5, -w, l, -w * 0.6);
      s.bezierCurveTo(l * 1.1, -w * 0.2, l, w * 0.8, l * 0.4, w);
      s.bezierCurveTo(-l * 0.2, w * 0.8, -l * 0.8, w * 1.1, -l, w * 0.6);
      s.lineTo(-l, -w * 0.5);
    }
    return s;
  }, [marbleShape.shape, length, width]);

  return (
    <group position={[0, TABLE_HEIGHT, 0]}>
      {/* Rotate -90deg on X to lay flat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: thickness,
              bevelEnabled: true,
              bevelSize: 0.005,
              bevelThickness: 0.005,
              steps: 2,
            },
          ]}
        />
        {/* We move geometry down by thickness to align top surface with 0 local Y */}
        <meshStandardMaterial {...marble} />
      </mesh>
    </group>
  );
}

function TableLegs() {
  const { length, width, legInset } = useTableDimensions();
  const { wood } = useMaterials();
  const { tableDesign } = useConfigStore((s) => s);

  const legH = TABLE_HEIGHT;
  const legW = 0.08;
  const x = length / 2 - legInset;
  const z = width / 2 - legInset;

  if (tableDesign.style === "modern_slab_leg") {
    return (
      <group>
        {[-1, 1].map((dir) => (
          <RoundedBox
            key={dir}
            args={[0.08, legH, width * 0.7]}
            radius={0.01}
            position={[dir * (length / 2 - 0.3), legH / 2, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial {...wood} />
          </RoundedBox>
        ))}
        <RoundedBox
          args={[length - 0.6, 0.1, 0.05]}
          radius={0.01}
          position={[0, legH - 0.1, 0]}
          castShadow
        >
          <meshStandardMaterial {...wood} />
        </RoundedBox>
      </group>
    );
  }

  if (tableDesign.style === "cross_trestle") {
    const angle = Math.PI / 6;
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (length / 2 - 0.35), 0, 0]}>
            <mesh
              rotation={[angle, 0, 0]}
              position={[0, legH / 2, 0]}
              castShadow
            >
              <boxGeometry args={[legW, legH * 1.1, legW]} />
              <meshStandardMaterial {...wood} />
            </mesh>
            <mesh
              rotation={[-angle, 0, 0]}
              position={[0, legH / 2, 0]}
              castShadow
            >
              <boxGeometry args={[legW, legH * 1.1, legW]} />
              <meshStandardMaterial {...wood} />
            </mesh>
          </group>
        ))}
        <RoundedBox
          args={[length * 0.7, 0.05, 0.05]}
          position={[0, legH * 0.4, 0]}
          castShadow
        >
          <meshStandardMaterial {...wood} />
        </RoundedBox>
      </group>
    );
  }

  return (
    <group>
      {[
        [-x, -z],
        [x, -z],
        [-x, z],
        [x, z],
      ].map(([px, pz], i) => (
        <group key={i} position={[px, legH / 2, pz]}>
          <RoundedBox
            args={[legW, legH, legW]}
            radius={0.01}
            smoothness={4}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial {...wood} />
          </RoundedBox>
        </group>
      ))}
      <group position={[0, legH - 0.06, 0]}>
        <mesh position={[0, 0, z]} castShadow>
          <boxGeometry args={[length - legInset, 0.08, 0.02]} />
          <meshStandardMaterial {...wood} />
        </mesh>
        <mesh position={[0, 0, -z]} castShadow>
          <boxGeometry args={[length - legInset, 0.08, 0.02]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      </group>
    </group>
  );
}

// ChairsLayout now uses the imported modular Chair component
function ChairsLayout() {
  const { length, width } = useTableDimensions();
  const { sizePreset } = useConfigStore((s) => s);
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

      <TableTop />
      <TableLegs />
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
