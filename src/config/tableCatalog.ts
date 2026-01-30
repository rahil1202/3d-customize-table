/**
 * Table Design Catalog - Central definition for table base/frame styles
 * 
 * Each table has:
 * - Individual thumbnail photo from src/assets/table-stand/photos/
 * - GLB model imported as a module (Vite will handle the path)
 * - Procedural fallback style (for future use if GLB fails)
 */

// Import individual table photos
import tablePhoto1 from '@/assets/table-stand/photos/KT-1.jpg';
import tablePhoto2 from '@/assets/table-stand/photos/KT-2.jpg';
// import tablePhoto3 from '@/assets/table-stand/photos/KT-3.jpg';

// Import GLB models as modules so Vite can process them correctly
import tableModel1 from '@/assets/table-stand/models/KT-1.glb?url';
import tableModel2 from '@/assets/table-stand/models/KT-2.glb?url';
// import tableModel3 from '@/assets/table-stand/models/KT-3.glb?url';

// Table base style categories
export type TableBaseStyle = 
  | 'v_shaped'        // V-shaped legs
  | 'x_shaped'        // X-cross base
  | 'slab'            // Solid slab legs
  | 'sculptural'      // Artistic/sculptural bases
  | 'cylindrical'     // Cylinder/column legs
  | 'splayed'         // Angled/splayed legs
  | 'trestle'         // Trestle style bases
  | 'curved'          // Curved/cabriole legs
  | 'geometric'       // Geometric frame designs
  | 'minimal'         // Minimal/simple frames
  | 'organic';        // Organic/flowing shapes

export interface TableDefinition {
  id: string;                     // Table code e.g., "KT-1"
  name: string;                   // Display name
  description: string;            // Brief description
  thumbnail: string;              // Photo thumbnail
  modelPath: string | null;       // Path to GLB model (null = procedural)
  baseStyle: TableBaseStyle;      // Style category for procedural generation
  legCount: 2 | 4 | 'central';    // Number/type of legs
}

/**
 * Complete table catalog with 3D models and photos
 */
export const TABLE_CATALOG: TableDefinition[] = [
  {
    id: 'KT-1',
    name: 'Modern Geometric Base',
    description: 'Contemporary table with geometric frame design',
    thumbnail: tablePhoto1,
    modelPath: tableModel1,
    baseStyle: 'geometric',
    legCount: 2,
  },
  {
    id: 'KT-2',
    name: 'Classic V-Frame',
    description: 'Elegant V-shaped wooden frame',
    thumbnail: tablePhoto2,
    modelPath: tableModel2,
    baseStyle: 'v_shaped',
    legCount: 2,
  },
  // {
  //   id: 'KT-3',
  //   name: 'Sculptural Base',
  //   description: 'Artistic sculptural table base',
  //   thumbnail: tablePhoto3,
  //   modelPath: tableModel3,
  //   baseStyle: 'sculptural',
  //   legCount: 2,
  // },
];

// Helper functions
export function getTableById(id: string): TableDefinition | undefined {
  return TABLE_CATALOG.find(table => table.id === id);
}

export function getTablesByStyle(style: TableBaseStyle): TableDefinition[] {
  return TABLE_CATALOG.filter(table => table.baseStyle === style);
}

export function getTablesByLegCount(legCount: 2 | 4 | 'central'): TableDefinition[] {
  return TABLE_CATALOG.filter(table => table.legCount === legCount);
}

// Default table for initial state
export const DEFAULT_TABLE_ID = 'KT-1';

// Style display labels
export const TABLE_BASE_STYLE_LABELS: Record<TableBaseStyle, string> = {
  v_shaped: 'V-Shaped',
  x_shaped: 'X-Cross',
  slab: 'Slab',
  sculptural: 'Sculptural',
  cylindrical: 'Column',
  splayed: 'Splayed',
  trestle: 'Trestle',
  curved: 'Curved',
  geometric: 'Geometric',
  minimal: 'Minimal',
  organic: 'Organic',
};
