import { create } from "zustand";
import { DEFAULT_CHAIR_ID } from "@/config/chairCatalog";
import { DEFAULT_TABLE_TOP_ID } from "@/config/tableTopCatalog";
import { DEFAULT_TABLE_ID } from "@/config/tableCatalog";

// --- 1. Size Presets ---
export type TableSizePreset = "4_seater" | "6_seater" | "8_seater";

// --- 2. Marble (Tabletop Shape) ---
export type MarbleShape =
  | "rectangle"
  | "oval"
  | "rounded_rectangle"
  | "boat"
  | "soft_organic";

// --- 3. Wood (Polish) ---
export type WoodColor =
  | "natural"
  | "walnut_dark"
  | "oak_light"
  | "espresso"
  | "charcoal";

// --- 4. Chair Selection ---
// Chair ID references the catalog (K-CH-1 through K-CH-16)
// Leather color applies to any selected chair's upholstery

export type LeatherColor =
  | "black"
  | "tan"
  | "brown"
  | "grey"
  | "white"
  | "olive";

// --- 5. Scene / Environment ---
export type EnvironmentPreset = 
  | "studio" 
  | "apartment" 
  | "city" 
  | "sunset" 
  | "night";

// --- State Interface ---
export interface ConfigState {
  sizePreset: TableSizePreset;

  // Table design - references tableCatalog (K-DT-01 through K-DT-55)
  selectedTableId: string;

  marbleShape: {
    shape: MarbleShape;
  };
  
  // Table top stone - references tableTopCatalog (VR-001 through VR-025)
  selectedTableTopId: string;

  woodMaterial: {
    color: WoodColor;
  };

  // Chair selection - references chairCatalog (K-CH-1 through K-CH-16)
  selectedChairId: string;
  
  leather: {
    color: LeatherColor;
  };

  scene: {
    environment: EnvironmentPreset;
  };

  // Trigger to force camera reset
  resetKey: number;
  triggerReset: () => void;

  setConfig: (partial: Partial<ConfigState>) => void;
  setScene: (partial: Partial<ConfigState["scene"]>) => void;
  setChair: (chairId: string) => void;
  setTableTop: (tableTopId: string) => void;
  setTable: (tableId: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  sizePreset: "6_seater",
  
  // Default to first table in catalog
  selectedTableId: DEFAULT_TABLE_ID,

  marbleShape: {
    shape: "rounded_rectangle",
  },

  // Default to first table top in catalog
  selectedTableTopId: DEFAULT_TABLE_TOP_ID,

  woodMaterial: {
    color: "oak_light",
  },

  // Default to first chair in catalog
  selectedChairId: DEFAULT_CHAIR_ID,

  leather: {
    color: "tan",
  },

  scene: {
    environment: "apartment", // Default to home scenario
  },

  resetKey: 0,
  triggerReset: () => set((state) => ({ resetKey: state.resetKey + 1 })),

  setConfig: (partial) => set((state) => ({ ...state, ...partial })),
  setScene: (partial) => set((state) => ({ ...state, scene: { ...state.scene, ...partial } })),
  setChair: (chairId) => set({ selectedChairId: chairId }),
  setTableTop: (tableTopId) => set({ selectedTableTopId: tableTopId }),
  setTable: (tableId) => set({ selectedTableId: tableId }),
}));