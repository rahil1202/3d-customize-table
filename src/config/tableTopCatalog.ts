/**
 * Table Top Catalog - Central definition for all marble/stone styles
 * 
 * This catalog maps client marble codes (VR 001 to VR 025) to their
 * display information and textures.
 */

// Import table top images
import tablePage1 from '@/assets/table-top-style/page-1.png';
import tablePage2 from '@/assets/table-top-style/page-2.png';
import tablePage3 from '@/assets/table-top-style/page-3.png';
import tablePage4 from '@/assets/table-top-style/page-4.png';
import tablePage5 from '@/assets/table-top-style/page-5.png';
import tablePage6 from '@/assets/table-top-style/page-6.png';
import tablePage7 from '@/assets/table-top-style/page-7.png';
import tablePage8 from '@/assets/table-top-style/page-8.png';
import tablePage9 from '@/assets/table-top-style/page-9.png';
import tablePage10 from '@/assets/table-top-style/page-10.png';
import tablePage11 from '@/assets/table-top-style/page-11.png';
import tablePage12 from '@/assets/table-top-style/page-12.png';
import tablePage13 from '@/assets/table-top-style/page-13.png';
import tablePage14 from '@/assets/table-top-style/page-14.png';
import tablePage15 from '@/assets/table-top-style/page-15.png';
import tablePage16 from '@/assets/table-top-style/page-16.png';
import tablePage17 from '@/assets/table-top-style/page-17.png';
import tablePage18 from '@/assets/table-top-style/page-18.png';
import tablePage19 from '@/assets/table-top-style/page-19.png';
import tablePage20 from '@/assets/table-top-style/page-20.png';
import tablePage21 from '@/assets/table-top-style/page-21.png';
import tablePage22 from '@/assets/table-top-style/page-22.png';
import tablePage23 from '@/assets/table-top-style/page-23.png';
import tablePage24 from '@/assets/table-top-style/page-24.png';
import tablePage25 from '@/assets/table-top-style/page-25.png';

// Marble category types
export type MarbleCategory = 
  | 'white'      // White marbles with subtle veining
  | 'grey'       // Grey toned marbles
  | 'dark'       // Dark/black marbles
  | 'exotic'     // Unique/exotic colors (turquoise, green, etc.)
  | 'cream';     // Beige/cream tones

export interface TableTopDefinition {
  id: string;                     // Client code e.g., "VR-001"
  name: string;                   // Display name
  description: string;            // Brief description
  thumbnail: string;              // Path to client's catalog image
  texturePath: string | null;     // Path to high-res texture for 3D (null = use thumbnail)
  baseColor: string;              // Fallback hex color for procedural rendering
  category: MarbleCategory;       // Category for filtering
  veiningIntensity: 'light' | 'medium' | 'heavy';  // For procedural generation
}

/**
 * Complete table top catalog matching client's specifications (VR 001 - VR 025)
 * 
 * The texturePath can be set to a high-resolution texture image when available.
 * Otherwise, the thumbnail will be used as the texture.
 */
