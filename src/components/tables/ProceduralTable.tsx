/**
 * Procedural Table - Generates table geometry based on configuration
 *
 * Combines TableTop (marble) and TableLegs (wood base) generation
 * using procedural geometry.
 */

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useConfigStore } from "@/store/configStore";
import { type TableDefinition } from "@/config/tableCatalog";
import { useWoodMaterial } from "./TableMaterials";
import { useTableDimensions, TABLE_HEIGHT } from "./TableUtils";
import { TableTop } from "./TableTop";

function TableLegsPart({ definition }: { definition: TableDefinition }) {
  const { length, width, legInset } = useTableDimensions();
  const wood = useWoodMaterial();
  const baseStyle = definition.baseStyle;

  const legH = TABLE_HEIGHT;
  const legW = 0.08;
  const x = length / 2 - legInset;
  const z = width / 2 - legInset;

  if (baseStyle === "slab" || baseStyle === "cylindrical") {
    return (
      <group>
        {[-1, 1].map((dir) => (
          <RoundedBox
            key={dir}
            args={[0.08, legH, width * 0.7]}
            radius={0.01}
            position={[dir * (length / 2 - 0.3), legH / 2, 0]}
            castShadow
            receiveShadow
          >
            <primitive object={wood} attach="material" />
          </RoundedBox>
        ))}
        <RoundedBox
          args={[length - 0.6, 0.1, 0.05]}
          radius={0.01}
          position={[0, legH - 0.1, 0]}
          castShadow
        >
          <primitive object={wood} attach="material" />
        </RoundedBox>
      </group>
    );
  }

  if (baseStyle === "x_shaped" || baseStyle === "trestle") {
    const angle = Math.PI / 6;
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (length / 2 - 0.35), 0, 0]}>
            <mesh
              rotation={[angle, 0, 0]}
              position={[0, legH / 2, 0]}
              castShadow
            >
              <boxGeometry args={[legW, legH * 1.1, legW]} />
              <primitive object={wood} attach="material" />
            </mesh>
            <mesh
              rotation={[-angle, 0, 0]}
              position={[0, legH / 2, 0]}
              castShadow
            >
              <boxGeometry args={[legW, legH * 1.1, legW]} />
              <primitive object={wood} attach="material" />
            </mesh>
          </group>
        ))}
        <RoundedBox
          args={[length * 0.7, 0.05, 0.05]}
          position={[0, legH * 0.4, 0]}
          castShadow
        >
          <primitive object={wood} attach="material" />
        </RoundedBox>
      </group>
    );
  }

  if (baseStyle === "v_shaped") {
    const vAngle = Math.PI / 8;
    return (
      <group>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (length / 2 - 0.25), 0, 0]}>
            <mesh
              rotation={[0, 0, side * vAngle]}
              position={[side * -0.1, legH / 2, 0]}
              castShadow
            >
              <boxGeometry args={[legW, legH, legW * 2]} />
              <primitive object={wood} attach="material" />
            </mesh>
          </group>
        ))}
        <RoundedBox
          args={[length - 0.5, 0.06, 0.06]}
          position={[0, legH - 0.05, 0]}
          castShadow
        >
          <primitive object={wood} attach="material" />
        </RoundedBox>
      </group>
    );
  }

  if (
    baseStyle === "sculptural" ||
    baseStyle === "organic" ||
    baseStyle === "geometric"
  ) {
    return (
      <group>
        <RoundedBox
          args={[0.15, legH, width * 0.5]}
          radius={0.02}
          position={[0, legH / 2, 0]}
          castShadow
          receiveShadow
        >
          <primitive object={wood} attach="material" />
        </RoundedBox>
        <RoundedBox
          args={[length * 0.6, 0.08, 0.08]}
          radius={0.02}
          position={[0, 0.04, 0]}
          castShadow
        >
          <primitive object={wood} attach="material" />
        </RoundedBox>
      </group>
    );
  }

  // Default: straight/splayed/curved/minimal legs
  return (
    <group>
      {[
        [-x, -z],
        [x, -z],
        [-x, z],
        [x, z],
      ].map(([px, pz], i) => (
        <group key={i} position={[px, legH / 2, pz]}>
          <RoundedBox
            args={[legW, legH, legW]}
            radius={0.01}
            smoothness={4}
            castShadow
            receiveShadow
          >
            <primitive object={wood} attach="material" />
          </RoundedBox>
        </group>
      ))}
      <group position={[0, legH - 0.06, 0]}>
        <mesh position={[0, 0, z]} castShadow>
          <boxGeometry args={[length - legInset, 0.08, 0.02]} />
          <primitive object={wood} attach="material" />
        </mesh>
        <mesh position={[0, 0, -z]} castShadow>
          <boxGeometry args={[length - legInset, 0.08, 0.02]} />
          <primitive object={wood} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

interface ProceduralTableProps {
  definition: TableDefinition;
}

export function ProceduralTable({ definition }: ProceduralTableProps) {
  // Use configStore sizePreset to determine export
  return (
    <group>
      <TableTop />
      <TableLegsPart definition={definition} />
    </group>
  );
}
