/**
 * Chair Catalog - Central definitions for all 8 chair designs
 * 
 * Each chair has:
 * - Individual thumbnail photo from src/assets/chairs/photos/
 * - GLB model imported as a module (Vite will handle the path)
 * - Procedural fallback style (for future use if GLB fails)
 */

// Import individual chair photos
import chairPhoto1 from '@/assets/chairs/photos/K-CH-1.jpg';
import chairPhoto2 from '@/assets/chairs/photos/K-CH-2.jpg';
import chairPhoto3 from '@/assets/chairs/photos/K-CH-3.jpg';
import chairPhoto4 from '@/assets/chairs/photos/K-CH-4.jpg';
import chairPhoto5 from '@/assets/chairs/photos/K-CH-5.jpg';
import chairPhoto6 from '@/assets/chairs/photos/K-CH-6.jpg';
import chairPhoto7 from '@/assets/chairs/photos/K-CH-7.jpg';
import chairPhoto8 from '@/assets/chairs/photos/K-CH-8.jpg';

// Import GLB models as modules so Vite can process them correctly
import chairModel1 from '@/assets/chairs/models/K-CH-1.glb?url';
import chairModel2 from '@/assets/chairs/models/K-CH-2.glb?url';
import chairModel3 from '@/assets/chairs/models/K-CH-3.glb?url';
import chairModel4 from '@/assets/chairs/models/K-CH-4.glb?url';
import chairModel5 from '@/assets/chairs/models/K-CH-5.glb?url';
import chairModel6 from '@/assets/chairs/models/K-CH-6.glb?url';
import chairModel7 from '@/assets/chairs/models/K-CH-7.glb?url';
import chairModel8 from '@/assets/chairs/models/K-CH-8.glb?url';

// Procedural chair styles (fallback if GLB fails to load)
export type ProceduralChairStyle =
  | 'round_back'
  | 'wing_chair'
  | 'artistic_round'
  | 'quilted'
  | 'open_frame'
  | 'ribbed'
  | 'classic'
  | 'tub_chair';

export interface ChairDefinition {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  modelPath: string;
  proceduralStyle: ProceduralChairStyle;
}

/**
 * Complete catalog of 8 chair designs
 */
export const CHAIR_CATALOG: ChairDefinition[] = [
  {
    id: 'K-CH-1',
    name: 'Milano Round',
    description: 'Contemporary round-back chair with elegant upholstery',
    thumbnail: chairPhoto1,
    modelPath: chairModel1,
    proceduralStyle: 'round_back',
  },
  // {
  //   id: 'K-CH-2',
  //   name: 'Heritage Wing',
  //   description: 'Classic wing chair with wooden accents',
  //   thumbnail: chairPhoto2,
  //   modelPath: chairModel2,
  //   proceduralStyle: 'wing_chair',
  // },
  // {
  //   id: 'K-CH-3',
  //   name: 'Serenity Teal',
  //   description: 'Elegant round-back in calming teal',
  //   thumbnail: chairPhoto3,
  //   modelPath: chairModel3,
  //   proceduralStyle: 'round_back',
  // },
  // {
  //   id: 'K-CH-4',
  //   name: 'Windsor Accent',
  //   description: 'Traditional accent chair with exposed wood frame',
  //   thumbnail: chairPhoto4,
  //   modelPath: chairModel4,
  //   proceduralStyle: 'wing_chair',
  // },
  // {
  //   id: 'K-CH-5',
  //   name: 'Artisan Circle',
  //   description: 'Artistic circular back with modern aesthetic',
  //   thumbnail: chairPhoto5,
  //   modelPath: chairModel5,
  //   proceduralStyle: 'artistic_round',
  // },
  // {
  //   id: 'K-CH-6',
  //   name: 'Diamond Quilted',
  //   description: 'Luxurious diamond quilted upholstery',
  //   thumbnail: chairPhoto6,
  //   modelPath: chairModel6,
  //   proceduralStyle: 'quilted',
  // },
  // {
  //   id: 'K-CH-7',
  //   name: 'Nordic Frame',
  //   description: 'Scandinavian open-frame design',
  //   thumbnail: chairPhoto7,
  //   modelPath: chairModel7,
  //   proceduralStyle: 'open_frame',
  // },
  {
    id: 'K-CH-8',
    name: 'Classic Dining',
    description: 'Timeless dining chair with clean lines',
    thumbnail: chairPhoto8,
    modelPath: chairModel8,
    proceduralStyle: 'classic',
  },
];

// Helper functions
export function getChairById(id: string): ChairDefinition | undefined {
  return CHAIR_CATALOG.find((c) => c.id === id);
}

export function getAllChairs(): ChairDefinition[] {
  return CHAIR_CATALOG;
}

// Default chair ID
export const DEFAULT_CHAIR_ID = 'K-CH-1';
