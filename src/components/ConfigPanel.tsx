/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
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
  Expand,
  Grid3X3,
  Layers,
  Palette,
  Scaling,
  Scan,
  ShoppingBag,
  Sparkles,
  SunMedium,
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

// --- Helper: Pricing Logic ---
const calculatePrice = (
  size: string, 
  marble: string, 
  wood: string, 
  leather: string,
  chairs: number
) => {
  let base = 1299; 
  if (size === "6_seater") base += 400;
  if (size === "8_seater") base += 800;
  if (marble.includes("green") || marble.includes("black")) base += 350; 
  if (marble.includes("white")) base += 150;
  if (wood === "walnut_dark") base += 200; 
  if (leather === "tan" || leather === "olive") base += (chairs * 50); 
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
          columns === 3 ? "grid-cols-3" : "grid-cols-2"
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
                  : "border-muted bg-transparent hover:border-primary/30 hover:bg-muted/30"
              )}
            >
              <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
              <span
                className={cn(
                  "text-xs font-semibold leading-tight",
                  isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
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

const SectionHeader = ({ icon: Icon, title }: { icon?: any; title: string }) => (
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

  const chairCount = store.sizePreset === "4_seater" ? 4 : store.sizePreset === "6_seater" ? 6 : 8;
  const price = useMemo(() => calculatePrice(
    store.sizePreset,
    store.marbleMaterial.color,
    store.woodMaterial.color,
    store.leather.color,
    chairCount
  ), [store.sizePreset, store.marbleMaterial, store.woodMaterial, store.leather]);

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
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onFocusPartChange(partId)}
      >
        {/* Active Line Indicator */}
        <span className={cn(
            "absolute top-0 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-primary transition-all duration-500 ease-out",
            isActive && "w-full shadow-[0_0_12px_rgba(var(--primary),0.8)]"
        )} />
        
        {/* Icon Container */}
        <div className={cn(
            "rounded-2xl p-2.5 transition-all duration-500 ease-out will-change-transform",
            isActive 
              ? "bg-primary/10 -translate-y-1 scale-110 shadow-sm" 
              : "bg-muted/40 group-hover:bg-muted group-hover:-translate-y-1"
        )}>
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
    {/* Floating Price Card */}
    <div className="pointer-events-none fixed top-24 right-6 z-40 hidden flex-col items-end gap-3 sm:flex animate-in slide-in-from-right-8 fade-in duration-700">
        <div className="pointer-events-auto flex flex-col items-end rounded-2xl border border-white/20 bg-background/60 p-5 shadow-2xl backdrop-blur-xl transition-all hover:bg-background/80 hover:scale-[1.02]">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <ShoppingBag className="h-3 w-3" /> Estimate
            </span>
            <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-foreground">
                    ${price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-muted-foreground">USD</span>
            </div>
            <div className="mt-2 w-full">
                <Button size="sm" className="w-full gap-2 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-transform active:scale-95">
                    Add to Cart
                </Button>
            </div>
        </div>
    </div>

    {/* Bottom Floating Bar */}
    <div className="fixed bottom-6 left-4 right-4 z-50 mx-auto flex max-w-4xl justify-center rounded-3xl border border-white/20 bg-background/80 px-2 pb-1 pt-1 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between overflow-x-auto no-scrollbar sm:justify-center sm:gap-2">
        
        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Layers} label="Style" isActive={focusPart === "table-design"} partId="table-design" />
          <PopoverContent className="w-80 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5" side="top" sideOffset={20}>
            <SectionHeader icon={Layers} title="Table Base" />
            <CompactRadioGroup
              value={store.tableDesign.style}
              onChange={(style) => setConfig({ tableDesign: { ...store.tableDesign, style } })}
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

        <div className="h-10 w-px bg-border/50" />

        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Scaling} label="Size" isActive={focusPart === "size"} partId="size" />
          <PopoverContent className="w-72 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5" side="top" sideOffset={20}>
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

        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Grid3X3} label="Stone" isActive={focusPart === "tabletop"} partId="tabletop" />
          <PopoverContent className="w-[420px] rounded-2xl p-0 shadow-2xl overflow-hidden ring-1 ring-black/5" side="top" sideOffset={20}>
            <Tabs defaultValue="shape" className="w-full">
              <div className="bg-muted/40 p-2">
                  <TabsList className="grid w-full grid-cols-2 rounded-xl bg-background/50 p-1 shadow-sm">
                    <TabsTrigger value="shape" className="rounded-lg text-xs font-semibold">Shape</TabsTrigger>
                    <TabsTrigger value="material" className="rounded-lg text-xs font-semibold">Material</TabsTrigger>
                  </TabsList>
              </div>
              <div className="p-5 pt-2">
                <TabsContent value="shape">
                    <CompactRadioGroup
                    value={store.marbleShape.shape}
                    onChange={(shape) => setConfig({ marbleShape: { ...store.marbleShape, shape } })}
                    options={[
                        { value: "rectangle", label: "Rectangle" },
                        { value: "oval", label: "Oval" },
                        { value: "rounded_rectangle", label: "Soft Rect" },
                        { value: "boat", label: "Boat" },
                        { value: "soft_organic", label: "Organic" },
                    ]}
                    />
                </TabsContent>
                <TabsContent value="material" className="space-y-6">
                    <CompactRadioGroup
                    label="Stone Type"
                    value={store.marbleMaterial.color}
                    onChange={(color) => setConfig({ marbleMaterial: { ...store.marbleMaterial, color } })}
                    options={[
                        { value: "white_carrara", label: "Carrara White" },
                        { value: "beige_cream", label: "Crema Marfil" },
                        { value: "grey_veined", label: "Grey Stone" },
                        { value: "black_marble", label: "Nero Marquina" },
                        { value: "green_exotic", label: "Verde Guatemala" },
                    ]}
                    />
                    <CompactRadioGroup
                        columns={3}
                        label="Surface Polish"
                        value={store.marbleMaterial.finish}
                        onChange={(finish) => setConfig({ marbleMaterial: { ...store.marbleMaterial, finish } })}
                        options={[
                        { value: "polished", label: "Polished" },
                        { value: "honed", label: "Honed" },
                        { value: "leathered", label: "Textured" },
                        ]}
                    />
                </TabsContent>
              </div>
            </Tabs>
          </PopoverContent>
        </Popover>

        <div className="h-10 w-px bg-border/50" />

        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Palette} label="Wood" isActive={focusPart === "finish"} partId="finish" />
          <PopoverContent className="w-80 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5" side="top" sideOffset={20}>
            <SectionHeader icon={Palette} title="Wood Finish" />
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wood Tone</Label>
                <Select
                  value={store.woodMaterial.color}
                  onValueChange={(color: WoodColor) => setConfig({ woodMaterial: { ...store.woodMaterial, color } })}
                >
                  <SelectTrigger className="h-11 rounded-lg border-2 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Oak</SelectItem>
                    <SelectItem value="walnut_dark">American Walnut</SelectItem>
                    <SelectItem value="oak_light">White Oak</SelectItem>
                    <SelectItem value="espresso">Espresso Stain</SelectItem>
                    <SelectItem value="charcoal">Charcoal Ash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CompactRadioGroup
                label="Sheen"
                columns={3}
                value={store.woodMaterial.finish}
                onChange={(finish) => setConfig({ woodMaterial: { ...store.woodMaterial, finish } })}
                options={[
                  { value: "matte", label: "Matte" },
                  { value: "satin", label: "Satin" },
                  { value: "semi_gloss", label: "Semi-Gloss" },
                ]}
              />
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-10 w-px bg-border/50" />

        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Armchair} label="Chairs" isActive={focusPart === "chairs"} partId="chairs" />
          <PopoverContent className="w-[500px] rounded-2xl p-0 shadow-2xl overflow-hidden ring-1 ring-black/5" side="top" sideOffset={20}>
            <Tabs defaultValue="style" className="w-full">
              <div className="bg-muted/40 p-2">
                  <TabsList className="grid w-full grid-cols-3 rounded-xl bg-background/50 p-1 shadow-sm">
                    <TabsTrigger value="style" className="rounded-lg text-xs font-semibold">Shape</TabsTrigger>
                    <TabsTrigger value="leather" className="rounded-lg text-xs font-semibold">Upholstery</TabsTrigger>
                    <TabsTrigger value="comfort" className="rounded-lg text-xs font-semibold">Comfort</TabsTrigger>
                  </TabsList>
              </div>
              <div className="p-5 pt-3">
                <TabsContent value="style" className="grid grid-cols-2 gap-6">
                    <CompactRadioGroup
                    label="Model"
                    value={store.chair.style}
                    onChange={(style) => setConfig({ chair: { ...store.chair, style } })}
                    options={[
                        { value: "minimal_modern", label: "Minimal" },
                        { value: "arm_chair", label: "Armchair" },
                        { value: "high_back", label: "High-Back" },
                        { value: "low_back", label: "Low-Back" },
                        { value: "bench", label: "Bench" },
                    ]}
                    />
                    <div className="space-y-6">
                    <CompactRadioGroup
                        label="Armrests"
                        value={store.chair.armrestStyle}
                        onChange={(armrestStyle) => setConfig({ chair: { ...store.chair, armrestStyle } })}
                        options={[{ value: "none", label: "None" }, { value: "slim", label: "Slim" }, { value: "full", label: "Full" }]}
                    />
                    <CompactRadioGroup
                        label="Stitch Pattern"
                        value={store.chair.backrestPattern}
                        onChange={(backrestPattern) => setConfig({ chair: { ...store.chair, backrestPattern } })}
                        options={[{ value: "plain", label: "Plain" }, { value: "stitched", label: "Quilted" }, { value: "cut_out", label: "Ventilated" }]}
                    />
                    </div>
                </TabsContent>

                <TabsContent value="leather" className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Leather Tone</Label>
                    <Select value={store.leather.color} onValueChange={(color: LeatherColor) => setConfig({ leather: { ...store.leather, color } })}>
                        <SelectTrigger className="h-11 rounded-lg border-2"><SelectValue /></SelectTrigger>
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
                    <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stitching</Label>
                    <Select value={store.leather.stitchingColor} onValueChange={(stitchingColor: StitchingColor) => setConfig({ leather: { ...store.leather, stitchingColor } })}>
                        <SelectTrigger className="h-11 rounded-lg border-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="match">Matched Thread</SelectItem>
                        <SelectItem value="contrast">Contrast Thread</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="col-span-2">
                    <CompactRadioGroup
                        columns={3}
                        label="Grain Texture"
                        value={store.leather.finish}
                        onChange={(finish) => setConfig({ leather: { ...store.leather, finish } })}
                        options={[{ value: "smooth", label: "Smooth" }, { value: "grained", label: "Pebbled" }, { value: "distressed", label: "Vintage" }]}
                    />
                    </div>
                </TabsContent>

                <TabsContent value="comfort" className="space-y-6">
                    <CompactRadioGroup
                    columns={3}
                    label="Foam Density"
                    value={store.leather.cushionFirmness}
                    onChange={(v) => setConfig({ leather: { ...store.leather, cushionFirmness: v } })}
                    options={[{ value: "soft", label: "Plush" }, { value: "medium", label: "Medium" }, { value: "firm", label: "Firm Support" }]}
                    />
                    <CompactRadioGroup
                    columns={3}
                    label="Padding Thickness"
                    value={store.leather.seatPadding}
                    onChange={(v) => setConfig({ leather: { ...store.leather, seatPadding: v } })}
                    options={[{ value: "slim", label: "Slim" }, { value: "standard", label: "Standard" }, { value: "plush", label: "Extra Plush" }]}
                    />
                </TabsContent>
              </div>
            </Tabs>
          </PopoverContent>
        </Popover>

        <div className="h-10 w-px bg-border/50" />

        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={Expand} label="Detail" isActive={focusPart === "structural"} partId="structural" />
          <PopoverContent className="w-80 rounded-2xl p-5 shadow-2xl ring-1 ring-black/5" side="top" sideOffset={20}>
             <SectionHeader icon={Expand} title="Structure" />
            <div className="space-y-5">
              <CompactRadioGroup
                columns={3}
                label="Leg Thickness"
                value={store.structural.legThickness}
                onChange={(v) => setConfig({ structural: { ...store.structural, legThickness: v } })}
                options={[{ value: "slim", label: "Slim" }, { value: "medium", label: "Standard" }, { value: "thick", label: "Bold" }]}
              />
              <CompactRadioGroup
                columns={3}
                label="Structural Stretchers"
                value={store.structural.stretcherStyle}
                onChange={(v) => setConfig({ structural: { ...store.structural, stretcherStyle: v } })}
                options={[{ value: "straight", label: "H-Frame" }, { value: "cross", label: "X-Frame" }, { value: "hidden", label: "None" }]}
              />
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Protective Caps</Label>
                <Select value={store.structural.footCapMaterial} onValueChange={(v: FootCapMaterial) => setConfig({ structural: { ...store.structural, footCapMaterial: v } })}>
                  <SelectTrigger className="h-11 rounded-lg border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wood">None (Wood)</SelectItem>
                    <SelectItem value="metal">Brushed Brass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-10 w-px bg-border/50" />

        <Popover onOpenChange={(open) => !open && onFocusPartChange(null)}>
          <ConfigTrigger icon={SunMedium} label="Scene" isActive={focusPart === "scene"} partId="scene" />
          <PopoverContent className="w-72 rounded-2xl p-5 shadow-2xl mr-4 ring-1 ring-black/5" side="top" sideOffset={20} align="end">
             <SectionHeader icon={Scan} title="Environment" />
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lighting</Label>
                <Select value={store.scene.lightingMood} onValueChange={(v: LightingMood) => setConfig({ scene: { ...store.scene, lightingMood: v } })}>
                  <SelectTrigger className="h-11 rounded-lg border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soft_daylight">Studio Daylight</SelectItem>
                    <SelectItem value="warm_indoor">Cozy Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Backdrop</Label>
                <Select value={store.scene.background} onValueChange={(v: BackgroundPreset) => setConfig({ scene: { ...store.scene, background: v } })}>
                  <SelectTrigger className="h-11 rounded-lg border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Clean White</SelectItem>
                    <SelectItem value="subtle_interior">Abstract Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CompactRadioGroup
                label="Shadow Softness"
                value={store.scene.shadowIntensity}
                onChange={(v) => setConfig({ scene: { ...store.scene, shadowIntensity: v } })}
                options={[{ value: "low", label: "Soft / Diffused" }, { value: "medium", label: "Hard / Direct" }]}
              />
            </div>
          </PopoverContent>
        </Popover>

      </div>
    </div>
    </>
  );
}