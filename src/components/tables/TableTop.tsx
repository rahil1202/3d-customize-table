/**
 * TableTop - Procedural tabletop surface component
 *
 * Renders the marble/stone tabletop surface based on selected material
 * and shape configuration. Used by both GLBTable and ProceduralTable.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { useConfigStore } from "@/store/configStore";
import { useMarbleMaterial } from "./TableMaterials";
import { useTableDimensions, TABLE_HEIGHT } from "./TableUtils";

export function TableTop() {
  const { marbleShape } = useConfigStore((s) => s);
  const { length, width, thickness } = useTableDimensions();
  const marble = useMarbleMaterial();

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = width / 2;
    const l = length / 2;

    if (marbleShape.shape === "rectangle") {
      s.moveTo(-l, -w);
      s.lineTo(l, -w);
      s.lineTo(l, w);
      s.lineTo(-l, w);
      s.lineTo(-l, -w);
    } else if (marbleShape.shape === "rounded_rectangle") {
      const r = 0.15;
      s.moveTo(-l + r, -w);
      s.lineTo(l - r, -w);
      s.quadraticCurveTo(l, -w, l, -w + r);
      s.lineTo(l, w - r);
      s.quadraticCurveTo(l, w, l - r, w);
      s.lineTo(-l + r, w);
      s.quadraticCurveTo(-l, w, -l, w - r);
      s.lineTo(-l, -w + r);
      s.quadraticCurveTo(-l, -w, -l + r, -w);
    } else if (marbleShape.shape === "oval") {
      s.ellipse(0, 0, l, w, 0, Math.PI * 2, false, 0);
    } else if (marbleShape.shape === "boat") {
      s.moveTo(-l, -w * 0.7);
      s.quadraticCurveTo(0, -w, l, -w * 0.7);
      s.lineTo(l, w * 0.7);
      s.quadraticCurveTo(0, w, -l, w * 0.7);
      s.lineTo(-l, -w * 0.7);
    } else if (marbleShape.shape === "soft_organic") {
      s.moveTo(-l, -w * 0.5);
      s.bezierCurveTo(-l * 0.5, -w * 1.2, l * 0.5, -w, l, -w * 0.6);
      s.bezierCurveTo(l * 1.1, -w * 0.2, l, w * 0.8, l * 0.4, w);
      s.bezierCurveTo(-l * 0.2, w * 0.8, -l * 0.8, w * 1.1, -l, w * 0.6);
      s.lineTo(-l, -w * 0.5);
    }
    return s;
  }, [marbleShape.shape, length, width]);

  return (
    <group position={[0, TABLE_HEIGHT, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: thickness,
              bevelEnabled: true,
              bevelSize: 0.005,
              bevelThickness: 0.005,
              steps: 2,
            },
          ]}
        />
        <primitive object={marble} attach="material" />
      </mesh>
    </group>
  );
}
