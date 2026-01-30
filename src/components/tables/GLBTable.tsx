/**
 * GLB Table - Loads and renders 3D table models
 */

import { Suspense, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { type TableDefinition } from "@/config/tableCatalog";
import {
  useMarbleMaterial,
  useWoodMaterial,
  useMetalMaterial,
  applyTableMaterials,
} from "./TableMaterials";
import { TableTop } from "./TableTop";

interface GLBTableProps {
  definition: TableDefinition;
  position?: [number, number, number];
}

function TableLoadingPlaceholder() {
  return (
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[1.6, 0.8, 0.8]} />
      <meshStandardMaterial color="#888888" transparent opacity={0.3} />
    </mesh>
  );
}

function GLBTableInner({ definition, position }: GLBTableProps) {
  const groupRef = useRef<THREE.Group>(null);
  const marble = useMarbleMaterial();
  const wood = useWoodMaterial();
  const metal = useMetalMaterial();

  const { scene } = useGLTF(definition.modelPath!);
  const clonedScene = scene.clone(true);

  useEffect(() => {
    if (clonedScene) {
      // 1. Apply materials
      applyTableMaterials(clonedScene, marble, wood, metal);

      // 2. Fix position (Lift to ground)
      const box = new THREE.Box3().setFromObject(clonedScene);
      const bottomY = box.min.y;

      // Shift scene up so bottom is at 0
      clonedScene.position.y = -bottomY;

      // Optional: Center X/Z
      const center = new THREE.Vector3();
      box.getCenter(center);
      clonedScene.position.x = -center.x;
      clonedScene.position.z = -center.z;
    }
  }, [clonedScene, marble, wood, metal]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={clonedScene} />
      <TableTop />
    </group>
  );
}

export function GLBTable(props: GLBTableProps) {
  if (!props.definition.modelPath) return null;

  return (
    <Suspense fallback={<TableLoadingPlaceholder />}>
      <GLBTableInner {...props} />
    </Suspense>
  );
}
