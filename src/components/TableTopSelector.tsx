/**
 * Table Top Selector - Visual grid for selecting marble/stone styles
 *
 * Displays client's marble catalog images (VR-001 to VR-025) as a scrollable grid
 * for visual selection of table top materials.
 */

import { useState } from "react";
import { useConfigStore } from "@/store/configStore";
import {
  TABLE_TOP_CATALOG,
  type TableTopDefinition,
  type MarbleCategory,
} from "@/config/tableTopCatalog";
import { cn } from "@/lib/utils";
import { Check, Image as ImageIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableTopSelectorProps {
  onSelect?: (tableTop: TableTopDefinition) => void;
}

const CATEGORY_LABELS: Record<MarbleCategory, string> = {
  white: "White",
  grey: "Grey",
  dark: "Dark",
  exotic: "Exotic",
  cream: "Cream",
};

export function TableTopSelector({ onSelect }: TableTopSelectorProps) {
  const { selectedTableTopId, setTableTop } = useConfigStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<MarbleCategory | "all">(
    "all",
  );

  const handleSelect = (tableTop: TableTopDefinition) => {
    setTableTop(tableTop.id);
    onSelect?.(tableTop);
  };

  const filteredCatalog =
    activeCategory === "all"
      ? TABLE_TOP_CATALOG
      : TABLE_TOP_CATALOG.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-3">
      {/* Category filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter className="h-3 w-3 text-muted-foreground mr-1" />
        <Button
          variant={activeCategory === "all" ? "secondary" : "ghost"}
          size="sm"
          className="h-6 text-[10px] px-2"
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        {(Object.keys(CATEGORY_LABELS) as MarbleCategory[]).map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "secondary" : "ghost"}
            size="sm"
            className="h-6 text-[10px] px-2"
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        Select Stone ({filteredCatalog.length} options)
      </div>

      {/* Scrollable grid container */}
      <div className="max-h-[300px] overflow-y-auto pr-1 -mr-1">
        <div className="grid grid-cols-5 gap-2">
          {filteredCatalog.map((tableTop) => {
            const isSelected = selectedTableTopId === tableTop.id;
            const isHovered = hoveredId === tableTop.id;

            return (
              <button
                key={tableTop.id}
                onClick={() => handleSelect(tableTop)}
                onMouseEnter={() => setHoveredId(tableTop.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300",
                  "hover:scale-[1.03] active:scale-[0.98]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-muted hover:border-primary/40",
                )}
              >
                {/* Stone image */}
                <div className="absolute inset-0 bg-muted/30">
                  {tableTop.thumbnail ? (
                    <img
                      src={tableTop.thumbnail}
                      alt={tableTop.name}
                      className={cn(
                        "h-full w-full object-cover object-center transition-transform duration-300",
                        isHovered && "scale-110",
                      )}
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center"
                      style={{ backgroundColor: tableTop.baseColor }}
                    >
                      <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Selection check */}
                {isSelected && (
                  <div className="absolute right-1 top-1 rounded-full bg-primary p-0.5 shadow-md animate-in zoom-in duration-200">
                    <Check
                      className="h-2.5 w-2.5 text-primary-foreground"
                      strokeWidth={3}
                    />
                  </div>
                )}

                {/* ID label on hover */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5",
                    "transition-all duration-300",
                    isSelected || isHovered
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0",
                  )}
                >
                  <div className="text-[8px] font-bold text-white text-center truncate">
                    {tableTop.id}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected stone info */}
      {selectedTableTopId && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            {/* Preview swatch */}
            <div className="w-12 h-12 rounded-lg border overflow-hidden flex-shrink-0">
              <img
                src={
                  TABLE_TOP_CATALOG.find((t) => t.id === selectedTableTopId)
                    ?.thumbnail
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">
                {
                  TABLE_TOP_CATALOG.find((t) => t.id === selectedTableTopId)
                    ?.name
                }
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {
                  TABLE_TOP_CATALOG.find((t) => t.id === selectedTableTopId)
                    ?.description
                }
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">
                {selectedTableTopId}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
