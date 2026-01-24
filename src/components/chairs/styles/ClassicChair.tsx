/**
 * Classic Chair - Procedural geometry
 *
 * Used for: K-CH-9
 * Features: Traditional straight-back dining chair, clean upholstered design
 */

import { RoundedBox } from "@react-three/drei";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

export function ClassicChair() {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.46;
  const seatDepth = 0.44;
  const backHeight = 0.45;
  const legThickness = 0.035;

  return (
    <group>
      {/* Seat cushion */}
      <RoundedBox
        args={[seatWidth, 0.065, seatDepth]}
        radius={0.02}
        position={[0, SEAT_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Backrest */}
      <RoundedBox
        args={[seatWidth - 0.04, backHeight, 0.045]}
        radius={0.018}
        position={[
          0,
          SEAT_HEIGHT + backHeight / 2 + 0.035,
          -seatDepth / 2 + 0.025,
        ]}
        castShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Legs - straight with slight taper */}
      {[
        [-seatWidth / 2 + 0.04, -seatDepth / 2 + 0.04],
        [seatWidth / 2 - 0.04, -seatDepth / 2 + 0.04],
        [-seatWidth / 2 + 0.04, seatDepth / 2 - 0.04],
        [seatWidth / 2 - 0.04, seatDepth / 2 - 0.04],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, SEAT_HEIGHT / 2, z]} castShadow>
          <boxGeometry args={[legThickness, SEAT_HEIGHT, legThickness]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}

      {/* Side stretchers */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (seatWidth / 2 - 0.04), SEAT_HEIGHT * 0.3, 0]}
          castShadow
        >
          <boxGeometry
            args={[legThickness * 0.7, legThickness * 0.7, seatDepth - 0.1]}
          />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}

      {/* Front stretcher */}
      <mesh position={[0, SEAT_HEIGHT * 0.3, seatDepth / 2 - 0.04]} castShadow>
        <boxGeometry
          args={[seatWidth - 0.1, legThickness * 0.7, legThickness * 0.7]}
        />
        <meshStandardMaterial {...wood} />
      </mesh>
    </group>
  );
}
