/**
 * Table Design Catalog - Central definition for all table base/frame styles
 * 
 * This catalog maps client table codes (K-DT-01 to K-DT-55) to their
 * display information and procedural/GLB model settings.
 */

// Import table catalog images (each page contains 5 table designs)
import tablePage1 from '@/assets/table-cataloge/page-1.png';
import tablePage2 from '@/assets/table-cataloge/page-2.png';
import tablePage3 from '@/assets/table-cataloge/page-3.png';
import tablePage4 from '@/assets/table-cataloge/page-4.png';
import tablePage5 from '@/assets/table-cataloge/page-5.png';
import tablePage6 from '@/assets/table-cataloge/page-6.png';
import tablePage7 from '@/assets/table-cataloge/page-7.png';
import tablePage8 from '@/assets/table-cataloge/page-8.png';
import tablePage9 from '@/assets/table-cataloge/page-9.png';
import tablePage10 from '@/assets/table-cataloge/page-10.png';
import tablePage11 from '@/assets/table-cataloge/page-11.png';

// Table base style categories
export type TableBaseStyle = 
  | 'v_shaped'        // V-shaped legs (K-DT-01, K-DT-04, K-DT-05)
  | 'x_shaped'        // X-cross base (K-DT-06, K-DT-07, K-DT-08, K-DT-10)
  | 'slab'            // Solid slab legs (K-DT-03, K-DT-13, K-DT-23)
  | 'sculptural'      // Artistic/sculptural bases (K-DT-11, K-DT-12, K-DT-19)
  | 'cylindrical'     // Cylinder/column legs (K-DT-18, K-DT-43)
  | 'splayed'         // Angled/splayed legs (K-DT-27, K-DT-28, K-DT-52)
  | 'trestle'         // Trestle style bases (K-DT-21, K-DT-22)
  | 'curved'          // Curved/cabriole legs (K-DT-24, K-DT-25, K-DT-26)
  | 'geometric'       // Geometric frame designs (K-DT-29, K-DT-38)
  | 'minimal'         // Minimal/simple frames (K-DT-34, K-DT-37)
  | 'organic';        // Organic/flowing shapes (K-DT-40, K-DT-44)

export interface TableDefinition {
  id: string;                     // Client code e.g., "K-DT-01"
  name: string;                   // Display name
  description: string;            // Brief description
  thumbnail: string;              // Path to catalog page image
  thumbnailIndex: number;         // Position on the page (0-4, top to bottom)
  modelPath: string | null;       // Path to GLB model (null = procedural)
  baseStyle: TableBaseStyle;      // Style category for procedural generation
  legCount: 2 | 4 | 'central';    // Number/type of legs
}

/**
 * Complete table catalog matching client's specifications (K-DT-01 to K-DT-55)
 * 
 * Each catalog page image shows 5 tables stacked vertically.
 * thumbnailIndex 0 = top, 4 = bottom
 */
