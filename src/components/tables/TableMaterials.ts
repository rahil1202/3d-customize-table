/**
 * Table Materials - Utility for managing and applying table materials
 */

import { useConfigStore } from "@/store/configStore";
import { getTableTopById } from "@/config/tableTopCatalog";
import * as THREE from "three";
import { useMemo } from "react";

// Hook to get the current marble material properties
export function useMarbleMaterial() {
  const selectedTableTopId = useConfigStore((s) => s.selectedTableTopId);

  return useMemo(() => {
    const tableTopDef = getTableTopById(selectedTableTopId);
    const baseColor = tableTopDef?.baseColor || "#e8e8e8";

    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.05, // Polished stone
      metalness: 0.1,
      envMapIntensity: 1.0,
      name: 'Marble_Material',
    });
  }, [selectedTableTopId]);
}

// Hook to get the current wood material properties
export function useWoodMaterial() {
  const woodColorId = useConfigStore((s) => s.woodMaterial.color);

  return useMemo(() => {
    const colors: Record<string, string> = {
      natural: "#dcb27e",
      walnut_dark: "#5c4033",
      oak_light: "#e0cda7",
      espresso: "#2b1d16",
      charcoal: "#2f2f2f",
    };

    return new THREE.MeshStandardMaterial({
      color: colors[woodColorId] || "#dcb27e",
      roughness: 0.3, // Satin wood finish
      metalness: 0.0,
      envMapIntensity: 0.5,
      name: 'Wood_Material',
    });
  }, [woodColorId]);
}

// Hook to get standard metal material
export function useMetalMaterial() {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#d4af37", // Brass/Gold default
      roughness: 0.2,
      metalness: 0.9,
      envMapIntensity: 1.0,
      name: 'Metal_Material',
    });
  }, []);
}

/**
 * Traverses a GLB scene and applies materials based on mesh names.
 * 
 * Naming Convention:
 * - Marble/Stone/Top: "Marble_*", "Stone_*", "Top_*"
 * - Wood/Legs/Frame: "Wood_*", "Leg_*", "Frame_*", "Base_*"
 * - Metal/Accent: "Metal_*", "Chrome_*", "Brass_*"
 */
export function applyTableMaterials(
  scene: THREE.Group,
  marbleMaterial: THREE.Material,
  woodMaterial: THREE.Material,
  metalMaterial: THREE.Material
) {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const name = child.name.toLowerCase();

      // Apply Marble/Stone
      if (name.includes('marble') || name.includes('stone') || name.includes('top')) {
        child.material = marbleMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
      
      // Apply Wood
      else if (name.includes('wood') || name.includes('leg') || name.includes('frame') || name.includes('base')) {
        child.material = woodMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
      
      // Apply Metal
      else if (name.includes('metal') || name.includes('chrome') || name.includes('brass') || name.includes('gold')) {
        child.material = metalMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    }
  });
}
