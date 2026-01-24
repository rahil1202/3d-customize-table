/**
 * Table Selector - Visual grid for selecting table base designs
 *
 * Displays client's table catalog images (K-DT-01 to K-DT-55) with
 * filtering by base style category.
 */

import { useState } from "react";
import { useConfigStore } from "@/store/configStore";
import {
  TABLE_CATALOG,
  TABLE_BASE_STYLE_LABELS,
  type TableDefinition,
  type TableBaseStyle,
} from "@/config/tableCatalog";
import { cn } from "@/lib/utils";
import { Check, Image as ImageIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableSelectorProps {
  onSelect?: (table: TableDefinition) => void;
}

export function TableSelector({ onSelect }: TableSelectorProps) {
  const { selectedTableId, setTable } = useConfigStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<TableBaseStyle | "all">("all");

  const handleSelect = (table: TableDefinition) => {
    setTable(table.id);
    onSelect?.(table);
  };

  const filteredCatalog =
    activeStyle === "all"
      ? TABLE_CATALOG
      : TABLE_CATALOG.filter((item) => item.baseStyle === activeStyle);

  // Get unique styles that have tables
  const availableStyles = [...new Set(TABLE_CATALOG.map((t) => t.baseStyle))];

  return (
    <div className="space-y-3">
      {/* Style filter */}
      <div className="flex items-center gap-1 flex-wrap">
        <Filter className="h-3 w-3 text-muted-foreground mr-1" />
        <Button
          variant={activeStyle === "all" ? "secondary" : "ghost"}
          size="sm"
          className="h-5 text-[9px] px-1.5"
          onClick={() => setActiveStyle("all")}
        >
          All
        </Button>
        {availableStyles.map((style) => (
          <Button
            key={style}
            variant={activeStyle === style ? "secondary" : "ghost"}
            size="sm"
            className="h-5 text-[9px] px-1.5"
            onClick={() => setActiveStyle(style)}
          >
            {TABLE_BASE_STYLE_LABELS[style]}
          </Button>
        ))}
      </div>

      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        Select Table Design ({filteredCatalog.length} options)
      </div>

      {/* Scrollable grid container */}
      <div className="max-h-[280px] overflow-y-auto pr-1 -mr-1">
        <div className="grid grid-cols-5 gap-2">
          {filteredCatalog.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isHovered = hoveredId === table.id;

            return (
              <button
                key={table.id}
                onClick={() => handleSelect(table)}
                onMouseEnter={() => setHoveredId(table.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all duration-300",
                  "hover:scale-[1.03] active:scale-[0.98]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isSelected
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-muted hover:border-primary/40",
                )}
              >
                {/* Table image - show cropped section based on thumbnailIndex */}
                <div className="absolute inset-0 bg-muted/30 overflow-hidden">
                  {table.thumbnail ? (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${table.thumbnail})`,
                        backgroundSize: "100% 500%",
                        backgroundPosition: `center ${table.thumbnailIndex * 20}%`,
                        transition: "transform 0.3s",
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
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
                    {table.id}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected table info */}
      {selectedTableId && (
        <div className="mt-2 rounded-lg bg-muted/50 p-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">
                {TABLE_CATALOG.find((t) => t.id === selectedTableId)?.name}
              </div>
              <div className="text-[10px] text-muted-foreground truncate">
                {
                  TABLE_CATALOG.find((t) => t.id === selectedTableId)
                    ?.description
                }
              </div>
            </div>
            <div className="text-[9px] font-mono text-muted-foreground/60 px-1.5 py-0.5 rounded bg-background/50">
              {selectedTableId}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
