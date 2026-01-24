/**
 * GLB Chair - Loads and renders 3D model files
 *
 * This component handles loading GLB/GLTF models and applies
 * customizable materials based on user configuration.
 *
 * IMPORTANT: When creating GLB models, use these mesh naming conventions:
 * - Upholstery_*, Seat_*, Back_*, Cushion_*, Leather_* → Leather material applied
 * - Frame_*, Leg_*, Wood_*, Armrest_* → Wood material applied
 */

import { Suspense, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { type ChairDefinition } from "@/config/chairCatalog";
import {
  useLeatherMaterial,
  useWoodMaterial,
  applyChairMaterials,
} from "./ChairMaterials";

interface GLBChairProps {
  definition: ChairDefinition;
}

// Loading placeholder - simple box while model loads
function ChairLoadingPlaceholder() {
  return (
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.4, 0.8, 0.4]} />
      <meshStandardMaterial color="#888888" transparent opacity={0.3} />
    </mesh>
  );
}

// Inner component that does the actual loading
function GLBChairInner({ definition }: GLBChairProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  // Load the GLB model
  const { scene } = useGLTF(definition.modelPath!);

  // Clone the scene to avoid mutation issues
  const clonedScene = scene.clone(true);

  // Apply materials whenever leather or wood colors change
  useEffect(() => {
    if (clonedScene) {
      applyChairMaterials(clonedScene, leather, wood);
    }
  }, [clonedScene, leather, wood]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

export function GLBChair({ definition }: GLBChairProps) {
  if (!definition.modelPath) {
    console.warn(`GLBChair: No model path for ${definition.id}`);
    return null;
  }

  return (
    <Suspense fallback={<ChairLoadingPlaceholder />}>
      <GLBChairInner definition={definition} />
    </Suspense>
  );
}
