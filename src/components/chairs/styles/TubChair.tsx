/**
 * Tub Chair - Procedural geometry
 *
 * Used for: K-CH-15, K-CH-16
 * Features: Curved wrap-around tub design, continuous upholstered shell
 */

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

export function TubChair() {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.52;
  const seatDepth = 0.48;
  const backHeight = 0.4;
  const shellThickness = 0.04;

  // Create tub shell shape (U-shape from top view)
  const tubShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = seatWidth / 2;
    const d = seatDepth / 2;

    // Outer U-shape
    shape.moveTo(-w, d);
    shape.lineTo(-w, -d * 0.3);
    shape.quadraticCurveTo(-w, -d, -w * 0.5, -d);
    shape.lineTo(w * 0.5, -d);
    shape.quadraticCurveTo(w, -d, w, -d * 0.3);
    shape.lineTo(w, d);

    // Inner cutout
    const innerW = w - shellThickness;
    const innerD = d - shellThickness;
    shape.lineTo(innerW, d);
    shape.lineTo(innerW, -innerD * 0.2);
    shape.quadraticCurveTo(innerW, -innerD, innerW * 0.6, -innerD);
    shape.lineTo(-innerW * 0.6, -innerD);
    shape.quadraticCurveTo(-innerW, -innerD, -innerW, -innerD * 0.2);
    shape.lineTo(-innerW, d);
    shape.lineTo(-w, d);

    return shape;
  }, [seatWidth, seatDepth, shellThickness]);

  return (
    <group>
      {/* Seat cushion */}
      <RoundedBox
        args={[seatWidth - 0.1, 0.08, seatDepth - 0.08]}
        radius={0.025}
        position={[0, SEAT_HEIGHT, 0.02]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Tub shell - extruded U-shape */}
      <group position={[0, SEAT_HEIGHT + backHeight / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <extrudeGeometry
            args={[
              tubShape,
              {
                depth: backHeight,
                bevelEnabled: true,
                bevelSize: 0.015,
                bevelThickness: 0.01,
                bevelSegments: 3,
              },
            ]}
          />
          <meshStandardMaterial {...leather} />
        </mesh>
      </group>

      {/* Back cushion panel */}
      <group
        position={[0, SEAT_HEIGHT + backHeight * 0.5, -seatDepth / 2 + 0.08]}
      >
        <RoundedBox
          args={[seatWidth - 0.16, backHeight * 0.7, 0.035]}
          radius={0.015}
          castShadow
        >
          <meshStandardMaterial {...leather} roughness={0.35} />
        </RoundedBox>
      </group>

      {/* Legs - tapered cylinder style */}
      {[
        [-seatWidth / 2 + 0.08, -seatDepth / 2 + 0.08],
        [seatWidth / 2 - 0.08, -seatDepth / 2 + 0.08],
        [-seatWidth / 2 + 0.08, seatDepth / 2 - 0.06],
        [seatWidth / 2 - 0.08, seatDepth / 2 - 0.06],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, SEAT_HEIGHT / 2, z]}
          rotation={[i < 2 ? 0.08 : -0.05, 0, i % 2 === 0 ? 0.05 : -0.05]}
          castShadow
        >
          <cylinderGeometry args={[0.022, 0.03, SEAT_HEIGHT, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
    </group>
  );
}
