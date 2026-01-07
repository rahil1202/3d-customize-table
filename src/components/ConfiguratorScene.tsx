/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  ContactShadows, 
  Environment, 
  RoundedBox, 
} from "@react-three/drei";
import * as THREE from "three";
import { useConfigStore } from "@/store/configStore";

// --- Constants & Types ---
const TABLE_HEIGHT = 0.76; 
const SEAT_HEIGHT = 0.46;

export type FocusPart = "table-design" | "size" | "tabletop" | "legs" | "finish" | "chairs" | "structural" | "scene" | null;

// --- Helper Hooks ---

function useTableDimensions() {
  const sizePreset = useConfigStore((s) => s.sizePreset);
  return useMemo(() => {
    if (sizePreset === "4_seater") return { length: 1.4, width: 0.9, thickness: 0.04, legInset: 0.15 };
    if (sizePreset === "6_seater") return { length: 2.0, width: 1.0, thickness: 0.05, legInset: 0.25 };
    return { length: 2.6, width: 1.1, thickness: 0.05, legInset: 0.35 }; 
  }, [sizePreset]);
}

function useMaterials() {
  const { marbleMaterial, woodMaterial, leather } = useConfigStore((s) => s);

  const marble = useMemo(() => {
    const colors: Record<string, string> = {
      white_carrara: "#f2f2f2",
      beige_cream: "#eaddcf",
      grey_veined: "#b3b3b3",
      black_marble: "#1a1a1a",
      green_exotic: "#2e3b32",
    };
    const isPolished = marbleMaterial.finish === "polished";
    return {
      color: colors[marbleMaterial.color] || "#e8e8e8",
      roughness: isPolished ? 0.05 : 0.35,
      metalness: 0.1,
      envMapIntensity: isPolished ? 1.2 : 0.6,
    };
  }, [marbleMaterial]);

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
      roughness: woodMaterial.finish === "matte" ? 0.8 : 0.3,
      metalness: 0.0,
      envMapIntensity: 0.5,
    };
  }, [woodMaterial]);

  const leatherProps = useMemo(() => {
    const colors: Record<string, string> = {
      black: "#111",
      tan: "#b07b48",
      brown: "#5d3a29",
      grey: "#5e6369",
      white: "#f0f0f0",
      olive: "#555d40",
    };
    return {
      color: colors[leather.color] || "#111",
      roughness: leather.finish === "smooth" ? 0.45 : 0.85,
      metalness: 0.05,
      envMapIntensity: 0.6,
    };
  }, [leather]);

  return { marble, wood, leather: leatherProps };
}

// --- Components ---

function TableTop() {
  const { marbleShape } = useConfigStore((s) => s);
  const { length, width, thickness } = useTableDimensions();
  const { marble } = useMaterials();

  const radius = useMemo(() => {
    if (marbleShape.shape === "oval") return width / 2;
    if (marbleShape.shape === "rounded_rectangle") return 0.15;
    if (marbleShape.shape === "soft_organic") return 0.3; 
    return 0.01; 
  }, [marbleShape.shape, width]);

  return (
    <group position={[0, TABLE_HEIGHT - thickness / 2, 0]}>
      <RoundedBox args={[length, thickness, width]} radius={radius} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial {...marble} />
      </RoundedBox>
    </group>
  );
}

