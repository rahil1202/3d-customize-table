/**
 * Chair Catalog - Central definition for all chair types
 * 
 * This catalog maps client chair codes (K-CH-1 to K-CH-16) to their
 * display information, 3D model paths, and procedural fallback styles.
 */

// Procedural style identifiers - used when no GLB model is available
export type ProceduralChairStyle = 
  | 'round_back'       // K-CH-1, K-CH-3, K-CH-11, K-CH-12 - Rounded upholstered back
  | 'wing_chair'       // K-CH-2, K-CH-4 - Wing-style with exposed wood frame
  | 'artistic_round'   // K-CH-5, K-CH-10 - Circular back with artistic tripod legs
  | 'quilted'          // K-CH-6, K-CH-13 - Diamond quilted pattern back
  | 'open_frame'       // K-CH-7, K-CH-14 - Open wooden frame with fabric
  | 'ribbed'           // K-CH-8 - Vertical ribbed/grooved back
  | 'classic'          // K-CH-9 - Classic straight upholstered
  | 'tub_chair';       // K-CH-15, K-CH-16 - Curved tub-style wrap-around

export interface ChairDefinition {
  id: string;                              // Client code e.g., "K-CH-1"
  name: string;                            // Display name
  description: string;                     // Brief description
  thumbnail: string;                       // Path to client's catalog image
  modelPath: string | null;                // Path to GLB model, null = use procedural
  proceduralStyle: ProceduralChairStyle;   // Fallback procedural style
  category: 'upholstered' | 'wooden' | 'artistic';  // For filtering
}

// Import chair images
import chairPage1 from '@/assets/chairs/page-1.png';
import chairPage2 from '@/assets/chairs/page-2.png';
import chairPage3 from '@/assets/chairs/page-3.png';
import chairPage4 from '@/assets/chairs/page-4.png';

/**
 * Complete chair catalog matching client's specifications
 * 
 * When GLB models are ready, update the `modelPath` field for each chair.
 * Place models in: public/models/chairs/K-CH-X.glb
 */
export const CHAIR_CATALOG: ChairDefinition[] = [
  // Page 1 chairs (K-CH-1 to K-CH-4)
  {
    id: 'K-CH-1',
    name: 'Milano Round',
    description: 'Contemporary round-back chair with two-tone upholstery',
    thumbnail: chairPage1,
    modelPath: null, // Set to '/models/chairs/K-CH-1.glb' when ready
    proceduralStyle: 'round_back',
    category: 'upholstered',
  },
  {
    id: 'K-CH-2',
    name: 'Heritage Wing',
    description: 'Classic wing chair with wooden accents',
    thumbnail: chairPage1,
    modelPath: null,
    proceduralStyle: 'wing_chair',
    category: 'upholstered',
  },
  {
    id: 'K-CH-3',
    name: 'Serenity Teal',
    description: 'Elegant round-back in calming teal',
    thumbnail: chairPage1,
    modelPath: null,
    proceduralStyle: 'round_back',
    category: 'upholstered',
  },
  {
    id: 'K-CH-4',
    name: 'Windsor Accent',
    description: 'Traditional accent chair with exposed wood frame',
    thumbnail: chairPage1,
    modelPath: null,
    proceduralStyle: 'wing_chair',
    category: 'upholstered',
  },
  
  // Page 2 chairs (K-CH-5 to K-CH-8)
  {
    id: 'K-CH-5',
    name: 'Luna Artistic',
    description: 'Artistic circular back with unique tripod base',
    thumbnail: chairPage2,
    modelPath: null,
    proceduralStyle: 'artistic_round',
    category: 'artistic',
  },
  {
    id: 'K-CH-6',
    name: 'Diamond Quilt',
    description: 'Luxurious diamond-quilted backrest',
    thumbnail: chairPage2,
    modelPath: null,
    proceduralStyle: 'quilted',
    category: 'upholstered',
  },
  {
    id: 'K-CH-7',
    name: 'Nordic Frame',
    description: 'Scandinavian open wooden frame design',
    thumbnail: chairPage2,
    modelPath: null,
    proceduralStyle: 'open_frame',
    category: 'wooden',
  },
  {
    id: 'K-CH-8',
    name: 'Ribbed Modern',
    description: 'Contemporary vertical ribbed upholstery',
    thumbnail: chairPage2,
    modelPath: null,
    proceduralStyle: 'ribbed',
    category: 'upholstered',
  },
  
  // Page 3 chairs (K-CH-9 to K-CH-12)
  {
    id: 'K-CH-9',
    name: 'Classic Straight',
    description: 'Timeless straight-back dining chair',
    thumbnail: chairPage3,
    modelPath: null,
    proceduralStyle: 'classic',
    category: 'upholstered',
  },
  {
    id: 'K-CH-10',
    name: 'Aurora Circle',
    description: 'Striking circular design with brass accents',
    thumbnail: chairPage3,
    modelPath: null,
    proceduralStyle: 'artistic_round',
    category: 'artistic',
  },
  {
    id: 'K-CH-11',
    name: 'Velvet Curve',
    description: 'Curved back with plush velvet finish',
    thumbnail: chairPage3,
    modelPath: null,
    proceduralStyle: 'round_back',
    category: 'upholstered',
  },
  {
    id: 'K-CH-12',
    name: 'Ocean Comfort',
    description: 'Deep-seated comfort chair in ocean tones',
    thumbnail: chairPage3,
    modelPath: null,
    proceduralStyle: 'round_back',
    category: 'upholstered',
  },
  
  // Page 4 chairs (K-CH-13 to K-CH-16)
  {
    id: 'K-CH-13',
    name: 'Diamond Accent',
    description: 'Statement piece with quilted diamond pattern',
    thumbnail: chairPage4,
    modelPath: null,
    proceduralStyle: 'quilted',
    category: 'upholstered',
  },
  {
    id: 'K-CH-14',
    name: 'Architect Frame',
    description: 'Bold architectural wooden frame',
    thumbnail: chairPage4,
    modelPath: null,
    proceduralStyle: 'open_frame',
    category: 'wooden',
  },
  {
    id: 'K-CH-15',
    name: 'Executive Tub',
    description: 'Premium wrap-around tub chair',
    thumbnail: chairPage4,
    modelPath: null,
    proceduralStyle: 'tub_chair',
    category: 'upholstered',
  },
  {
    id: 'K-CH-16',
    name: 'Emerald Embrace',
    description: 'Luxurious curved embrace in emerald',
    thumbnail: chairPage4,
    modelPath: null,
    proceduralStyle: 'tub_chair',
    category: 'upholstered',
  },
];

// Helper functions
export function getChairById(id: string): ChairDefinition | undefined {
  return CHAIR_CATALOG.find(chair => chair.id === id);
}

export function getChairsByCategory(category: ChairDefinition['category']): ChairDefinition[] {
  return CHAIR_CATALOG.filter(chair => chair.category === category);
}

export function getChairsByStyle(style: ProceduralChairStyle): ChairDefinition[] {
  return CHAIR_CATALOG.filter(chair => chair.proceduralStyle === style);
}

// Default chair for initial state
export const DEFAULT_CHAIR_ID = 'K-CH-1';