export const TABLE_TOP_CATALOG: TableTopDefinition[] = [
  // VR 001-005 (page-1 to page-5)
  // {
  //   id: 'VR-001',
  //   name: 'Calacatta Oro',
  //   description: 'Elegant white marble with subtle grey veining',
  //   thumbnail: tablePage1,
  //   texturePath: null,
  //   baseColor: '#f2f2f2',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-002',
  //   name: 'Arabescato Corchia',
  //   description: 'White marble with intricate grey web veining',
  //   thumbnail: tablePage2,
  //   texturePath: null,
  //   baseColor: '#e8e8e8',
  //   category: 'white',
  //   veiningIntensity: 'heavy',
  // },
  // {
  //   id: 'VR-003',
  //   name: 'Amazonite Green',
  //   description: 'Exotic turquoise-green with natural patterns',
  //   thumbnail: tablePage3,
  //   texturePath: null,
  //   baseColor: '#5ba3a3',
  //   category: 'exotic',
  //   veiningIntensity: 'heavy',
  // },
  // {
  //   id: 'VR-004',
  //   name: 'Nero Marquina',
  //   description: 'Rich black marble with white veining',
  //   thumbnail: tablePage4,
  //   texturePath: null,
  //   baseColor: '#2a2a2a',
  //   category: 'dark',
  //   veiningIntensity: 'heavy',
  // },
  // {
  //   id: 'VR-005',
  //   name: 'Grigio Carnico',
  //   description: 'Deep grey marble with crystalline patterns',
  //   thumbnail: tablePage5,
  //   texturePath: null,
  //   baseColor: '#4a4a50',
  //   category: 'grey',
  //   veiningIntensity: 'heavy',
  // },
  
  // // VR 006-010 (page-6 to page-10)
  // {
  //   id: 'VR-006',
  //   name: 'Volakas White',
  //   description: 'Clean white with soft grey undertones',
  //   thumbnail: tablePage6,
  //   texturePath: null,
  //   baseColor: '#f0f0f0',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-007',
  //   name: 'Statuario Venato',
  //   description: 'Premium white with bold grey veining',
  //   thumbnail: tablePage7,
  //   texturePath: null,
  //   baseColor: '#f5f5f5',
  //   category: 'white',
  //   veiningIntensity: 'medium',
  // },
  // {
  //   id: 'VR-008',
  //   name: 'Bianco Lasa',
  //   description: 'Pure white with minimal veining',
  //   thumbnail: tablePage8,
  //   texturePath: null,
  //   baseColor: '#fafafa',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  {
    id: 'VR-009',
    name: 'Fior di Bosco',
    description: 'Grey-brown marble with natural flow',
    thumbnail: tablePage9,
    texturePath: null,
    baseColor: '#7a7068',
    category: 'grey',
    veiningIntensity: 'medium',
  },
  {
    id: 'VR-010',
    name: 'Lilac Marble',
    description: 'White with purple-grey veining',
    thumbnail: tablePage10,
    texturePath: null,
    baseColor: '#e8e4e8',
    category: 'white',
    veiningIntensity: 'heavy',
  },
  
  // VR 011-015 (page-11 to page-15)
  // {
  //   id: 'VR-011',
  //   name: 'Crema Valencia',
  //   description: 'Warm cream with subtle patterns',
  //   thumbnail: tablePage11,
  //   texturePath: null,
  //   baseColor: '#e8dcc8',
  //   category: 'cream',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-012',
  //   name: 'Thassos Crystal',
  //   description: 'Brilliant white crystal marble',
  //   thumbnail: tablePage12,
  //   texturePath: null,
  //   baseColor: '#ffffff',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-013',
  //   name: 'Emperador Light',
  //   description: 'Light brown with white veining',
  //   thumbnail: tablePage13,
  //   texturePath: null,
  //   baseColor: '#c4aa8c',
  //   category: 'cream',
  //   veiningIntensity: 'medium',
  // },
  // {
  //   id: 'VR-014',
  //   name: 'Pietra Grey',
  //   description: 'Sophisticated grey with linear patterns',
  //   thumbnail: tablePage14,
  //   texturePath: null,
  //   baseColor: '#6a6a6a',
  //   category: 'grey',
  //   veiningIntensity: 'medium',
  // },
  // {
  //   id: 'VR-015',
  //   name: 'Ocean White',
  //   description: 'Soft white with wave-like patterns',
  //   thumbnail: tablePage15,
  //   texturePath: null,
  //   baseColor: '#f0f2f4',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  
  // // VR 016-020 (page-16 to page-20)
  // {
  //   id: 'VR-016',
  //   name: 'Botticino Classico',
  //   description: 'Classic cream with fine veining',
  //   thumbnail: tablePage16,
  //   texturePath: null,
  //   baseColor: '#e5d8c8',
  //   category: 'cream',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-017',
  //   name: 'Travertine Silver',
  //   description: 'Silver-grey with natural pitting',
  //   thumbnail: tablePage17,
  //   texturePath: null,
  //   baseColor: '#b8b8b8',
  //   category: 'grey',
  //   veiningIntensity: 'medium',
  // },
  // {
  //   id: 'VR-018',
  //   name: 'Rosa Aurora',
  //   description: 'Pink-toned white marble',
  //   thumbnail: tablePage18,
  //   texturePath: null,
  //   baseColor: '#f2e8e8',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-019',
  //   name: 'Calacatta Viola',
  //   description: 'White with purple veining accents',
  //   thumbnail: tablePage19,
  //   texturePath: null,
  //   baseColor: '#eee8f0',
  //   category: 'white',
  //   veiningIntensity: 'medium',
  // },
  // {
  //   id: 'VR-020',
  //   name: 'Super White',
  //   description: 'Pure grey-white quartzite',
  //   thumbnail: tablePage20,
  //   texturePath: null,
  //   baseColor: '#d8d8d8',
  //   category: 'grey',
  //   veiningIntensity: 'light',
  // },
  
  // // VR 021-025 (page-21 to page-25)
  // {
  //   id: 'VR-021',
  //   name: 'Onyx Honey',
  //   description: 'Translucent honey-toned onyx',
  //   thumbnail: tablePage21,
  //   texturePath: null,
  //   baseColor: '#d4a574',
  //   category: 'exotic',
  //   veiningIntensity: 'heavy',
  // },
  // {
  //   id: 'VR-022',
  //   name: 'Mystery White',
  //   description: 'Dramatic white with bold patterns',
  //   thumbnail: tablePage22,
  //   texturePath: null,
  //   baseColor: '#e0e0e0',
  //   category: 'white',
  //   veiningIntensity: 'heavy',
  // },
  // {
  //   id: 'VR-023',
  //   name: 'Patagonia Granite',
  //   description: 'Multi-toned exotic stone',
  //   thumbnail: tablePage23,
  //   texturePath: null,
  //   baseColor: '#8a7868',
  //   category: 'exotic',
  //   veiningIntensity: 'heavy',
  // },
  // {
  //   id: 'VR-024',
  //   name: 'Bianco Sivec',
  //   description: 'Pure crystalline white',
  //   thumbnail: tablePage24,
  //   texturePath: null,
  //   baseColor: '#fcfcfc',
  //   category: 'white',
  //   veiningIntensity: 'light',
  // },
  // {
  //   id: 'VR-025',
  //   name: 'Calacatta Gold',
  //   description: 'Premium white with flowing grey veins',
  //   thumbnail: tablePage25,
  //   texturePath: null,
  //   baseColor: '#f8f6f2',
  //   category: 'white',
  //   veiningIntensity: 'medium',
  // },
];

// Helper functions
export function getTableTopById(id: string): TableTopDefinition | undefined {
  return TABLE_TOP_CATALOG.find(top => top.id === id);
}

export function getTableTopsByCategory(category: MarbleCategory): TableTopDefinition[] {
  return TABLE_TOP_CATALOG.filter(top => top.category === category);
}

// Default table top for initial state
export const DEFAULT_TABLE_TOP_ID = 'VR-001';
