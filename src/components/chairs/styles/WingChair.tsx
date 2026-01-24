/**
 * Wing Chair - Procedural geometry
 *
 * Used for: K-CH-2, K-CH-4
 * Features: Classic wing-back design with exposed wood frame, padded seat and back
 */

import { RoundedBox } from "@react-three/drei";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

export function WingChair() {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.5;
  const seatDepth = 0.48;
  const backHeight = 0.55;
  const legThickness = 0.04;

  return (
    <group>
      {/* Seat cushion */}
      <RoundedBox
        args={[seatWidth, 0.08, seatDepth]}
        radius={0.02}
        position={[0, SEAT_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Main backrest */}
      <RoundedBox
        args={[seatWidth - 0.08, backHeight, 0.06]}
        radius={0.02}
        position={[
          0,
          SEAT_HEIGHT + backHeight / 2 + 0.04,
          -seatDepth / 2 + 0.03,
        ]}
        castShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Wing sides */}
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[
            side * (seatWidth / 2 - 0.02),
            SEAT_HEIGHT + 0.2,
            -seatDepth / 4,
          ]}
        >
          <mesh rotation={[0, side * -0.3, 0]} castShadow>
            <boxGeometry args={[0.04, 0.35, 0.15]} />
            <meshStandardMaterial {...leather} />
          </mesh>
        </group>
      ))}

      {/* Wood frame outline on back */}
      <group
        position={[
          0,
          SEAT_HEIGHT + backHeight / 2 + 0.04,
          -seatDepth / 2 - 0.01,
        ]}
      >
        {/* Vertical posts */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (seatWidth / 2 - 0.02), 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.025, backHeight + 0.02, 0.025]} />
            <meshStandardMaterial {...wood} />
          </mesh>
        ))}
        {/* Top rail */}
        <mesh position={[0, backHeight / 2, 0]} castShadow>
          <boxGeometry args={[seatWidth - 0.02, 0.03, 0.025]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      </group>

      {/* Armrests with wood caps */}
      {[-1, 1].map((side) => (
        <group key={`arm-${side}`}>
          {/* Arm support */}
          <mesh
            position={[side * (seatWidth / 2 - 0.02), SEAT_HEIGHT + 0.15, 0]}
            castShadow
          >
            <boxGeometry args={[0.03, 0.03, seatDepth * 0.7]} />
            <meshStandardMaterial {...wood} />
          </mesh>
          {/* Arm pad */}
          <RoundedBox
            args={[0.05, 0.025, seatDepth * 0.6]}
            radius={0.01}
            position={[
              side * (seatWidth / 2 - 0.02),
              SEAT_HEIGHT + 0.175,
              0.02,
            ]}
            castShadow
          >
            <meshStandardMaterial {...wood} />
          </RoundedBox>
        </group>
      ))}

      {/* Legs - straight with slight taper */}
      {[
        [-seatWidth / 2 + 0.05, -seatDepth / 2 + 0.05],
        [seatWidth / 2 - 0.05, -seatDepth / 2 + 0.05],
        [-seatWidth / 2 + 0.05, seatDepth / 2 - 0.05],
        [seatWidth / 2 - 0.05, seatDepth / 2 - 0.05],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, SEAT_HEIGHT / 2, z]} castShadow>
          <boxGeometry args={[legThickness, SEAT_HEIGHT, legThickness]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
    </group>
  );
}