export const TABLE_CATALOG: TableDefinition[] = [
  // Page 1: K-DT-01 to K-DT-05
  { id: 'K-DT-01', name: 'Vienna V-Frame', description: 'Elegant V-shaped wood frame with slatted base', thumbnail: tablePage1, thumbnailIndex: 0, modelPath: null, baseStyle: 'v_shaped', legCount: 2 },
  { id: 'K-DT-02', name: 'Milano Arch', description: 'Sculptural arched frame with brass accent', thumbnail: tablePage1, thumbnailIndex: 1, modelPath: null, baseStyle: 'sculptural', legCount: 2 },
  { id: 'K-DT-03', name: 'Osaka Slab', description: 'Modern stacked slab base in dark wood', thumbnail: tablePage1, thumbnailIndex: 2, modelPath: null, baseStyle: 'slab', legCount: 'central' },
  { id: 'K-DT-04', name: 'Nordic V-Plus', description: 'Wide V-frame with brass connector', thumbnail: tablePage1, thumbnailIndex: 3, modelPath: null, baseStyle: 'v_shaped', legCount: 2 },
  { id: 'K-DT-05', name: 'Amsterdam Open', description: 'Open rectangular wood frame', thumbnail: tablePage1, thumbnailIndex: 4, modelPath: null, baseStyle: 'geometric', legCount: 2 },
  
  // Page 2: K-DT-06 to K-DT-10
  { id: 'K-DT-06', name: 'Dynamic X', description: 'Dramatic black X-cross sculpture base', thumbnail: tablePage2, thumbnailIndex: 0, modelPath: null, baseStyle: 'x_shaped', legCount: 2 },
  { id: 'K-DT-07', name: 'Double Cross', description: 'Twin X-frame parallel base in black', thumbnail: tablePage2, thumbnailIndex: 1, modelPath: null, baseStyle: 'x_shaped', legCount: 4 },
  { id: 'K-DT-08', name: 'Flame Cross', description: 'Two-tone X-frame in wood and black', thumbnail: tablePage2, thumbnailIndex: 2, modelPath: null, baseStyle: 'x_shaped', legCount: 2 },
  { id: 'K-DT-09', name: 'Century Cross', description: 'Classic double X wooden base', thumbnail: tablePage2, thumbnailIndex: 3, modelPath: null, baseStyle: 'x_shaped', legCount: 4 },
  { id: 'K-DT-10', name: 'Heritage Cross', description: 'Traditional walnut X-cross with platform', thumbnail: tablePage2, thumbnailIndex: 4, modelPath: null, baseStyle: 'x_shaped', legCount: 2 },
  
  // Page 3: K-DT-11 to K-DT-15
  { id: 'K-DT-11', name: 'Hourglass', description: 'Twin hourglass pedestals in natural wood', thumbnail: tablePage3, thumbnailIndex: 0, modelPath: null, baseStyle: 'sculptural', legCount: 2 },
  { id: 'K-DT-12', name: 'Twist Column', description: 'Twisted sculptural pedestal design', thumbnail: tablePage3, thumbnailIndex: 1, modelPath: null, baseStyle: 'sculptural', legCount: 2 },
  { id: 'K-DT-13', name: 'Block Slab', description: 'Solid minimal slab legs in light oak', thumbnail: tablePage3, thumbnailIndex: 2, modelPath: null, baseStyle: 'slab', legCount: 2 },
  { id: 'K-DT-14', name: 'Ribbon Base', description: 'Sculptural flowing ribbon X-base', thumbnail: tablePage3, thumbnailIndex: 3, modelPath: null, baseStyle: 'sculptural', legCount: 'central' },
  { id: 'K-DT-15', name: 'Diamond Weave', description: 'White woven diamond pedestal', thumbnail: tablePage3, thumbnailIndex: 4, modelPath: null, baseStyle: 'sculptural', legCount: 'central' },
  
  // Page 4: K-DT-16 to K-DT-20
  { id: 'K-DT-16', name: 'Compass Frame', description: 'Angular splayed frame in walnut', thumbnail: tablePage4, thumbnailIndex: 0, modelPath: null, baseStyle: 'splayed', legCount: 4 },
  { id: 'K-DT-17', name: 'Accordion', description: 'Zigzag accordion-style wooden base', thumbnail: tablePage4, thumbnailIndex: 1, modelPath: null, baseStyle: 'geometric', legCount: 2 },
  { id: 'K-DT-18', name: 'Fluted Column', description: 'Fluted cylinder pedestals with brass', thumbnail: tablePage4, thumbnailIndex: 2, modelPath: null, baseStyle: 'cylindrical', legCount: 2 },
  { id: 'K-DT-19', name: 'Wave Rings', description: 'Interlinked oval ring base in walnut', thumbnail: tablePage4, thumbnailIndex: 3, modelPath: null, baseStyle: 'sculptural', legCount: 'central' },
  { id: 'K-DT-20', name: 'Split V Gold', description: 'Modern V-frame with brass accents', thumbnail: tablePage4, thumbnailIndex: 4, modelPath: null, baseStyle: 'v_shaped', legCount: 2 },
  
  // Page 5: K-DT-21 to K-DT-25
  { id: 'K-DT-21', name: 'Spindle Trestle', description: 'Vertical spindle trestle frame', thumbnail: tablePage5, thumbnailIndex: 0, modelPath: null, baseStyle: 'trestle', legCount: 2 },
  { id: 'K-DT-22', name: 'Curved Trestle', description: 'Curved wire trestle in dark wood', thumbnail: tablePage5, thumbnailIndex: 1, modelPath: null, baseStyle: 'trestle', legCount: 2 },
  { id: 'K-DT-23', name: 'T-Slab', description: 'T-shaped central slab base', thumbnail: tablePage5, thumbnailIndex: 2, modelPath: null, baseStyle: 'slab', legCount: 'central' },
  { id: 'K-DT-24', name: 'Queen Anne', description: 'Classic cabriole curved legs', thumbnail: tablePage5, thumbnailIndex: 3, modelPath: null, baseStyle: 'curved', legCount: 4 },
  { id: 'K-DT-25', name: 'Victorian Curve', description: 'Ornate curved legs in light wood', thumbnail: tablePage5, thumbnailIndex: 4, modelPath: null, baseStyle: 'curved', legCount: 4 },
  
  // Page 6: K-DT-26 to K-DT-30
  { id: 'K-DT-26', name: 'Georgian Curve', description: 'Elegant curved legs with claw feet', thumbnail: tablePage6, thumbnailIndex: 0, modelPath: null, baseStyle: 'curved', legCount: 4 },
  { id: 'K-DT-27', name: 'Modern Taper', description: 'Clean tapered legs in matte black', thumbnail: tablePage6, thumbnailIndex: 1, modelPath: null, baseStyle: 'splayed', legCount: 4 },
  { id: 'K-DT-28', name: 'Classic Taper', description: 'Traditional tapered legs in oak', thumbnail: tablePage6, thumbnailIndex: 2, modelPath: null, baseStyle: 'splayed', legCount: 4 },
  { id: 'K-DT-29', name: 'Organic Branch', description: 'Tree-inspired branch-like base', thumbnail: tablePage6, thumbnailIndex: 3, modelPath: null, baseStyle: 'organic', legCount: 'central' },
  { id: 'K-DT-30', name: 'Traditional Rail', description: 'Classic straight legs with rail', thumbnail: tablePage6, thumbnailIndex: 4, modelPath: null, baseStyle: 'minimal', legCount: 4 },
  
  // Page 7: K-DT-31 to K-DT-35
  { id: 'K-DT-31', name: 'Nordic Cross', description: 'Scandinavian cross-leg design', thumbnail: tablePage7, thumbnailIndex: 0, modelPath: null, baseStyle: 'x_shaped', legCount: 4 },
  { id: 'K-DT-32', name: 'Angular V', description: 'Sharp angled V-frame in walnut', thumbnail: tablePage7, thumbnailIndex: 1, modelPath: null, baseStyle: 'v_shaped', legCount: 2 },
  { id: 'K-DT-33', name: 'Spider Base', description: 'Central spider-leg black base', thumbnail: tablePage7, thumbnailIndex: 2, modelPath: null, baseStyle: 'organic', legCount: 'central' },
  { id: 'K-DT-34', name: 'Industrial Frame', description: 'Modern industrial metal frame', thumbnail: tablePage7, thumbnailIndex: 3, modelPath: null, baseStyle: 'minimal', legCount: 2 },
  { id: 'K-DT-35', name: 'Sculptural Wire', description: 'Wire sculpture base design', thumbnail: tablePage7, thumbnailIndex: 4, modelPath: null, baseStyle: 'sculptural', legCount: 'central' },
  
  // Page 8: K-DT-36 to K-DT-40
  { id: 'K-DT-36', name: 'Dark Pedestal', description: 'Single solid pedestal in dark wood', thumbnail: tablePage8, thumbnailIndex: 0, modelPath: null, baseStyle: 'cylindrical', legCount: 'central' },
  { id: 'K-DT-37', name: 'Modern Minimal', description: 'Clean minimal frame dining table', thumbnail: tablePage8, thumbnailIndex: 1, modelPath: null, baseStyle: 'minimal', legCount: 4 },
  { id: 'K-DT-38', name: 'Infinity Loop', description: 'Unique infinity loop base design', thumbnail: tablePage8, thumbnailIndex: 2, modelPath: null, baseStyle: 'geometric', legCount: 'central' },
  { id: 'K-DT-39', name: 'Wishbone', description: 'Elegant wishbone Y-frame legs', thumbnail: tablePage8, thumbnailIndex: 3, modelPath: null, baseStyle: 'v_shaped', legCount: 2 },
  { id: 'K-DT-40', name: 'Starburst', description: 'Organic starburst wooden legs', thumbnail: tablePage8, thumbnailIndex: 4, modelPath: null, baseStyle: 'organic', legCount: 'central' },
  
  // Page 9: K-DT-41 to K-DT-46
  { id: 'K-DT-41', name: 'Round Plinth', description: 'Round table with central plinth', thumbnail: tablePage9, thumbnailIndex: 0, modelPath: null, baseStyle: 'cylindrical', legCount: 'central' },
  { id: 'K-DT-42', name: 'Wing Frame', description: 'Sculptural wing-shaped base', thumbnail: tablePage9, thumbnailIndex: 1, modelPath: null, baseStyle: 'sculptural', legCount: 2 },
  { id: 'K-DT-43', name: 'Barrel Column', description: 'Barrel-shaped fluted columns', thumbnail: tablePage9, thumbnailIndex: 2, modelPath: null, baseStyle: 'cylindrical', legCount: 2 },
  { id: 'K-DT-44', name: 'Danish Fork', description: 'Danish modern forked legs', thumbnail: tablePage9, thumbnailIndex: 3, modelPath: null, baseStyle: 'organic', legCount: 4 },
  { id: 'K-DT-45', name: 'Arch Base', description: 'Architectural arch base design', thumbnail: tablePage9, thumbnailIndex: 4, modelPath: null, baseStyle: 'sculptural', legCount: 2 },
  { id: 'K-DT-46', name: 'Rustic Framework', description: 'Rustic wooden frame structure', thumbnail: tablePage9, thumbnailIndex: 5, modelPath: null, baseStyle: 'trestle', legCount: 2 },
  
  // Page 10: K-DT-47 to K-DT-50
  { id: 'K-DT-47', name: 'Square Post', description: 'Simple square post legs', thumbnail: tablePage10, thumbnailIndex: 0, modelPath: null, baseStyle: 'minimal', legCount: 4 },
  { id: 'K-DT-48', name: 'Turned Post', description: 'Traditional turned post legs', thumbnail: tablePage10, thumbnailIndex: 1, modelPath: null, baseStyle: 'minimal', legCount: 4 },
  { id: 'K-DT-49', name: 'A-Frame Cross', description: 'A-frame with X cross support', thumbnail: tablePage10, thumbnailIndex: 2, modelPath: null, baseStyle: 'x_shaped', legCount: 2 },
  { id: 'K-DT-50', name: 'Classic Straight', description: 'Traditional straight legs', thumbnail: tablePage10, thumbnailIndex: 3, modelPath: null, baseStyle: 'minimal', legCount: 4 },
  
  // Page 11: K-DT-51 to K-DT-55
  { id: 'K-DT-51', name: 'Curved Frame', description: 'Curved open frame in walnut', thumbnail: tablePage11, thumbnailIndex: 0, modelPath: null, baseStyle: 'curved', legCount: 2 },
  { id: 'K-DT-52', name: 'A-Frame Splay', description: 'A-frame splayed legs in grey', thumbnail: tablePage11, thumbnailIndex: 1, modelPath: null, baseStyle: 'splayed', legCount: 2 },
  { id: 'K-DT-53', name: 'U-Frame', description: 'Modern U-shaped frame base', thumbnail: tablePage11, thumbnailIndex: 2, modelPath: null, baseStyle: 'geometric', legCount: 2 },
  { id: 'K-DT-54', name: 'Tiered Platform', description: 'Tiered platform central base', thumbnail: tablePage11, thumbnailIndex: 3, modelPath: null, baseStyle: 'slab', legCount: 'central' },
  { id: 'K-DT-55', name: 'Ribbed Arch', description: 'Ribbed arch slab ends', thumbnail: tablePage11, thumbnailIndex: 4, modelPath: null, baseStyle: 'sculptural', legCount: 2 },
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
export const DEFAULT_TABLE_ID = 'K-DT-01';

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
