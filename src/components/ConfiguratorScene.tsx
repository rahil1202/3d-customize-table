import { ReactNode, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { useConfigStore } from "@/store/configStore";

// Debug flag for targeted Zustand + scene diagnostics (set to true when investigating loops)
const DEBUG_CONFIG = false;

function logDebug(tag: string, payload: unknown) {
  if (DEBUG_CONFIG) {
    // eslint-disable-next-line no-console
    console.log(`[ConfiguratorScene:${tag}]`, payload);
  }
}

// External FocusPart type so the rest of the app compiles
export type FocusPart = "table-design" | "size" | "tabletop" | "legs" | "finish" | "chairs" | "scene" | null;

// The scene reads from the Zustand store ONLY (no writes) using
// small, memoized selectors to avoid unnecessary renders.

const TABLE_HEIGHT = 0.75;

function useTableDimensions() {
  const sizePreset = useConfigStore((s) => s.sizePreset);

  return useMemo(() => {
    const dims =
      sizePreset === "4_seater"
        ? { length: 1.4, width: 0.8, thickness: 0.06, legInset: 0.12 }
        : sizePreset === "6_seater"
          ? { length: 1.8, width: 0.9, thickness: 0.07, legInset: 0.14 }
          : { length: 2.2, width: 1.0, thickness: 0.08, legInset: 0.16 };

    logDebug("useTableDimensions", { sizePreset, dims });
    return dims;
  }, [sizePreset]);
}

function useMarbleMaterialProps() {
  const marbleMaterial = useConfigStore((s) => s.marbleMaterial);

  return useMemo(() => {
    let base = { colorHex: "#f5f5f5", roughness: 0.25, metalness: 0.05 };

    switch (marbleMaterial.color) {
      case "white_carrara":
        base = { colorHex: "#f5f5f5", roughness: 0.25, metalness: 0.05 };
        break;
      case "beige_cream":
        base = { colorHex: "#e3d3c4", roughness: 0.3, metalness: 0.04 };
        break;
      case "grey_veined":
        base = { colorHex: "#b0b0b5", roughness: 0.28, metalness: 0.05 };
        break;
      case "black_marble":
        base = { colorHex: "#26262b", roughness: 0.22, metalness: 0.06 };
        break;
      case "green_exotic":
      default:
        base = { colorHex: "#2f3f36", roughness: 0.27, metalness: 0.05 };
        break;
    }

    const finishOffset =
      marbleMaterial.finish === "polished" ? -0.08 : marbleMaterial.finish === "honed" ? 0.08 : 0.12;

    const material = {
      colorHex: base.colorHex,
      roughness: Math.min(1, Math.max(0, base.roughness + finishOffset)),
      metalness: base.metalness,
    };

    logDebug("useMarbleMaterialProps", { marbleMaterial, material });
    return material;
  }, [marbleMaterial.color, marbleMaterial.finish]);
}

function useWoodMaterialProps() {
  const woodMaterial = useConfigStore((s) => s.woodMaterial);

  return useMemo(() => {
    let base = { colorHex: "#c89b62", roughness: 0.5 };

    switch (woodMaterial.color) {
      case "natural":
        base = { colorHex: "#c89b62", roughness: 0.5 };
        break;
      case "walnut_dark":
        base = { colorHex: "#5a3a22", roughness: 0.48 };
        break;
      case "oak_light":
        base = { colorHex: "#ddba80", roughness: 0.52 };
        break;
      case "espresso":
        base = { colorHex: "#2c1b16", roughness: 0.46 };
        break;
      case "charcoal":
      default:
        base = { colorHex: "#282828", roughness: 0.48 };
        break;
    }

    const sheenOffset = woodMaterial.finish === "matte" ? 0.08 : woodMaterial.finish === "semi_gloss" ? -0.12 : -0.04;

    return {
      colorHex: base.colorHex,
      roughness: Math.min(1, Math.max(0.25, base.roughness + sheenOffset)),
      metalness: 0.18,
    };
  }, [woodMaterial.color, woodMaterial.finish]);
}

function useLeatherMaterialProps() {
  const leather = useConfigStore((s) => s.leather);

  return useMemo(() => {
    let colorHex = "#c19a6b";

    switch (leather.color) {
      case "black":
        colorHex = "#111111";
        break;
      case "tan":
        colorHex = "#c19a6b";
        break;
      case "brown":
        colorHex = "#4b2e2a";
        break;
      case "grey":
        colorHex = "#555555";
        break;
      case "white":
        colorHex = "#f5f5f5";
        break;
      case "olive":
      default:
        colorHex = "#4b5b3b";
        break;
    }

    const roughnessBase =
      leather.finish === "smooth" ? 0.55 : leather.finish === "grained" ? 0.7 : 0.8;

    const material = {
      colorHex,
      roughness: roughnessBase,
      metalness: 0.04,
    };

    logDebug("useLeatherMaterialProps", { leather, material });
    return material;
  }, [leather.color, leather.finish]);
}

function useSceneProps() {
  const scene = useConfigStore((s) => s.scene);

  return useMemo(() => {
    const isWarm = scene.lightingMood === "warm_indoor";

    const props = {
      backgroundColor: scene.background === "studio" ? "#f4f3f7" : "#f0ece5",
      ambientIntensity: isWarm ? 0.55 : 0.6,
      directionalIntensity: isWarm ? 0.95 : 1.05,
      shadowOpacity: scene.shadowIntensity === "low" ? 0.22 : 0.32,
      cameraHeightOffset: isWarm ? 0.08 : 0,
    } as const;

    logDebug("useSceneProps", { scene, props });
    return props;
  }, [scene.lightingMood, scene.background, scene.shadowIntensity]);
}

function StaticMaterial({ color, roughness, metalness }: { color: string; roughness: number; metalness: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function TableTop() {
  const marbleShape = useConfigStore((s) => s.marbleShape);
  const { length, width, thickness } = useTableDimensions();
  const marble = useMarbleMaterialProps();

  const cornerRadiusFactor =
    marbleShape.cornerRadius === "high" ? 0.18 : marbleShape.cornerRadius === "medium" ? 0.12 : 0.06;

  const overhangExtra = marbleShape.overhangDepth === "extended" ? 0.08 : 0;

  const l = length + overhangExtra;
  const w = width + overhangExtra * 0.6;

  // For now we approximate shapes using basic primitives:
  // - oval -> cylinder
  // - others -> box, with radius hint only in dimensions

  if (marbleShape.shape === "oval") {
    return (
      <mesh position={[0, TABLE_HEIGHT, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w / 2, w / 2, thickness, 64]} />
        <StaticMaterial color={marble.colorHex} roughness={marble.roughness} metalness={marble.metalness} />
      </mesh>
    );
  }

  // "rounded" styles just slightly expand dimensions to imply softer corners.
  const lengthWithRadius = l + cornerRadiusFactor * 0.1;
  const widthWithRadius = w + cornerRadiusFactor * 0.1;

  return (
    <mesh position={[0, TABLE_HEIGHT, 0]} castShadow receiveShadow>
      <boxGeometry args={[lengthWithRadius, thickness, widthWithRadius]} />
      <StaticMaterial color={marble.colorHex} roughness={marble.roughness} metalness={marble.metalness} />
    </mesh>
  );
}

function TableBase() {
  const { length, width, thickness, legInset } = useTableDimensions();
  const wood = useWoodMaterialProps();
  const structural = useConfigStore((s) => s.structural);

  // Slightly slimmer legs with more refined proportions
  const legThickness = 0.07;
  const legHeight = TABLE_HEIGHT - thickness; // let the top visually sit on the legs

  const x = length / 2 - legInset;
  const z = width / 2 - legInset;

  const legPositions: [number, number, number][] = [
    [-x, legHeight / 2, -z],
    [x, legHeight / 2, -z],
    [-x, legHeight / 2, z],
    [x, legHeight / 2, z],
  ];

  const apronHeight = thickness * 0.6;
  const apronYOffset = TABLE_HEIGHT - thickness - apronHeight / 2;

  const useMetal = structural.footCapMaterial === "metal";
  const metalMaterial = {
    colorHex: "#a3a7af",
    roughness: 0.3,
    metalness: 0.85,
  };

  const stretcherMaterial = useMetal ? metalMaterial : wood;

  const showStraightStretcher = structural.stretcherStyle === "straight";
  const showCrossStretcher = structural.stretcherStyle === "cross";

  const stretcherY = legHeight * 0.35;

  return (
    <group>
      {/* Corner legs with optional metal foot caps */}
      {legPositions.map((pos, idx) => (
        <group key={idx} position={pos} castShadow receiveShadow>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[legThickness, legHeight, legThickness]} />
            <StaticMaterial
              color={wood.colorHex}
              roughness={wood.roughness}
              metalness={wood.metalness}
            />
          </mesh>

          {useMetal && (
            <mesh position={[0, -legHeight / 2 + 0.015, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[legThickness * 0.7, legThickness * 0.7, 0.03, 24]} />
              <StaticMaterial
                color={metalMaterial.colorHex}
                roughness={metalMaterial.roughness}
                metalness={metalMaterial.metalness}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Long aprons */}
      <mesh position={[0, apronYOffset, -z]} castShadow receiveShadow>
        <boxGeometry args={[length - legInset * 1.6, apronHeight, legThickness * 0.7]} />
        <StaticMaterial
          color={wood.colorHex}
          roughness={wood.roughness}
          metalness={wood.metalness}
        />
      </mesh>
      <mesh position={[0, apronYOffset, z]} castShadow receiveShadow>
        <boxGeometry args={[length - legInset * 1.6, apronHeight, legThickness * 0.7]} />
        <StaticMaterial
          color={wood.colorHex}
          roughness={wood.roughness}
          metalness={wood.metalness}
        />
      </mesh>

      {/* Optional stretcher bars for a more grounded, premium base */}
      {showStraightStretcher && (
        <mesh position={[0, stretcherY, 0]} castShadow receiveShadow>
          <boxGeometry args={[length - legInset * 1.8, legThickness * 0.45, legThickness * 0.9]} />
          <StaticMaterial
            color={stretcherMaterial.colorHex}
            roughness={stretcherMaterial.roughness}
            metalness={stretcherMaterial.metalness}
          />
        </mesh>
      )}

      {showCrossStretcher && (
        <group position={[0, stretcherY, 0]} castShadow receiveShadow>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[length - legInset * 1.8, legThickness * 0.45, legThickness * 0.7]} />
            <StaticMaterial
              color={stretcherMaterial.colorHex}
              roughness={stretcherMaterial.roughness}
              metalness={stretcherMaterial.metalness}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[width - legInset * 1.8, legThickness * 0.45, legThickness * 0.7]} />
            <StaticMaterial
              color={stretcherMaterial.colorHex}
              roughness={stretcherMaterial.roughness}
              metalness={stretcherMaterial.metalness}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  const chair = useConfigStore((s) => s.chair);
  const leatherConfig = useConfigStore((s) => s.leather);
  const leather = useLeatherMaterialProps();
  const wood = useWoodMaterialProps();

  if (DEBUG_CONFIG) {
    logDebug("Chair:render", { chairStyle: chair.style, leatherConfig, position });
  }

  const seatHeight = 0.46;
  const baseSeatDepth = 0.45;
  const baseSeatWidth = 0.42;

  const paddingScale =
    leatherConfig.seatPadding === "slim" ? 0.9 : leatherConfig.seatPadding === "plush" ? 1.15 : 1;
  const seatDepth = baseSeatDepth * paddingScale;
  const seatWidth = baseSeatWidth * paddingScale;

  const seatThickness =
    leatherConfig.cushionFirmness === "soft"
      ? 0.08
      : leatherConfig.cushionFirmness === "firm"
        ? 0.05
        : 0.065;

  const backHeightExtra =
    chair.style === "high_back" ? 0.25 : chair.style === "low_back" ? -0.1 : 0;

  const backAngle = -Math.PI / 14; // slight recline for a more natural posture
  const backHeight = 0.5 + backHeightExtra;

  const legThickness = 0.035;
  const legHeight = seatHeight - 0.02;

  return (
    <group position={position} castShadow receiveShadow>
      {/* Seat */}
      <mesh position={[0, seatHeight, 0]} castShadow receiveShadow>
        <boxGeometry args={[seatWidth, seatThickness, seatDepth]} />
        <StaticMaterial
          color={leather.colorHex}
          roughness={leather.roughness}
          metalness={leather.metalness}
        />
      </mesh>

      {/* Backrest */}
      <mesh
        position={[0, seatHeight + backHeight / 2 + 0.05, -seatDepth / 2 + 0.03]}
        rotation={[backAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[seatWidth * 0.9, backHeight, 0.06]} />
        <StaticMaterial
          color={leather.colorHex}
          roughness={leather.roughness}
          metalness={leather.metalness}
        />
      </mesh>

      {/* Legs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], idx) => (
        <mesh
          key={idx}
          position={[(x * seatWidth) / 2.1, legHeight / 2, (z * seatDepth) / 2.1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[legThickness, legHeight, legThickness]} />
          <StaticMaterial
            color={wood.colorHex}
            roughness={wood.roughness}
            metalness={wood.metalness}
          />
        </mesh>
      ))}

      {/* Low connecting rails to make the base feel more solid */}
      <mesh position={[0, legHeight * 0.35, seatDepth / 2.2]} castShadow receiveShadow>
        <boxGeometry args={[seatWidth * 0.8, legThickness * 0.7, legThickness]} />
        <StaticMaterial
          color={wood.colorHex}
          roughness={wood.roughness}
          metalness={wood.metalness}
        />
      </mesh>
      <mesh position={[0, legHeight * 0.35, -seatDepth / 2.2]} castShadow receiveShadow>
        <boxGeometry args={[seatWidth * 0.8, legThickness * 0.7, legThickness]} />
        <StaticMaterial
          color={wood.colorHex}
          roughness={wood.roughness}
          metalness={wood.metalness}
        />
      </mesh>
      <mesh position={[seatWidth / 2.2, legHeight * 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThickness, legThickness * 0.7, seatDepth * 0.8]} />
        <StaticMaterial
          color={wood.colorHex}
          roughness={wood.roughness}
          metalness={wood.metalness}
        />
      </mesh>
      <mesh position={[-seatWidth / 2.2, legHeight * 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThickness, legThickness * 0.7, seatDepth * 0.8]} />
        <StaticMaterial
          color={wood.colorHex}
          roughness={wood.roughness}
          metalness={wood.metalness}
        />
      </mesh>
    </group>
  );
}

function ChairsGroup() {
  const { length, width } = useTableDimensions();
  const sizePreset = useConfigStore((s) => s.sizePreset);

  const offset = width / 2 + 0.35;
  const sideOffset = length / 2 - 0.45;

  const chairsForSize = (): [number, number, number][] => {
    if (sizePreset === "4_seater") {
      return [
        [0, 0, -offset],
        [0, 0, offset],
        [-sideOffset, 0, 0],
        [sideOffset, 0, 0],
      ];
    }

    if (sizePreset === "6_seater") {
      return [
        [0, 0, -offset],
        [0, 0, offset],
        [-sideOffset, 0, -offset],
        [sideOffset, 0, -offset],
        [-sideOffset, 0, offset],
        [sideOffset, 0, offset],
      ];
    }

    // 8-seater
    return [
      [0, 0, -offset],
      [0, 0, offset],
      [-sideOffset, 0, -offset],
      [sideOffset, 0, -offset],
      [-sideOffset, 0, offset],
      [sideOffset, 0, offset],
      [-sideOffset * 0.5, 0, -offset * 1.1],
      [sideOffset * 0.5, 0, offset * 1.1],
    ];
  };

  const chairs = chairsForSize();

  logDebug("ChairsGroup:layout", { sizePreset, length, width, chairCount: chairs.length });

  return (
    <group>
      {chairs.map((pos, idx) => (
        <Chair key={idx} position={pos} />
      ))}
    </group>
  );
}

function DimmableGroup({ children, dimmed }: { children: ReactNode; dimmed?: boolean }) {
  return <group scale={dimmed ? 0.97 : 1}>{children}</group>;
}

function CameraRig({ focusPart, resetKey }: { focusPart: FocusPart; resetKey?: number }) {
  const { camera } = useThree();
  const sizePreset = useConfigStore((s) => s.sizePreset);
  const sceneProps = useSceneProps();

  const baseDistance = sizePreset === "8_seater" ? 3.6 : sizePreset === "6_seater" ? 3.2 : 2.9;

  const basePosition: [number, number, number] = [baseDistance, 1.7, baseDistance * 1.2];
  const baseTarget: [number, number, number] = [0, TABLE_HEIGHT, 0];

  let targetPosition = basePosition;
  let targetLookAt = baseTarget;

  if (focusPart === "tabletop") {
    targetPosition = [baseDistance * 0.85, 1.9, baseDistance];
    targetLookAt = [0, TABLE_HEIGHT + 0.05, 0];
  } else if (focusPart === "legs") {
    targetPosition = [baseDistance * 0.9, 1.2, baseDistance * 0.9];
    targetLookAt = [0, TABLE_HEIGHT / 2, 0];
  } else if (focusPart === "chairs") {
    targetPosition = [baseDistance, 1.5, baseDistance * 1.05];
    targetLookAt = [0, 0.4, 1.0];
  }

  logDebug("CameraRig:target", { focusPart, sizePreset, targetPosition, targetLookAt, sceneProps, resetKey });

  useEffect(() => {
    if (resetKey === undefined) return;
    logDebug("CameraRig:reset", { resetKey, basePosition, baseTarget });
    camera.position.set(
      basePosition[0],
      basePosition[1] + sceneProps.cameraHeightOffset,
      basePosition[2],
    );
    camera.lookAt(baseTarget[0], baseTarget[1], baseTarget[2]);
  }, [resetKey, basePosition[0], basePosition[1], basePosition[2], baseTarget[0], baseTarget[1], baseTarget[2], sceneProps.cameraHeightOffset, camera]);

  useFrame(() => {
    camera.position.lerp(
      {
        x: targetPosition[0],
        y: targetPosition[1] + sceneProps.cameraHeightOffset,
        z: targetPosition[2],
      } as any,
      0.08,
    );
    camera.lookAt(targetLookAt[0], targetLookAt[1], targetLookAt[2]);
  });

  return null;
}

export function ConfiguratorScene({ focusPart, resetKey }: { focusPart: FocusPart; resetKey?: number }) {
  // FocusPart only affects dimming and camera; we never write to any store here.
  const isTabletopFocus = focusPart === "tabletop";
  const isLegsFocus = focusPart === "legs";
  const isChairsFocus = focusPart === "chairs";

  const sceneProps = useSceneProps();

  return (
    <Canvas shadows camera={{ position: [2.5, 1.7, 3.2], fov: 40 }}>
      <color attach="background" args={[sceneProps.backgroundColor]} />

      {/* Neutral studio-style lighting */}
      <ambientLight intensity={sceneProps.ambientIntensity} />
      <directionalLight
        position={[4, 6, 2.5]}
        intensity={sceneProps.directionalIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#e7e5ee" roughness={0.92} metalness={0.02} />
      </mesh>

      <DimmableGroup dimmed={isChairsFocus}>
        <TableTop />
        <TableBase />
      </DimmableGroup>

      <DimmableGroup dimmed={isTabletopFocus || isLegsFocus ? false : undefined}>
        <ChairsGroup />
      </DimmableGroup>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={sceneProps.shadowOpacity}
        width={10}
        height={10}
        blur={2.5}
        far={6}
      />

      <Environment preset="studio" />
      <CameraRig focusPart={focusPart} resetKey={resetKey} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={2.2}
        maxDistance={4.2}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}

