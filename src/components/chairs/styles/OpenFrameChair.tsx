/**
 * Open Frame Chair - Procedural geometry
 *
 * Used for: K-CH-7, K-CH-14
 * Features: Scandinavian-style exposed wooden frame with fabric/leather seat and back
 */

import { RoundedBox } from "@react-three/drei";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

export function OpenFrameChair() {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.5;
  const seatDepth = 0.45;
  const backHeight = 0.38;
  const frameThickness = 0.028;

  return (
    <group>
      {/* Seat - fabric/leather pad on wooden frame */}
      <group position={[0, SEAT_HEIGHT, 0]}>
        {/* Wooden seat frame */}
        <RoundedBox
          args={[seatWidth + 0.02, 0.025, seatDepth + 0.02]}
          radius={0.01}
          position={[0, -0.02, 0]}
          castShadow
        >
          <meshStandardMaterial {...wood} />
        </RoundedBox>

        {/* Upholstered seat cushion */}
        <RoundedBox
          args={[seatWidth - 0.04, 0.06, seatDepth - 0.04]}
          radius={0.02}
          position={[0, 0.02, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial {...leather} />
        </RoundedBox>
      </group>

      {/* Back - open frame with floating pad */}
      <group
        position={[0, SEAT_HEIGHT + backHeight / 2 + 0.08, -seatDepth / 2]}
      >
        {/* Wooden back frame - A-shape */}
        {/* Vertical posts */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (seatWidth / 2 - 0.02), 0, 0.02]}
            rotation={[0.12, 0, side * -0.08]}
            castShadow
          >
            <boxGeometry
              args={[frameThickness, backHeight + 0.06, frameThickness]}
            />
            <meshStandardMaterial {...wood} />
          </mesh>
        ))}

        {/* Top rail */}
        <mesh position={[0, backHeight / 2 - 0.02, 0.015]} castShadow>
          <boxGeometry
            args={[seatWidth - 0.06, frameThickness, frameThickness]}
          />
          <meshStandardMaterial {...wood} />
        </mesh>

        {/* Middle floating back pad */}
        <RoundedBox
          args={[seatWidth - 0.12, backHeight * 0.65, 0.04]}
          radius={0.015}
          position={[0, -0.02, 0.045]}
          castShadow
        >
          <meshStandardMaterial {...leather} />
        </RoundedBox>
      </group>

      {/* Armrests - open wooden style */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Armrest bar */}
          <mesh
            position={[
              side * (seatWidth / 2 + 0.01),
              SEAT_HEIGHT + 0.18,
              -0.05,
            ]}
            castShadow
          >
            <boxGeometry
              args={[frameThickness, frameThickness * 0.8, seatDepth * 0.65]}
            />
            <meshStandardMaterial {...wood} />
          </mesh>

          {/* Front armrest support */}
          <mesh
            position={[
              side * (seatWidth / 2 + 0.01),
              SEAT_HEIGHT + 0.09,
              seatDepth * 0.22,
            ]}
            castShadow
          >
            <boxGeometry args={[frameThickness, 0.18, frameThickness]} />
            <meshStandardMaterial {...wood} />
          </mesh>
        </group>
      ))}

      {/* Legs - angular Scandinavian style */}
      {[
        {
          x: -seatWidth / 2 + 0.04,
          z: -seatDepth / 2 + 0.04,
          rotX: 0.1,
          rotZ: 0.08,
        },
        {
          x: seatWidth / 2 - 0.04,
          z: -seatDepth / 2 + 0.04,
          rotX: 0.1,
          rotZ: -0.08,
        },
        {
          x: -seatWidth / 2 + 0.04,
          z: seatDepth / 2 - 0.04,
          rotX: -0.08,
          rotZ: 0.08,
        },
        {
          x: seatWidth / 2 - 0.04,
          z: seatDepth / 2 - 0.04,
          rotX: -0.08,
          rotZ: -0.08,
        },
      ].map((leg, i) => (
        <mesh
          key={i}
          position={[leg.x, SEAT_HEIGHT / 2 - 0.02, leg.z]}
          rotation={[leg.rotX, 0, leg.rotZ]}
          castShadow
        >
          <boxGeometry args={[frameThickness, SEAT_HEIGHT, frameThickness]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}

      {/* Cross stretchers between legs */}
      <mesh
        position={[0, SEAT_HEIGHT * 0.35, -seatDepth / 2 + 0.04]}
        castShadow
      >
        <boxGeometry
          args={[seatWidth - 0.1, frameThickness * 0.7, frameThickness * 0.7]}
        />
        <meshStandardMaterial {...wood} />
      </mesh>
      <mesh position={[0, SEAT_HEIGHT * 0.35, seatDepth / 2 - 0.04]} castShadow>
        <boxGeometry
          args={[seatWidth - 0.1, frameThickness * 0.7, frameThickness * 0.7]}
        />
        <meshStandardMaterial {...wood} />
      </mesh>
    </group>
  );
}
