/**
 * Table - Unified smart component for rendering tables
 *
 * Automatically chooses between GLB (3D model) and
 * Procedural (geometry-based) rendering based on definition.
 */

import { useConfigStore } from "@/store/configStore";
import { getTableById } from "@/config/tableCatalog";
import { GLBTable } from "./GLBTable";
import { ProceduralTable } from "./ProceduralTable";

interface TableProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Table({ position, rotation = [0, 0, 0] }: TableProps) {
  const selectedTableId = useConfigStore((s) => s.selectedTableId);
  const tableDef = getTableById(selectedTableId);

  if (!tableDef) {
    console.warn(`Table: Unknown table ID "${selectedTableId}"`);
    return null;
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <group position={position} rotation={rotation as any}>
      {tableDef.modelPath ? (
        <GLBTable definition={tableDef} />
      ) : (
        <ProceduralTable definition={tableDef} />
      )}
    </group>
  );
}
