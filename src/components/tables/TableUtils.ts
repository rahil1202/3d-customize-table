/**
 * Table Utilities - Helper hooks and functions for table logic
 */

import { useMemo } from "react";
import { useConfigStore } from "@/store/configStore";

// Current table height constant
export const TABLE_HEIGHT = 0.76;

// Shared hook for table dimensions based on size preset
export function useTableDimensions() {
  const sizePreset = useConfigStore((s) => s.sizePreset);
  return useMemo(() => {
    if (sizePreset === "4_seater")
      return { length: 1.4, width: 0.9, thickness: 0.04, legInset: 0.15 };
    if (sizePreset === "6_seater")
      return { length: 2.0, width: 1.0, thickness: 0.05, legInset: 0.25 };
    return { length: 2.6, width: 1.1, thickness: 0.05, legInset: 0.35 };
  }, [sizePreset]);
}
