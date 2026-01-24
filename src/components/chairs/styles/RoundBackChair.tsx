/**
 * Round Back Chair - Procedural geometry
 *
 * Used for: K-CH-1, K-CH-3, K-CH-11, K-CH-12
 * Features: Curved upholstered backrest, padded seat, tapered legs
 */

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import { useLeatherMaterial, useWoodMaterial } from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

interface RoundBackChairProps {
  hasGoldAccents?: boolean;
}

export function RoundBackChair({
  hasGoldAccents = false,
}: RoundBackChairProps) {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();

  const seatWidth = 0.48;
  const seatDepth = 0.45;
  const backHeight = 0.45;
  const legThickness = 0.035;

  // Create curved back shape
  const backShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = seatWidth / 2;
    const h = backHeight;

    // Rounded top
    shape.moveTo(-w, 0);
    shape.lineTo(-w, h * 0.6);
    shape.quadraticCurveTo(-w, h, 0, h);
    shape.quadraticCurveTo(w, h, w, h * 0.6);
    shape.lineTo(w, 0);
    shape.lineTo(-w, 0);

    return shape;
  }, [seatWidth, backHeight]);

  return (
    <group>
      {/* Seat cushion */}
      <RoundedBox
        args={[seatWidth, 0.08, seatDepth]}
        radius={0.03}
        position={[0, SEAT_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Curved backrest */}
      <group position={[0, SEAT_HEIGHT + 0.04, -seatDepth / 2 + 0.02]}>
        <mesh rotation={[0.1, 0, 0]} castShadow>
          <extrudeGeometry
            args={[
              backShape,
              {
                depth: 0.05,
                bevelEnabled: true,
                bevelSize: 0.01,
                bevelThickness: 0.01,
              },
            ]}
          />
          <meshStandardMaterial {...leather} />
        </mesh>
      </group>

      {/* Legs - tapered */}
      {[
        [-seatWidth / 2 + 0.04, -seatDepth / 2 + 0.04, -0.08],
        [seatWidth / 2 - 0.04, -seatDepth / 2 + 0.04, 0.08],
        [-seatWidth / 2 + 0.04, seatDepth / 2 - 0.04, -0.08],
        [seatWidth / 2 - 0.04, seatDepth / 2 - 0.04, 0.08],
      ].map(([x, z, lean], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh
            position={[0, SEAT_HEIGHT / 2, 0]}
            rotation={[lean * 0.15, 0, (i < 2 ? -1 : 1) * 0.08]}
            castShadow
          >
            <cylinderGeometry
              args={[legThickness * 0.7, legThickness, SEAT_HEIGHT, 8]}
            />
            <meshStandardMaterial {...wood} />
          </mesh>

          {/* Gold accent tips */}
          {hasGoldAccents && (
            <mesh position={[0, 0.015, 0]} castShadow>
              <cylinderGeometry
                args={[legThickness * 0.75, legThickness * 0.8, 0.03, 8]}
              />
              <meshStandardMaterial
                color="#b5a642"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
