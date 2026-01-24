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
  const clonedScene = scene.clone(true);

  // Auto-center and lift to ground, and fix double-chair issues
  useEffect(() => {
    if (clonedScene) {
      // 1. Analyze and Fix Double Chairs (Clustering Logic)
      const meshes: THREE.Mesh[] = [];
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) meshes.push(child);
      });

      if (meshes.length > 0) {
        // Simple clustering: Start with first mesh, find all connected within 40cm
        const cluster1 = new Set<THREE.Mesh>([meshes[0]]);
        let added = true;
        while (added) {
          added = false;
          for (const mesh of meshes) {
            if (cluster1.has(mesh)) continue;

            // Check distance to any mesh in cluster
            const meshBox = new THREE.Box3().setFromObject(mesh);
            const meshCenter = new THREE.Vector3();
            meshBox.getCenter(meshCenter);

            for (const clusterMesh of Array.from(cluster1)) {
              const cBox = new THREE.Box3().setFromObject(clusterMesh);
              const cCenter = new THREE.Vector3();
              cBox.getCenter(cCenter);

              // If within 40cm, assume part of same chair
              if (meshCenter.distanceTo(cCenter) < 0.4) {
                cluster1.add(mesh);
                added = true;
                break;
              }
            }
          }
        }

        // If we have meshes NOT in cluster 1, hide them (assume duplicates)
        if (cluster1.size < meshes.length) {
          console.warn(
            "GLBChair: Detected possible double chair. Hiding extra meshes.",
          );
          meshes.forEach((m) => {
            if (!cluster1.has(m)) {
              m.visible = false;
            }
          });
        }
      }

      // 2. Apply materials
      applyChairMaterials(clonedScene, leather, wood);

      // Scale up a bit (User request)
      clonedScene.scale.set(1.15, 1.15, 1.15);

      // 3. Fix position (Lift to ground) AFTER hiding extras
      // Re-calculate box for only visible objects
      const box = new THREE.Box3();
      box.makeEmpty();
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.visible) {
          box.expandByObject(child);
        }
      });

      if (!box.isEmpty()) {
        const bottomY = box.min.y;

        // Shift scene up so bottom is at 0
        clonedScene.position.y = -bottomY;

        // Center visible object
        const center = new THREE.Vector3();
        box.getCenter(center);
        // We move the scene inverse to the center offset
        clonedScene.position.x = -center.x;
        clonedScene.position.z = -center.z;
      }
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
