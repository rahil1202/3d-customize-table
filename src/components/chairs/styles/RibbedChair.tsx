/**
 * Ribbed Chair - Procedural geometry
 *
 * Used for: K-CH-8
 * Features: Vertical ribbed/grooved pattern on backrest, clean modern lines
 */

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

export function RibbedChair() {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.48;
  const seatDepth = 0.45;
  const backHeight = 0.48;
  const ribCount = 9;

  // Generate rib positions
  const ribPositions = useMemo(() => {
    const positions: number[] = [];
    const spacing = (seatWidth - 0.08) / (ribCount - 1);

    for (let i = 0; i < ribCount; i++) {
      positions.push(-seatWidth / 2 + 0.04 + i * spacing);
    }
    return positions;
  }, [seatWidth, ribCount]);

  return (
    <group>
      {/* Seat cushion */}
      <RoundedBox
        args={[seatWidth, 0.07, seatDepth]}
        radius={0.025}
        position={[0, SEAT_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Back frame base */}
      <group
        position={[
          0,
          SEAT_HEIGHT + backHeight / 2 + 0.04,
          -seatDepth / 2 + 0.02,
        ]}
      >
        {/* Back panel */}
        <RoundedBox
          args={[seatWidth - 0.02, backHeight, 0.025]}
          radius={0.01}
          position={[0, 0, 0]}
          castShadow
        >
          <meshStandardMaterial {...leather} roughness={0.5} />
        </RoundedBox>

        {/* Vertical ribs */}
        {ribPositions.map((x, i) => (
          <RoundedBox
            key={i}
            args={[0.025, backHeight - 0.06, 0.035]}
            radius={0.008}
            position={[x, 0, 0.025]}
            castShadow
          >
            <meshStandardMaterial {...leather} />
          </RoundedBox>
        ))}

        {/* Top cap */}
        <RoundedBox
          args={[seatWidth - 0.02, 0.04, 0.055]}
          radius={0.015}
          position={[0, backHeight / 2 - 0.01, 0.015]}
          castShadow
        >
          <meshStandardMaterial {...leather} />
        </RoundedBox>
      </group>

      {/* Legs - tapered cylinder style */}
      {[
        [-seatWidth / 2 + 0.05, -seatDepth / 2 + 0.05, -0.06, 0.06],
        [seatWidth / 2 - 0.05, -seatDepth / 2 + 0.05, -0.06, -0.06],
        [-seatWidth / 2 + 0.05, seatDepth / 2 - 0.05, 0.06, 0.06],
        [seatWidth / 2 - 0.05, seatDepth / 2 - 0.05, 0.06, -0.06],
      ].map(([x, z, rotX, rotZ], i) => (
        <mesh
          key={i}
          position={[x, SEAT_HEIGHT / 2, z]}
          rotation={[rotX, 0, rotZ]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.025, SEAT_HEIGHT, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
    </group>
  );
}
