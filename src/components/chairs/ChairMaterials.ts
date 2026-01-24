/**
 * Chair Materials - Shared material utilities for all chair types
 * 
 * Provides consistent material properties for leather upholstery
 * and wood finishes across both procedural and GLB chairs.
 */

import { useMemo } from 'react';
import { useConfigStore, LeatherColor, WoodColor } from '@/store/configStore';
import * as THREE from 'three';

// Color mappings for leather upholstery
const LEATHER_COLORS: Record<LeatherColor, string> = {
  black: '#111111',
  tan: '#b07b48',
  brown: '#5d3a29',
  grey: '#5e6369',
  white: '#f0f0f0',
  olive: '#555d40',
};

// Color mappings for wood finishes
const WOOD_COLORS: Record<WoodColor, string> = {
  natural: '#dcb27e',
  walnut_dark: '#5c4033',
  oak_light: '#e0cda7',
  espresso: '#2b1d16',
  charcoal: '#2f2f2f',
};

export interface MaterialProps {
  color: string;
  roughness: number;
  metalness: number;
  envMapIntensity: number;
}

/**
 * Hook to get leather material properties based on current config
 */
export function useLeatherMaterial(): MaterialProps {
  const leatherColor = useConfigStore((s) => s.leather.color);
  
  return useMemo(() => ({
    color: LEATHER_COLORS[leatherColor] || LEATHER_COLORS.tan,
    roughness: 0.45,
    metalness: 0.05,
    envMapIntensity: 0.6,
  }), [leatherColor]);
}

/**
 * Hook to get wood material properties based on current config
 */
export function useWoodMaterial(): MaterialProps {
  const woodColor = useConfigStore((s) => s.woodMaterial.color);
  
  return useMemo(() => ({
    color: WOOD_COLORS[woodColor] || WOOD_COLORS.oak_light,
    roughness: 0.3,
    metalness: 0.0,
    envMapIntensity: 0.5,
  }), [woodColor]);
}

/**
 * Hook to get metal/accent material properties (brass, gold, chrome)
 */
export function useMetalMaterial(type: 'brass' | 'chrome' | 'black' = 'brass'): MaterialProps {
  return useMemo(() => {
    const configs = {
      brass: { color: '#b5a642', roughness: 0.2, metalness: 0.9, envMapIntensity: 1.2 },
      chrome: { color: '#c0c0c0', roughness: 0.1, metalness: 1.0, envMapIntensity: 1.5 },
      black: { color: '#1a1a1a', roughness: 0.3, metalness: 0.8, envMapIntensity: 0.8 },
    };
    return configs[type];
  }, [type]);
}

/**
 * Apply chair materials to a loaded GLB model
 * Traverses the model and applies appropriate materials based on mesh names
 */
export function applyChairMaterials(
  model: THREE.Object3D,
  leatherMat: MaterialProps,
  woodMat: MaterialProps
): void {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const name = child.name.toLowerCase();
      
      // Apply leather material to upholstery parts
      if (
        name.includes('upholstery') ||
        name.includes('seat') ||
        name.includes('back') ||
        name.includes('cushion') ||
        name.includes('leather')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: leatherMat.color,
          roughness: leatherMat.roughness,
          metalness: leatherMat.metalness,
          envMapIntensity: leatherMat.envMapIntensity,
        });
      }
      
      // Apply wood material to frame parts
      else if (
        name.includes('frame') ||
        name.includes('leg') ||
        name.includes('wood') ||
        name.includes('armrest')
      ) {
        child.material = new THREE.MeshStandardMaterial({
          color: woodMat.color,
          roughness: woodMat.roughness,
          metalness: woodMat.metalness,
          envMapIntensity: woodMat.envMapIntensity,
        });
      }
      
      // Enable shadows
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

// Export color maps for external use
export { LEATHER_COLORS, WOOD_COLORS };
