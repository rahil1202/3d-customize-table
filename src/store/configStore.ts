import { create } from "zustand";

// --- 1. Size Presets ---
export type TableSizePreset = "4_seater" | "6_seater" | "8_seater";

// --- 2. Table Design ---
export type TableDesignStyle =
  | "classic_straight_leg"
  | "modern_slab_leg"
  | "sculpted_leg"
  | "minimal_floating"
  | "cross_trestle";

// --- 3. Marble (Tabletop) ---
export type MarbleShape =
  | "rectangle"
  | "oval"
  | "rounded_rectangle"
  | "boat"
  | "soft_organic";

export type MarbleColor =
  | "white_carrara"
  | "beige_cream"
  | "grey_veined"
  | "black_marble"
  | "green_exotic";

// --- 4. Wood (Polish) ---
export type WoodColor =
  | "natural"
  | "walnut_dark"
  | "oak_light"
  | "espresso"
  | "charcoal";

// --- 5. Chair Design & Leather ---
export type ChairDesignStyle =
  | "minimal_modern"
  | "arm_chair"
  | "high_back"
  | "low_back"
  | "bench";

export type LeatherColor =
  | "black"
  | "tan"
  | "brown"
  | "grey"
  | "white"
  | "olive";

// --- 6. Scene / Environment ---
export type EnvironmentPreset = 
  | "studio" 
  | "apartment" 
  | "city" 
  | "sunset" 
  | "night";

// --- State Interface ---
export interface ConfigState {
  sizePreset: TableSizePreset;

  tableDesign: {
    style: TableDesignStyle;
  };

  marbleShape: {
    shape: MarbleShape;
  };
  
  marbleMaterial: {
    color: MarbleColor;
  };

  woodMaterial: {
    color: WoodColor;
  };

  chair: {
    style: ChairDesignStyle;
  };
  
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
}

export const useConfigStore = create<ConfigState>((set) => ({
  sizePreset: "6_seater",
  
  tableDesign: {
    style: "classic_straight_leg",
  },

  marbleShape: {
    shape: "rounded_rectangle",
  },

  marbleMaterial: {
    color: "white_carrara",
  },

  woodMaterial: {
    color: "oak_light",
  },

  chair: {
    style: "minimal_modern",
  },

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
}));