function TableLegs() {
  const { length, width, legInset } = useTableDimensions();
  const { wood } = useMaterials();
  const { structural, tableDesign } = useConfigStore((s) => s);

  const legH = TABLE_HEIGHT - 0.04; 
  const legW = structural.legThickness === "slim" ? 0.05 : structural.legThickness === "thick" ? 0.12 : 0.08;
  const x = length / 2 - legInset;
  const z = width / 2 - legInset;

  if (tableDesign.style === "modern_slab_leg") {
    return (
      <group>
        {[-1, 1].map((dir) => (
           <RoundedBox key={dir} args={[0.08, legH, width * 0.7]} radius={0.01} position={[dir * (length / 2 - 0.3), legH / 2, 0]} castShadow receiveShadow>
             <meshStandardMaterial {...wood} />
           </RoundedBox>
        ))}
        <RoundedBox args={[length - 0.6, 0.1, 0.05]} radius={0.01} position={[0, legH - 0.1, 0]} castShadow>
             <meshStandardMaterial {...wood} />
        </RoundedBox>
      </group>
    )
  }

  if (tableDesign.style === "cross_trestle") {
     const angle = Math.PI / 6;
     return (
        <group>
            {[-1, 1].map((side) => (
                <group key={side} position={[side * (length/2 - 0.35), 0, 0]}>
                    <mesh rotation={[angle, 0, 0]} position={[0, legH/2, 0]} castShadow>
                        <boxGeometry args={[legW, legH * 1.1, legW]} />
                        <meshStandardMaterial {...wood} />
                    </mesh>
                    <mesh rotation={[-angle, 0, 0]} position={[0, legH/2, 0]} castShadow>
                        <boxGeometry args={[legW, legH * 1.1, legW]} />
                        <meshStandardMaterial {...wood} />
                    </mesh>
                </group>
            ))}
             <RoundedBox args={[length * 0.7, 0.05, 0.05]} position={[0, legH * 0.4, 0]} castShadow>
                 <meshStandardMaterial {...wood} />
             </RoundedBox>
        </group>
     )
  }

  return (
    <group>
      {[[-x, -z], [x, -z], [-x, z], [x, z]].map(([px, pz], i) => (
        <group key={i} position={[px, legH / 2, pz]}>
          <RoundedBox args={[legW, legH, legW]} radius={structural.legThickness === "thick" ? 0.04 : 0.01} smoothness={4} castShadow receiveShadow>
            <meshStandardMaterial {...wood} />
          </RoundedBox>
          {structural.footCapMaterial === "metal" && (
            <mesh position={[0, -legH/2 + 0.02, 0]}>
                <cylinderGeometry args={[legW * 0.55, legW * 0.55, 0.04, 32]} />
                <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
            </mesh>
          )}
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

function Chair({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
  const { chair } = useConfigStore((s) => s);
  const { wood, leather } = useMaterials();

  const seatDepth = 0.45;
  const seatWidth = 0.45;
  const backHeight = chair.style === "high_back" ? 0.6 : 0.4;
  const legThick = 0.035;

  if (chair.style === "bench") return null; 

  return (
    <group position={position} rotation={rotation as any}>
      <RoundedBox args={[seatWidth, 0.06, seatDepth]} radius={0.02} position={[0, SEAT_HEIGHT, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...leather} />
      </RoundedBox>
      <group position={[0, SEAT_HEIGHT + backHeight/2 + 0.02, -seatDepth/2 + 0.02]}>
          <RoundedBox args={[seatWidth, backHeight, 0.04]} radius={0.02} castShadow>
             <meshStandardMaterial {...leather} /> 
          </RoundedBox>
      </group>
      <group>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([mx, mz], i) => (
             <mesh key={i} position={[mx * (seatWidth/2 - 0.03), SEAT_HEIGHT/2, mz * (seatDepth/2 - 0.03)]} castShadow>
                 <boxGeometry args={[legThick, SEAT_HEIGHT, legThick]} />
                 <meshStandardMaterial {...wood} />
             </mesh>
        ))}
      </group>
      {(chair.armrestStyle === "slim" || chair.armrestStyle === "full") && (
         <>
            {[-1, 1].map((side) => (
                <mesh key={side} position={[side * (seatWidth/2), SEAT_HEIGHT + 0.15, 0]} castShadow>
                     <boxGeometry args={[0.04, 0.03, seatDepth]} />
                     <meshStandardMaterial {...wood} />
                </mesh>
            ))}
         </>
      )}
    </group>
  );
}

function ChairsLayout() {
  const { length, width } = useTableDimensions();
  const { sizePreset } = useConfigStore((s) => s);
  const endOffset = length / 2 + 0.35; 
  const sideOffset = width / 2 + 0.35; 

  const chairs = useMemo(() => {
     const list: { pos: [number, number, number], rot: [number, number, number] }[] = [];
     list.push({ pos: [-endOffset, 0, 0], rot: [0, Math.PI / 2, 0] });
     list.push({ pos: [endOffset, 0, 0], rot: [0, -Math.PI / 2, 0] });

     if (sizePreset === "4_seater") {
        list.push({ pos: [0, 0, sideOffset], rot: [0, Math.PI, 0] });
        list.push({ pos: [0, 0, -sideOffset], rot: [0, 0, 0] });
     } else if (sizePreset === "6_seater") {
        [-0.35, 0.35].forEach(x => {
             list.push({ pos: [x, 0, sideOffset], rot: [0, Math.PI, 0] });
             list.push({ pos: [x, 0, -sideOffset], rot: [0, 0, 0] });
        });
     } else {
         [-0.6, 0, 0.6].forEach(x => {
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
  )
}

// --- Camera Logic (The Glue) ---

function CameraController({ focusPart, resetKey }: { focusPart: FocusPart; resetKey: number }) {
  const { camera, controls } = useThree() as any;
  const vec = new THREE.Vector3();
  const targetVec = new THREE.Vector3();

  // Define target positions based on selection
  const targets = useMemo(() => {
    return {
      default: { pos: [3, 2.5, 3], look: [0, 0.5, 0] },
      tabletop: { pos: [0, 2.2, 0.1], look: [0, 0, 0] }, // Top-down
      legs: { pos: [1.5, 0.5, 1.5], look: [0, 0.4, 0] }, // Low Angle
      structural: { pos: [1.5, 0.4, 1.5], look: [0, 0.3, 0] }, // Even lower
      chairs: { pos: [1.8, 1.2, 0.8], look: [0, 0.6, 0] }, // Side view
      finish: { pos: [0.8, 1.2, 0.8], look: [0, 0.76, 0] }, // Close up on surface
      scene: { pos: [4, 3, 4], look: [0, 0.2, 0] } // Wide shot
    };
  }, []);

  useFrame((state, delta) => {
    // Determine where we want to go
    const dest = focusPart && targets[focusPart] ? targets[focusPart] : targets.default;

    // Smoothly interpolate Camera Position
    vec.set(dest.pos[0], dest.pos[1], dest.pos[2]);
    camera.position.lerp(vec, 2.5 * delta); // Adjust speed factor (2.5) as needed

    // Smoothly interpolate OrbitControls Target
    if (controls) {
      targetVec.set(dest.look[0], dest.look[1], dest.look[2]);
      controls.target.lerp(targetVec, 2.5 * delta);
      controls.update();
    }
  });

  return null;
}

// --- Main Scene ---

export function ConfiguratorScene({ focusPart, resetKey }: { focusPart: FocusPart; resetKey: number }) {
  const { scene } = useConfigStore((s) => s);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2.5, 3], fov: 45 }}>
      <color attach="background" args={[scene.background === "studio" ? "#f0f0f0" : "#e4e0d8"]} />
      
      <ambientLight intensity={scene.lightingMood === "warm_indoor" ? 0.4 : 0.6} />
      <directionalLight 
        position={[5, 8, 5]} 
        intensity={scene.lightingMood === "warm_indoor" ? 0.8 : 1.2} 
        castShadow 
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5]} />
      </directionalLight>

      <spotLight position={[-5, 5, -5]} intensity={0.5} color={scene.lightingMood === "warm_indoor" ? "#ffdcb4" : "#ffffff"} />

      <group position={[0, -0.01, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color={scene.background === "studio" ? "#ffffff" : "#d8d4cd"} roughness={0.8} />
        </mesh>
        <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.4} far={1} color="#000000" />
      </group>

      <TableTop />
      <TableLegs />
      <ChairsLayout />

      <Environment preset={scene.lightingMood === "warm_indoor" ? "apartment" : "studio"} blur={0.8} />
      
      {/* This component handles the smooth camera transition based on UI clicks */}
      <CameraController focusPart={focusPart} resetKey={resetKey} />
      
      <OrbitControls 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2 - 0.05} 
        enablePan={false}
      />
    </Canvas>
  );
}