/**
 * Procedural Chair - Routes to the correct procedural style component
 *
 * This component renders a chair using procedural Three.js geometry
 * based on the specified style. Used as a fallback when GLB models
 * are not available.
 */

import { type ProceduralChairStyle } from "@/config/chairCatalog";
import {
  RoundBackChair,
  WingChair,
  ArtisticRoundChair,
  QuiltedChair,
  OpenFrameChair,
  RibbedChair,
  ClassicChair,
  TubChair,
} from "./styles";

interface ProceduralChairProps {
  style: ProceduralChairStyle;
}

export function ProceduralChair({ style }: ProceduralChairProps) {
  switch (style) {
    case "round_back":
      return <RoundBackChair />;

    case "wing_chair":
      return <WingChair />;

    case "artistic_round":
      return <ArtisticRoundChair />;

    case "quilted":
      return <QuiltedChair />;

    case "open_frame":
      return <OpenFrameChair />;

    case "ribbed":
      return <RibbedChair />;

    case "classic":
      return <ClassicChair />;

    case "tub_chair":
      return <TubChair />;

    default:
      // Default to classic if unknown style
      return <ClassicChair />;
  }
}
