import { create } from "zustand";

// Size presets
export type TableSizePreset = "4_seater" | "6_seater" | "8_seater";

// Table design
export type TableDesignStyle =
  | "classic_straight_leg"
  | "modern_slab_leg"
  | "sculpted_leg"
  | "minimal_floating"
  | "cross_trestle";

export type LegProfile = "square" | "round" | "tapered";
export type EdgeStyle = "sharp" | "soft" | "chamfered";
export type ApronVisibility = "visible" | "hidden";

// Marble geometry
export type MarbleShape =
  | "rectangle"
  | "oval"
  | "rounded_rectangle"
  | "boat"
  | "soft_organic";

export type CornerRadiusLevel = "low" | "medium" | "high";
export type EdgeProfile = "straight" | "bevel" | "bullnose";
export type OverhangDepth = "standard" | "extended";

// Marble material
export type MarbleColor =
  | "white_carrara"
  | "beige_cream"
  | "grey_veined"
  | "black_marble"
  | "green_exotic";

export type MarbleFinish = "polished" | "honed" | "leathered";

// Wood material
export type WoodColor =
  | "natural"
  | "walnut_dark"
  | "oak_light"
  | "espresso"
  | "charcoal";

export type WoodFinish = "matte" | "satin" | "semi_gloss";
export type WoodGrainIntensity = "low" | "medium" | "high";
export type AgingTone = "fresh" | "slightly_aged";

// Chair & leather
export type ChairDesignStyle =
  | "minimal_modern"
  | "arm_chair"
  | "high_back"
  | "low_back"
  | "bench";

export type ArmrestStyle = "none" | "slim" | "full";
export type BackrestPattern = "plain" | "stitched" | "cut_out";
export type ChairLegStyle = "match_table" | "contrast";

export type LeatherColor =
  | "black"
  | "tan"
  | "brown"
  | "grey"
  | "white"
  | "olive";

export type LeatherFinish = "smooth" | "grained" | "distressed";
export type StitchingColor = "match" | "contrast";
export type CushionFirmness = "soft" | "medium" | "firm";
export type SeatPaddingThickness = "slim" | "standard" | "plush";

// Structural details
export type StretcherStyle = "straight" | "cross" | "hidden";
export type FootCapMaterial = "wood" | "metal";
export type LegThicknessLevel = "slim" | "medium" | "thick";

// Scene presets
export type LightingMood = "soft_daylight" | "warm_indoor";
export type BackgroundPreset = "studio" | "subtle_interior";
export type ShadowIntensity = "low" | "medium";

export interface ConfigState {
  // 1️⃣ Size preset
  sizePreset: TableSizePreset;

  // 2️⃣ Table design
  tableDesign: {
    style: TableDesignStyle;
    legProfile: LegProfile;
    edgeStyle: EdgeStyle;
    apronVisibility: ApronVisibility;
  };

  // 4️⃣ Marble shape / geometry
  marbleShape: {
    shape: MarbleShape;
    cornerRadius: CornerRadiusLevel;
    edgeProfile: EdgeProfile;
    overhangDepth: OverhangDepth;
  };

  // 5️⃣ Marble colour & finish
  marbleMaterial: {
    color: MarbleColor;
    finish: MarbleFinish;
  };

  // 6️⃣ Wood polish / finish
  woodMaterial: {
    color: WoodColor;
    finish: WoodFinish;
    grainIntensity: WoodGrainIntensity;
    agingTone: AgingTone;
  };

  // 3️⃣ Chair design & leather
  chair: {
    style: ChairDesignStyle;
    armrestStyle: ArmrestStyle;
    backrestPattern: BackrestPattern;
    legStyle: ChairLegStyle;
  };

  leather: {
    color: LeatherColor;
    finish: LeatherFinish;
    stitchingColor: StitchingColor;
    cushionFirmness: CushionFirmness;
    seatPadding: SeatPaddingThickness;
  };

  // 8️⃣ Structural details
  structural: {
    stretcherStyle: StretcherStyle;
    footCapMaterial: FootCapMaterial;
    floorClearance: "low" | "medium" | "high";
    legThickness: LegThicknessLevel;
  };

  // 🔄 Simple derived flags (rules encoded in 3D layer too)
  rules: {
    heavyMarble: boolean;
    largeTable: boolean;
  };

  // 🔟 Scene & presentation
  scene: {
    lightingMood: LightingMood;
    background: BackgroundPreset;
    shadowIntensity: ShadowIntensity;
  };

  setConfig: (partial: Partial<ConfigState>) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  sizePreset: "6_seater",
  tableDesign: {
    style: "classic_straight_leg",
    legProfile: "square",
    edgeStyle: "soft",
    apronVisibility: "visible",
  },
  marbleShape: {
    shape: "rectangle",
    cornerRadius: "low",
    edgeProfile: "straight",
    overhangDepth: "standard",
  },
  marbleMaterial: {
    color: "white_carrara",
    finish: "polished",
  },
  woodMaterial: {
    color: "oak_light",
    finish: "satin",
    grainIntensity: "medium",
    agingTone: "fresh",
  },
  chair: {
    style: "minimal_modern",
    armrestStyle: "none",
    backrestPattern: "plain",
    legStyle: "match_table",
  },
  leather: {
    color: "tan",
    finish: "smooth",
    stitchingColor: "match",
    cushionFirmness: "medium",
    seatPadding: "standard",
  },
  structural: {
    stretcherStyle: "straight",
    footCapMaterial: "wood",
    floorClearance: "medium",
    legThickness: "medium",
  },
  rules: {
    heavyMarble: false,
    largeTable: false,
  },
  scene: {
    lightingMood: "soft_daylight",
    background: "studio",
    shadowIntensity: "medium",
  },
  setConfig: (partial) => set((state) => ({ ...state, ...partial })),
}));
