# Chair Models Directory

Place your GLB/GLTF chair model files here. Use the following naming convention:

- `K-CH-1.glb` through `K-CH-16.glb`

## Important: Mesh Naming Convention

For automatic material customization to work, name your meshes with these prefixes:

### Leather/Upholstery Meshes (will apply selected leather color)

- `Upholstery_*`
- `Seat_*`
- `Back_*`
- `Cushion_*`
- `Leather_*`

### Wood/Frame Meshes (will apply selected wood color)

- `Frame_*`
- `Leg_*`
- `Wood_*`
- `Armrest_*`

### Other meshes

Any mesh not matching the above patterns will keep its original material.

## Example

If your model has:

- Main seat → Name it `Seat_Main`
- Backrest cushion → Name it `Back_Cushion`
- Wooden legs → Name them `Leg_Front_Left`, `Leg_Front_Right`, etc.
- Metal accents → Name them anything else, e.g., `Metal_Accent_1`

## After Adding Models

1. Update `src/config/chairCatalog.ts`
2. Set the `modelPath` for the corresponding chair to `/models/chairs/K-CH-X.glb`
3. The system will automatically use the GLB model instead of procedural geometry
