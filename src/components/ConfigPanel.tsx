/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import {
  useConfigStore,
  WoodColor,
  LeatherColor,
  EnvironmentPreset,
} from "@/store/configStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Armchair,
  Check,
  Grid3X3,
  Layers,
  Palette,
  Scaling,
  Scan,
  ShoppingBag,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChairSelector } from "@/components/ChairSelector";
import { getChairById } from "@/config/chairCatalog";
import { TableTopSelector } from "@/components/TableTopSelector";
import { getTableTopById } from "@/config/tableTopCatalog";
import { TableSelector } from "@/components/TableSelector";
import { getTableById } from "@/config/tableCatalog";

// --- Types ---
export type FocusPart =
  | "table-design"
  | "size"
  | "tabletop"
  | "finish"
  | "chairs"
  | "scene"
  | null;

// --- Helper: Pricing Logic ---
const calculatePrice = (
  size: string,
  tableTopId: string,
  wood: string,
  leather: string,
  chairs: number,
) => {
  let base = 12999;
  if (size === "6_seater") base += 4000;
  if (size === "8_seater") base += 8000;

  // Use table top catalog to determine pricing
  const tableTop = getTableTopById(tableTopId);
  if (tableTop?.category === "exotic" || tableTop?.category === "dark")
    base += 3500;

  if (wood === "walnut_dark") base += 2000;
  if (leather === "tan" || leather === "olive") base += chairs * 500;
  return base;
};

