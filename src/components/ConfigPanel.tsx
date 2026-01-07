/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  useConfigStore,
  WoodColor,
  FootCapMaterial,
  LeatherColor,
  StitchingColor,
  LightingMood,
  BackgroundPreset,
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Armchair,
  Check,
  Grid3X3,
  Hammer,
  Palette,
  Ruler,
  Sparkles,
  SunMedium,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
export type FocusPart =
  | "table-design"
  | "size"
  | "tabletop"
  | "finish"
  | "chairs"
  | "structural"
  | "scene"
  | null;

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
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
          {label}
        </h3>
      )}
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className={cn(
          "grid gap-2",
          columns === 3 ? "grid-cols-3" : "grid-cols-2"
        )}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 px-2 py-3 text-center transition-all duration-200 ease-in-out hover:bg-accent hover:border-accent-foreground/20",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-muted bg-transparent text-muted-foreground"
              )}
            >
              <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
              <span
                className={cn(
                  "text-xs font-medium leading-tight",
                  isSelected ? "text-primary" : "text-foreground/80"
                )}
              >
                {opt.label}
              </span>
              {isSelected && (
                <div className="absolute right-1.5 top-1.5 text-primary">
                  <Check className="h-2.5 w-2.5" />
                </div>
              )}
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}

const SectionHeader = ({ icon: Icon, title }: { icon?: any; title: string }) => (
  <div className="mb-3 flex items-center gap-2 border-b pb-2 text-muted-foreground">
    {Icon && <Icon className="h-3.5 w-3.5" />}
    <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
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
  // Store selectors
  const tableDesign = useConfigStore((s) => s.tableDesign);
  const sizePreset = useConfigStore((s) => s.sizePreset);
  const marbleShape = useConfigStore((s) => s.marbleShape);
  const marbleMaterial = useConfigStore((s) => s.marbleMaterial);
  const woodMaterial = useConfigStore((s) => s.woodMaterial);
  const chair = useConfigStore((s) => s.chair);
  const leather = useConfigStore((s) => s.leather);
  const structural = useConfigStore((s) => s.structural);
  const scene = useConfigStore((s) => s.scene);
  const setConfig = useConfigStore((s) => s.setConfig);

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
          "group relative flex h-16 flex-1 min-w-[4.5rem] flex-col gap-1.5 rounded-none transition-all hover:bg-muted/50",
          isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
        )}
        // The magic happens here: telling the parent to focus the 3D camera
        onClick={() => onFocusPartChange(partId)}
      >
        {isActive && (
          <span className="absolute left-0 right-0 top-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
        )}
        
        <div className={cn(
            "rounded-full p-1.5 transition-all duration-300",
            isActive ? "bg-primary/10 translate-y-1 scale-110" : "group-hover:bg-muted"
        )}>
           <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </Button>
    </PopoverTrigger>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t bg-background/90 px-2 pb-safe backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="flex w-full max-w-5xl items-center justify-between overflow-x-auto no-scrollbar sm:justify-center sm:gap-1">
        
        {/* 1. Table Style */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Table2} label="Style" isActive={focusPart === "table-design"} partId="table-design" />
          <PopoverContent className="w-80 rounded-xl p-5 shadow-2xl" side="top" sideOffset={12}>
            <SectionHeader icon={Table2} title="Table Design" />
            <CompactRadioGroup
              value={tableDesign.style}
              onChange={(style) => setConfig({ tableDesign: { ...tableDesign, style } })}
              options={[
                { value: "classic_straight_leg", label: "Classic Straight" },
                { value: "modern_slab_leg", label: "Modern Slab" },
                { value: "sculpted_leg", label: "Sculpted" },
                { value: "minimal_floating", label: "Minimal Float" },
                { value: "cross_trestle", label: "Cross Trestle" },
              ]}
            />
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 opacity-30" />

        {/* 2. Size */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Ruler} label="Size" isActive={focusPart === "size"} partId="size" />
          <PopoverContent className="w-72 rounded-xl p-5 shadow-2xl" side="top" sideOffset={12}>
             <SectionHeader icon={Ruler} title="Dimensions" />
            <CompactRadioGroup
              columns={3}
              value={sizePreset}
              onChange={(sizePreset) => setConfig({ sizePreset })}
              options={[
                { value: "4_seater", label: "4 Seater" },
                { value: "6_seater", label: "6 Seater" },
                { value: "8_seater", label: "8 Seater" },
              ]}
            />
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 opacity-30" />

        {/* 3. Table Top */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Grid3X3} label="Tabletop" isActive={focusPart === "tabletop"} partId="tabletop" />
          <PopoverContent className="w-[420px] rounded-xl p-0 shadow-2xl overflow-hidden" side="top" sideOffset={12}>
            <Tabs defaultValue="shape" className="w-full">
              <div className="bg-muted/30 p-2">
                  <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted/60 p-1">
                    <TabsTrigger value="shape" className="rounded-md text-xs">Shape</TabsTrigger>
                    <TabsTrigger value="material" className="rounded-md text-xs">Material</TabsTrigger>
                  </TabsList>
              </div>

              <TabsContent value="shape" className="p-5 pt-2">
                <CompactRadioGroup
                  label="Surface Geometry"
                  value={marbleShape.shape}
                  onChange={(shape) => setConfig({ marbleShape: { ...marbleShape, shape } })}
                  options={[
                    { value: "rectangle", label: "Rectangle" },
                    { value: "oval", label: "Oval" },
                    { value: "rounded_rectangle", label: "Rounded" },
                    { value: "boat", label: "Boat" },
                    { value: "soft_organic", label: "Organic" },
                  ]}
                />
              </TabsContent>

              <TabsContent value="material" className="p-5 pt-2 space-y-5">
                <CompactRadioGroup
                  label="Marble Type"
                  value={marbleMaterial.color}
                  onChange={(color) => setConfig({ marbleMaterial: { ...marbleMaterial, color } })}
                  options={[
                    { value: "white_carrara", label: "White Carrara" },
                    { value: "beige_cream", label: "Beige Cream" },
                    { value: "grey_veined", label: "Grey Veined" },
                    { value: "black_marble", label: "Black" },
                    { value: "green_exotic", label: "Exotic Green" },
                  ]}
                />
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Surface Finish</h3>
                  <CompactRadioGroup
                    columns={3}
                    value={marbleMaterial.finish}
                    onChange={(finish) => setConfig({ marbleMaterial: { ...marbleMaterial, finish } })}
                    options={[
                      { value: "polished", label: "Polished" },
                      { value: "honed", label: "Matte" },
                      { value: "leathered", label: "Textured" },
                    ]}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 opacity-30" />

        {/* 4. Wood Finish */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Sparkles} label="Finish" isActive={focusPart === "finish"} partId="finish" />
          <PopoverContent className="w-80 rounded-xl p-5 shadow-2xl" side="top" sideOffset={12}>
            <SectionHeader icon={Palette} title="Wood Treatment" />
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs">Wood Tone</Label>
                <Select
                  value={woodMaterial.color}
                  onValueChange={(color: WoodColor) => setConfig({ woodMaterial: { ...woodMaterial, color } })}
                >
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Oak</SelectItem>
                    <SelectItem value="walnut_dark">Dark Walnut</SelectItem>
                    <SelectItem value="oak_light">Light Oak</SelectItem>
                    <SelectItem value="espresso">Espresso</SelectItem>
                    <SelectItem value="charcoal">Charcoal Black</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CompactRadioGroup
                label="Lacquer Sheen"
                columns={3}
                value={woodMaterial.finish}
                onChange={(finish) => setConfig({ woodMaterial: { ...woodMaterial, finish } })}
                options={[
                  { value: "matte", label: "Matte" },
                  { value: "satin", label: "Satin" },
                  { value: "semi_gloss", label: "Gloss" },
                ]}
              />
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 opacity-30" />

        {/* 5. Chairs */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Armchair} label="Chairs" isActive={focusPart === "chairs"} partId="chairs" />
          <PopoverContent className="w-[500px] rounded-xl p-0 shadow-2xl overflow-hidden" side="top" sideOffset={12}>
            <Tabs defaultValue="style" className="w-full">
              <div className="bg-muted/30 p-2">
                  <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/60 p-1">
                    <TabsTrigger value="style" className="rounded-md text-xs">Shape</TabsTrigger>
                    <TabsTrigger value="leather" className="rounded-md text-xs">Upholstery</TabsTrigger>
                    <TabsTrigger value="comfort" className="rounded-md text-xs">Ergonomics</TabsTrigger>
                  </TabsList>
              </div>

              <TabsContent value="style" className="p-5 pt-2 grid grid-cols-2 gap-6">
                <CompactRadioGroup
                  label="Silhouette"
                  value={chair.style}
                  onChange={(style) => setConfig({ chair: { ...chair, style } })}
                  options={[
                    { value: "minimal_modern", label: "Minimal" },
                    { value: "arm_chair", label: "Armchair" },
                    { value: "high_back", label: "High-Back" },
                    { value: "low_back", label: "Low-Back" },
                    { value: "bench", label: "Bench" },
                  ]}
                />
                <div className="space-y-4">
                  <CompactRadioGroup
                    label="Armrests"
                    value={chair.armrestStyle}
                    onChange={(armrestStyle) => setConfig({ chair: { ...chair, armrestStyle } })}
                    options={[{ value: "none", label: "None" }, { value: "slim", label: "Slim" }, { value: "full", label: "Full" }]}
                  />
                  <CompactRadioGroup
                    label="Back Pattern"
                    value={chair.backrestPattern}
                    onChange={(backrestPattern) => setConfig({ chair: { ...chair, backrestPattern } })}
                    options={[{ value: "plain", label: "Plain" }, { value: "stitched", label: "Stitched" }, { value: "cut_out", label: "Cut-out" }]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="leather" className="p-5 pt-2 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Leather Color</Label>
                  <Select value={leather.color} onValueChange={(color: LeatherColor) => setConfig({ leather: { ...leather, color } })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">Midnight Black</SelectItem>
                      <SelectItem value="tan">Classic Tan</SelectItem>
                      <SelectItem value="brown">Rich Brown</SelectItem>
                      <SelectItem value="grey">Slate Grey</SelectItem>
                      <SelectItem value="white">Ivory White</SelectItem>
                      <SelectItem value="olive">Olive Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Stitching Style</Label>
                  <Select value={leather.stitchingColor} onValueChange={(stitchingColor: StitchingColor) => setConfig({ leather: { ...leather, stitchingColor } })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Matched</SelectItem>
                      <SelectItem value="contrast">Contrast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 mt-2">
                  <CompactRadioGroup
                    columns={3}
                    label="Texture Finish"
                    value={leather.finish}
                    onChange={(finish) => setConfig({ leather: { ...leather, finish } })}
                    options={[{ value: "smooth", label: "Smooth" }, { value: "grained", label: "Grained" }, { value: "distressed", label: "Distressed" }]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="comfort" className="p-5 pt-2 space-y-5">
                <CompactRadioGroup
                  columns={3}
                  label="Cushion Firmness"
                  value={leather.cushionFirmness}
                  onChange={(v) => setConfig({ leather: { ...leather, cushionFirmness: v } })}
                  options={[{ value: "soft", label: "Plush" }, { value: "medium", label: "Medium" }, { value: "firm", label: "Firm" }]}
                />
                <Separator />
                <CompactRadioGroup
                   columns={3}
                  label="Seat Padding"
                  value={leather.seatPadding}
                  onChange={(v) => setConfig({ leather: { ...leather, seatPadding: v } })}
                  options={[{ value: "slim", label: "Slim" }, { value: "standard", label: "Standard" }, { value: "plush", label: "Extra Plush" }]}
                />
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 opacity-30" />

        {/* 6. Structural */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Hammer} label="Details" isActive={focusPart === "structural"} partId="structural" />
          <PopoverContent className="w-80 rounded-xl p-5 shadow-2xl" side="top" sideOffset={12}>
             <SectionHeader icon={Hammer} title="Construction" />
            <div className="space-y-5">
              <CompactRadioGroup
                columns={3}
                label="Leg Thickness"
                value={structural.legThickness}
                onChange={(v) => setConfig({ structural: { ...structural, legThickness: v } })}
                options={[{ value: "slim", label: "Slim" }, { value: "medium", label: "Regular" }, { value: "thick", label: "Thick" }]}
              />
              <CompactRadioGroup
                columns={3}
                label="Stretchers"
                value={structural.stretcherStyle}
                onChange={(v) => setConfig({ structural: { ...structural, stretcherStyle: v } })}
                options={[{ value: "straight", label: "Straight" }, { value: "cross", label: "Cross" }, { value: "hidden", label: "Hidden" }]}
              />
              <div className="space-y-2">
                <Label className="text-xs">Foot Caps</Label>
                <Select value={structural.footCapMaterial} onValueChange={(v: FootCapMaterial) => setConfig({ structural: { ...structural, footCapMaterial: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wood">Wood (Matches Leg)</SelectItem>
                    <SelectItem value="metal">Brushed Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 opacity-30" />

        {/* 7. Scene */}
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={SunMedium} label="Scene" isActive={focusPart === "scene"} partId="scene" />
          <PopoverContent className="w-72 rounded-xl p-5 shadow-2xl mr-4" side="top" sideOffset={12} align="end">
             <SectionHeader icon={SunMedium} title="Environment" />
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs">Lighting Setup</Label>
                <Select value={scene.lightingMood} onValueChange={(v: LightingMood) => setConfig({ scene: { ...scene, lightingMood: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soft_daylight">Soft Daylight</SelectItem>
                    <SelectItem value="warm_indoor">Warm Indoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Background</Label>
                <Select value={scene.background} onValueChange={(v: BackgroundPreset) => setConfig({ scene: { ...scene, background: v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio Grey</SelectItem>
                    <SelectItem value="subtle_interior">Abstract Interior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CompactRadioGroup
                label="Shadow Intensity"
                value={scene.shadowIntensity}
                onChange={(v) => setConfig({ scene: { ...scene, shadowIntensity: v } })}
                options={[{ value: "low", label: "Soft" }, { value: "medium", label: "Sharp" }]}
              />
            </div>
          </PopoverContent>
        </Popover>

      </div>
    </div>
  );
}