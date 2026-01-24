/**
 * Quilted Chair - Procedural geometry
 *
 * Used for: K-CH-6, K-CH-13
 * Features: Diamond quilted pattern on backrest, curved wrap-around design
 */

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

export function QuiltedChair() {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.5;
  const seatDepth = 0.48;
  const backHeight = 0.42;

  // Create curved wrap-around back shape
  const backShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = seatWidth / 2 + 0.05;
    const h = backHeight;

    // Wrap-around curve
    shape.moveTo(-w, 0);
    shape.lineTo(-w, h * 0.7);
    shape.quadraticCurveTo(-w * 0.8, h, 0, h);
    shape.quadraticCurveTo(w * 0.8, h, w, h * 0.7);
    shape.lineTo(w, 0);
    shape.lineTo(-w, 0);

    return shape;
  }, [seatWidth, backHeight]);

  // Generate diamond quilt pattern positions
  const quiltPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    const cols = 5;
    const rows = 4;
    const spacingX = (seatWidth - 0.1) / cols;
    const spacingY = (backHeight * 0.7) / rows;

    for (let row = 0; row < rows; row++) {
      const offsetX = row % 2 === 0 ? 0 : spacingX / 2;
      const colsInRow = row % 2 === 0 ? cols : cols - 1;

      for (let col = 0; col < colsInRow; col++) {
        positions.push({
          x: -seatWidth / 2 + 0.05 + spacingX / 2 + col * spacingX + offsetX,
          y: spacingY / 2 + row * spacingY + 0.02,
        });
      }
    }
    return positions;
  }, [seatWidth, backHeight]);

  return (
    <group>
      {/* Seat cushion - thicker padded look */}
      <RoundedBox
        args={[seatWidth, 0.09, seatDepth]}
        radius={0.03}
        position={[0, SEAT_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Main curved backrest */}
      <group position={[0, SEAT_HEIGHT + 0.04, -seatDepth / 2 + 0.02]}>
        <mesh rotation={[0.08, 0, 0]} castShadow>
          <extrudeGeometry
            args={[
              backShape,
              {
                depth: 0.05,
                bevelEnabled: true,
                bevelSize: 0.015,
                bevelThickness: 0.01,
              },
            ]}
          />
          <meshStandardMaterial {...leather} />
        </mesh>

        {/* Diamond quilt buttons/tufts */}
        {quiltPositions.map((pos, i) => (
          <mesh
            key={i}
            position={[pos.x, pos.y, 0.06]}
            rotation={[0.08, 0, 0]}
            castShadow
          >
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial {...leather} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Side wrap panels */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[
            side * (seatWidth / 2 + 0.01),
            SEAT_HEIGHT + backHeight * 0.35,
            -seatDepth / 4,
          ]}
          rotation={[0, side * -0.25, 0]}
        >
          <RoundedBox
            args={[0.04, backHeight * 0.6, seatDepth * 0.4]}
            radius={0.015}
            castShadow
          >
            <meshStandardMaterial {...leather} />
          </RoundedBox>
        </group>
      ))}

      {/* Legs - elegant tapered */}
      {[
        [-seatWidth / 2 + 0.06, -seatDepth / 2 + 0.06],
        [seatWidth / 2 - 0.06, -seatDepth / 2 + 0.06],
        [-seatWidth / 2 + 0.06, seatDepth / 2 - 0.06],
        [seatWidth / 2 - 0.06, seatDepth / 2 - 0.06],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, SEAT_HEIGHT / 2, z]}
          rotation={[i < 2 ? 0.05 : -0.05, 0, i % 2 === 0 ? 0.05 : -0.05]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.028, SEAT_HEIGHT, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
    </group>
  );
}