// --- Helper Components ---
function CompactRadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  columns = 2,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; description?: string }[];
  columns?: 2 | 3;
}) {
  return (
    <div className="space-y-3">
      {label && (
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          {label}
        </h3>
      )}
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className={cn(
          "grid gap-2.5",
          columns === 3 ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center transition-all duration-300 ease-out",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-primary/5 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]"
                  : "border-muted bg-transparent hover:border-primary/30 hover:bg-muted/30",
              )}
            >
              <RadioGroupItem
                value={opt.value}
                id={opt.value}
                className="sr-only"
              />
              <span
                className={cn(
                  "text-xs font-semibold leading-tight",
                  isSelected
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {opt.label}
              </span>
              {isSelected && (
                <div className="absolute right-1.5 top-1.5 animate-in zoom-in duration-300 text-primary">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon?: any;
  title: string;
}) => (
  <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3 text-foreground/80">
    <div className="rounded-md bg-primary/10 p-1.5 text-primary">
      {Icon && <Icon className="h-4 w-4" />}
    </div>
    <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
  </div>
);

// --- Main Component ---

export function ConfigPanel({
  focusPart,
  onFocusPartChange,
}: {
  focusPart: FocusPart;
  onFocusPartChange: (part: FocusPart) => void;
}) {
  const store = useConfigStore();
  const setConfig = store.setConfig;
  const setScene = store.setScene;

  const chairCount =
    store.sizePreset === "4_seater"
      ? 4
      : store.sizePreset === "6_seater"
        ? 6
        : 8;
  const price = useMemo(
    () =>
      calculatePrice(
        store.sizePreset,
        store.selectedTableTopId,
        store.woodMaterial.color,
        store.leather.color,
        chairCount,
      ),
    [
      store.sizePreset,
      store.selectedTableTopId,
      store.woodMaterial,
      store.leather,
      chairCount,
    ],
  );

  // --- Toolbar Trigger Button ---
  const ConfigTrigger = ({
    icon: Icon,
    label,
    isActive,
    partId,
  }: {
    icon: any;
    label: string;
    isActive: boolean;
    partId: FocusPart;
  }) => (
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        className={cn(
          "group relative flex h-20 flex-1 min-w-[5rem] flex-col gap-2 rounded-none transition-all duration-500 ease-out hover:bg-transparent",
          isActive
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => onFocusPartChange(partId)}
      >
        <span
          className={cn(
            "absolute top-0 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-primary transition-all duration-500 ease-out",
            isActive && "w-full shadow-[0_0_12px_rgba(var(--primary),0.8)]",
          )}
        />
        <div
          className={cn(
            "rounded-2xl p-2.5 transition-all duration-500 ease-out will-change-transform",
            isActive
              ? "bg-primary/10 -translate-y-1 scale-110 shadow-sm"
              : "bg-muted/40 group-hover:bg-muted group-hover:-translate-y-1",
          )}
        >
          <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </Button>
    </PopoverTrigger>
  );

  return (
    <>
      {/* Floating Top Right Controls */}
      <div className="fixed top-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Reset View Button */}

        {/* Estimate Card */}
        <div className="hidden mt-16 sm:flex flex-col items-end rounded-2xl border border-white/20 bg-background/60 p-5 shadow-2xl backdrop-blur-xl transition-all hover:bg-background/80 hover:scale-[1.02]">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <ShoppingBag className="h-3 w-3" /> Estimate
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-foreground">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-muted-foreground">INR</span>
          </div>
          <div className="mt-2 w-full">
            <Button
              size="sm"
              className="w-full gap-2 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="fixed bottom-6 left-4 right-4 z-50 mx-auto flex max-w-4xl justify-center rounded-3xl border border-white/20 bg-background/80 px-2 pb-1 pt-1 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center justify-between overflow-x-auto no-scrollbar sm:justify-center sm:gap-2">
          {/* 1. TABLE DESIGN */}
          <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
            <ConfigTrigger
              icon={Layers}
              label="Style"
              isActive={focusPart === "table-design"}
              partId="table-design"
            />
            <PopoverContent
              className="w-[580px] rounded-2xl p-5 shadow-2xl ring-1 ring-black/5"
              side="top"
              sideOffset={20}
            >
              <SectionHeader icon={Layers} title="Table Base Design" />
              <TableSelector />
            </PopoverContent>
          </Popover>

          <div className="h-10 w-px bg-border/50" />

          {/* 2. SIZE */}
          <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
            <ConfigTrigger
              icon={Scaling}
              label="Size"
              isActive={focusPart === "size"}
              partId="size"
            />
            <PopoverContent
              className="w-72 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5"
              side="top"
              sideOffset={20}
            >
              <SectionHeader icon={Scaling} title="Capacity" />
              <CompactRadioGroup
                columns={3}
                value={store.sizePreset}
                onChange={(sizePreset) => setConfig({ sizePreset })}
                options={[
                  { value: "4_seater", label: "4 Seats" },
                  { value: "6_seater", label: "6 Seats" },
                  { value: "8_seater", label: "8 Seats" },
                ]}
              />
            </PopoverContent>
          </Popover>

          <div className="h-10 w-px bg-border/50" />

          {/* 3. TABLETOP (SHAPE & STONE) */}
          <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
            <ConfigTrigger
              icon={Grid3X3}
              label="Stone"
              isActive={focusPart === "tabletop"}
              partId="tabletop"
            />
            <PopoverContent
              className="w-[580px] rounded-2xl p-0 shadow-2xl overflow-hidden ring-1 ring-black/5"
              side="top"
              sideOffset={20}
            >
              <Tabs defaultValue="material" className="w-full">
                <div className="bg-muted/40 p-2">
                  <TabsList className="grid w-full grid-cols-2 rounded-xl bg-background/50 p-1 shadow-sm">
                    <TabsTrigger
                      value="material"
                      className="rounded-lg text-xs font-semibold"
                    >
                      Stone
                    </TabsTrigger>
                    <TabsTrigger
                      value="shape"
                      className="rounded-lg text-xs font-semibold"
                    >
                      Shape
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-4">
                  <TabsContent value="material" className="mt-0">
                    <TableTopSelector />
                  </TabsContent>
                  <TabsContent value="shape" className="mt-0">
                    <CompactRadioGroup
                      value={store.marbleShape.shape}
                      onChange={(shape) =>
                        setConfig({
                          marbleShape: { ...store.marbleShape, shape },
                        })
                      }
                      options={[
                        { value: "rectangle", label: "Rectangle" },
                        { value: "rounded_rectangle", label: "Soft Rect" },
                        { value: "oval", label: "Oval" },
                        { value: "soft_organic", label: "Organic" },
                        { value: "boat", label: "Boat" },
                      ]}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </PopoverContent>
          </Popover>

          <div className="h-10 w-px bg-border/50" />

          {/* 4. FINISH (WOOD POLISH COLOUR) */}
          <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
            <ConfigTrigger
              icon={Palette}
              label="Wood"
              isActive={focusPart === "finish"}
              partId="finish"
            />
            <PopoverContent
              className="w-80 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5"
              side="top"
              sideOffset={20}
            >
              <SectionHeader icon={Palette} title="Wood Finish" />
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Wood Tone
                  </Label>
                  <Select
                    value={store.woodMaterial.color}
                    onValueChange={(color: WoodColor) =>
                      setConfig({
                        woodMaterial: { ...store.woodMaterial, color },
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-2 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural Oak</SelectItem>
                      <SelectItem value="walnut_dark">
                        American Walnut
                      </SelectItem>
                      <SelectItem value="oak_light">White Oak</SelectItem>
                      <SelectItem value="espresso">Espresso Stain</SelectItem>
                      <SelectItem value="charcoal">Charcoal Ash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-10 w-px bg-border/50" />

          {/* 5. CHAIRS (DESIGN & LEATHER) */}
          <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
            <ConfigTrigger
              icon={Armchair}
              label="Chairs"
              isActive={focusPart === "chairs"}
              partId="chairs"
            />
            <PopoverContent
              className="w-[520px] rounded-2xl p-0 shadow-2xl overflow-hidden ring-1 ring-black/5"
              side="top"
              sideOffset={20}
            >
              <Tabs defaultValue="design" className="w-full">
                <div className="bg-muted/40 p-2">
                  <TabsList className="grid w-full grid-cols-2 rounded-xl bg-background/50 p-1 shadow-sm">
                    <TabsTrigger
                      value="design"
                      className="rounded-lg text-xs font-semibold"
                    >
                      Design
                    </TabsTrigger>
                    <TabsTrigger
                      value="leather"
                      className="rounded-lg text-xs font-semibold"
                    >
                      Upholstery
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-4">
                  <TabsContent value="design" className="mt-0">
                    <ChairSelector />
                  </TabsContent>

                  <TabsContent value="leather" className="mt-0 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Leather Tone
                      </Label>
                      <Select
                        value={store.leather.color}
                        onValueChange={(color: LeatherColor) =>
                          setConfig({ leather: { ...store.leather, color } })
                        }
                      >
                        <SelectTrigger className="h-11 rounded-lg border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black">Midnight Black</SelectItem>
                          <SelectItem value="tan">Cognac Tan</SelectItem>
                          <SelectItem value="brown">Espresso Brown</SelectItem>
                          <SelectItem value="grey">Slate Grey</SelectItem>
                          <SelectItem value="white">Ivory White</SelectItem>
                          <SelectItem value="olive">Olive Green</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preview current chair with selected material */}
                    <div className="rounded-lg bg-muted/50 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
                        Current Selection
                      </div>
                      <div className="text-xs text-foreground">
                        {getChairById(store.selectedChairId)?.name ||
                          "No chair selected"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Leather: {store.leather.color.replace("_", " ")}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </PopoverContent>
          </Popover>

          <div className="h-10 w-px bg-border/50" />

          {/* 6. SCENE SETTINGS */}
          <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
            <ConfigTrigger
              icon={Scan}
              label="Scene"
              isActive={focusPart === "scene"}
              partId="scene"
            />
            <PopoverContent
              className="w-72 rounded-2xl p-5 shadow-2xl mr-4 ring-1 ring-black/5"
              side="top"
              sideOffset={20}
              align="end"
            >
              <SectionHeader icon={Home} title="Environment" />
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Lighting & Vibe
                  </Label>
                  <Select
                    value={store.scene.environment}
                    onValueChange={(v: EnvironmentPreset) =>
                      setScene({ environment: v })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">
                        Modern Apartment
                      </SelectItem>
                      <SelectItem value="studio">Photo Studio</SelectItem>
                      <SelectItem value="city">City Daylight</SelectItem>
                      <SelectItem value="sunset">Golden Hour</SelectItem>
                      <SelectItem value="night">Cozy Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}
