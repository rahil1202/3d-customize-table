/**
 * Chair Selector - Visual grid for selecting chair models
 *
 * Displays client's chair catalog images as a scrollable grid
 * for visual selection of chair designs.
 */

import { useState } from "react";
import { useConfigStore } from "@/store/configStore";
import { CHAIR_CATALOG, type ChairDefinition } from "@/config/chairCatalog";
import { cn } from "@/lib/utils";
import { Check, Image as ImageIcon } from "lucide-react";

interface ChairSelectorProps {
  onSelect?: (chair: ChairDefinition) => void;
}

export function ChairSelector({ onSelect }: ChairSelectorProps) {
  const { selectedChairId, setChair } = useConfigStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (chair: ChairDefinition) => {
    setChair(chair.id);
    onSelect?.(chair);
  };

  return (
    <div className="space-y-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        Select Chair Design
      </div>

      {/* Scrollable grid container */}
      <div className="max-h-[320px] overflow-y-auto pr-1 -mr-1">
        <div className="grid grid-cols-4 gap-2">
          {CHAIR_CATALOG.map((chair) => {
            const isSelected = selectedChairId === chair.id;
            const isHovered = hoveredId === chair.id;

            return (
              <button
                key={chair.id}
                onClick={() => handleSelect(chair)}
                onMouseEnter={() => setHoveredId(chair.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300",
                  "hover:scale-[1.03] active:scale-[0.98]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-muted hover:border-primary/40",
                )}
              >
                {/* Chair image */}
                <div className="absolute inset-0 bg-muted/30">
                  {chair.thumbnail ? (
                    <img
                      src={chair.thumbnail}
                      alt={chair.name}
                      className={cn(
                        "h-full w-full object-cover object-center transition-transform duration-300",
                        isHovered && "scale-110",
                      )}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Overlay gradient */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent",
                    "transition-opacity duration-300",
                    isSelected || isHovered ? "opacity-100" : "opacity-0",
                  )}
                />

                {/* Chair info overlay */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-2 text-left",
                    "transition-all duration-300",
                    isSelected || isHovered
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0",
                  )}
                >
                  <div className="text-[10px] font-bold text-white/90 truncate">
                    {chair.id}
                  </div>
                  <div className="text-[9px] text-white/70 truncate">
                    {chair.name}
                  </div>
                </div>

                {/* Selection check */}
                {isSelected && (
                  <div className="absolute right-1.5 top-1.5 rounded-full bg-primary p-1 shadow-md animate-in zoom-in duration-200">
                    <Check
                      className="h-3 w-3 text-primary-foreground"
                      strokeWidth={3}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected chair info */}
      {selectedChairId && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-xs font-semibold text-foreground">
                {CHAIR_CATALOG.find((c) => c.id === selectedChairId)?.name}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {
                  CHAIR_CATALOG.find((c) => c.id === selectedChairId)
                    ?.description
                }
              </div>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/60 px-2 py-1 rounded bg-background/50">
              {selectedChairId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
