/**
 * Chair - Unified smart component for rendering chairs
 *
 * This component automatically chooses between GLB (3D model) and
 * Procedural (geometry-based) rendering based on the chair definition.
 *
 * Usage:
 * <Chair position={[1, 0, 0]} rotation={[0, Math.PI, 0]} />
 */

import { useConfigStore } from "@/store/configStore";
import { getChairById } from "@/config/chairCatalog";
import { GLBChair } from "./GLBChair";
import { ProceduralChair } from "./ProceduralChair";

interface ChairProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  // Optional override for chair ID (useful for previews)
  chairIdOverride?: string;
}

export function Chair({
  position,
  rotation = [0, 0, 0],
  chairIdOverride,
}: ChairProps) {
  const selectedChairId = useConfigStore((s) => s.selectedChairId);
  const chairId = chairIdOverride || selectedChairId;

  // Get chair definition from catalog
  const chairDef = getChairById(chairId);

  if (!chairDef) {
    console.warn(`Chair: Unknown chair ID "${chairId}"`);
    return null;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <group position={position} rotation={rotation as any}>
      {chairDef.modelPath ? (
        // Use GLB model if available
        <GLBChair definition={chairDef} />
      ) : (
        // Fall back to procedural geometry
        <ProceduralChair style={chairDef.proceduralStyle} />
      )}
    </group>
  );
}
