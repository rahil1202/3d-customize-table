/**
 * Artistic Round Chair - Procedural geometry
 *
 * Used for: K-CH-5, K-CH-10
 * Features: Circular padded back, thin profile seat, artistic tripod/crossed legs
 */

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";
import {
  useLeatherMaterial,
  useWoodMaterial,
  useMetalMaterial,
} from "../ChairMaterials";

const SEAT_HEIGHT = 0.46;

interface ArtisticRoundChairProps {
  hasMetalAccents?: boolean;
}

export function ArtisticRoundChair({
  hasMetalAccents = true,
}: ArtisticRoundChairProps) {
  const leather = useLeatherMaterial();
  const wood = useWoodMaterial();
  const brass = useMetalMaterial("brass");

  const seatWidth = 0.45;
  const seatDepth = 0.42;
  const backRadius = 0.22;

  // Create circular back shape
  const circleShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, backRadius, 0, Math.PI * 2, false);
    return shape;
  }, [backRadius]);

  // Create hole for decorative opening
  const holeShape = useMemo(() => {
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.04, 0, Math.PI * 2, false);
    return hole;
  }, []);

  const backShapeWithHole = useMemo(() => {
    const shape = circleShape.clone();
    shape.holes.push(holeShape);
    return shape;
  }, [circleShape, holeShape]);

  return (
    <group>
      {/* Thin profile seat */}
      <RoundedBox
        args={[seatWidth, 0.045, seatDepth]}
        radius={0.02}
        position={[0, SEAT_HEIGHT, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...leather} />
      </RoundedBox>

      {/* Circular backrest with decorative hole */}
      <group
        position={[0, SEAT_HEIGHT + backRadius + 0.06, -seatDepth / 2 + 0.02]}
      >
        <mesh rotation={[0.15, 0, 0]} castShadow>
          <extrudeGeometry
            args={[
              backShapeWithHole,
              {
                depth: 0.04,
                bevelEnabled: true,
                bevelSize: 0.005,
                bevelThickness: 0.005,
              },
            ]}
          />
          <meshStandardMaterial {...leather} />
        </mesh>
      </group>

      {/* Artistic tripod legs - crossed pattern */}
      {/* Back legs - form an X pattern */}
      <group position={[0, 0, -seatDepth / 2 + 0.1]}>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 0.12, SEAT_HEIGHT / 2, 0]}
            rotation={[0.15 * side, 0, side * 0.2]}
            castShadow
          >
            <cylinderGeometry args={[0.018, 0.022, SEAT_HEIGHT * 1.1, 8]} />
            <meshStandardMaterial {...wood} />
          </mesh>
        ))}

        {/* Cross beam connecting back legs */}
        <mesh
          position={[0, SEAT_HEIGHT * 0.35, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      </group>

      {/* Front legs - splayed outward */}
      {[-1, 1].map((side) => (
        <mesh
          key={`front-${side}`}
          position={[
            side * (seatWidth / 2 - 0.06),
            SEAT_HEIGHT / 2,
            seatDepth / 2 - 0.08,
          ]}
          rotation={[-0.12, 0, side * -0.1]}
          castShadow
        >
          <cylinderGeometry args={[0.018, 0.022, SEAT_HEIGHT, 8]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}

      {/* Decorative ring around back hole */}
      {hasMetalAccents && (
        <group
          position={[
            0,
            SEAT_HEIGHT + backRadius + 0.06,
            -seatDepth / 2 + 0.065,
          ]}
        >
          <mesh rotation={[0.15, 0, 0]} castShadow>
            <torusGeometry args={[0.05, 0.008, 8, 24]} />
            <meshStandardMaterial {...brass} />
          </mesh>
        </group>
      )}

      {/* Metal leg tips */}
      {hasMetalAccents && (
        <>
          {[-1, 1].map((side) => (
            <mesh
              key={`tip-front-${side}`}
              position={[
                side * (seatWidth / 2 - 0.06),
                0.01,
                seatDepth / 2 - 0.08,
              ]}
              castShadow
            >
              <cylinderGeometry args={[0.024, 0.024, 0.02, 8]} />
              <meshStandardMaterial {...brass} />
            </mesh>
          ))}
          {[-1, 1].map((side) => (
            <mesh
              key={`tip-back-${side}`}
              position={[side * 0.12, 0.01, -seatDepth / 2 + 0.1]}
              castShadow
            >
              <cylinderGeometry args={[0.024, 0.024, 0.02, 8]} />
              <meshStandardMaterial {...brass} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}
