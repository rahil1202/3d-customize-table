import { useEffect } from "react";
import {
  useConfigStore,
  TableSizePreset,
  TableDesignStyle,
  MarbleShape,
  MarbleColor,
  MarbleFinish,
  WoodColor,
  WoodFinish,
  ChairDesignStyle,
  ArmrestStyle,
  BackrestPattern,
  ChairLegStyle,
  LeatherColor,
  LeatherFinish,
  StitchingColor,
  CushionFirmness,
  SeatPaddingThickness,
  StretcherStyle,
  FootCapMaterial,
  LegThicknessLevel,
  LightingMood,
  BackgroundPreset,
  ShadowIntensity,
} from "@/store/configStore";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Armchair, Grid3X3, Hammer, Ruler, Sparkles, SunMedium, Table2 } from "lucide-react";

const DEBUG_CONFIG_PANEL = false;

function logPanel(tag: string, payload: unknown) {
  if (DEBUG_CONFIG_PANEL) {
    // eslint-disable-next-line no-console
    console.log(`[ConfigPanel:${tag}]`, payload);
  }
}


const sectionClass = "space-y-2 sm:space-y-3";

function OptionRadioGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; description?: string }[];
}) {
  return (
    <section className={sectionClass}>
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</h2>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className="grid grid-cols-2 gap-2"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex items-start gap-2 rounded-md border bg-background px-3 py-2 text-left transition-colors data-[state=checked]:border-primary"
            data-state={value === opt.value ? "checked" : "unchecked"}
          >
            <RadioGroupItem id={`${label}-${opt.value}`} value={opt.value} />
            <div>
              <Label htmlFor={`${label}-${opt.value}`} className="text-sm font-medium">
                {opt.label}
              </Label>
              {opt.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
              )}
            </div>
          </button>
        ))}
      </RadioGroup>
    </section>
  );
}

type FocusPart = "table-design" | "size" | "tabletop" | "legs" | "finish" | "chairs" | "scene" | null;

export function ConfigPanel({
  focusPart,
  onFocusPartChange,
}: {
  focusPart: FocusPart;
  onFocusPartChange: (part: FocusPart) => void;
}) {
  const tableDesign = useConfigStore((s) => s.tableDesign);
  const sizePreset = useConfigStore((s) => s.sizePreset);
  const marbleShape = useConfigStore((s) => s.marbleShape);
  const marbleMaterial = useConfigStore((s) => s.marbleMaterial);
  const woodMaterial = useConfigStore((s) => s.woodMaterial);
  const chair = useConfigStore((s) => s.chair);
  const leather = useConfigStore((s) => s.leather);
  const structural = useConfigStore((s) => s.structural);
  const scene = useConfigStore((s) => s.scene);
  const _setConfig = useConfigStore((s) => s.setConfig);

  const setConfig: typeof _setConfig = (partial) => {
    logPanel("setConfig", partial);
    _setConfig(partial);
  };

  useEffect(() => {
    logPanel("selectors", {
      tableDesign,
      sizePreset,
      marbleShape,
      marbleMaterial,
      woodMaterial,
      chair,
      leather,
      structural,
      scene,
    });
  }, [tableDesign, sizePreset, marbleShape, marbleMaterial, woodMaterial, chair, leather, structural, scene]);


  const stepCardClass = (part: FocusPart) =>
    `space-y-4 rounded-lg border bg-card/80 p-4 shadow-sm transition-all duration-200 hover-scale ${
      focusPart === part ? "ring-1 ring-primary/60" : ""
    }`;

  return (
    <aside aria-label="Table configuration" className="w-full max-w-md">
      <Card className="space-y-4 p-4 md:p-5 animate-fade-in">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">3D Dining Set Configurator</h1>
          <p className="text-xs text-muted-foreground">
            Follow the steps, or jump around freely. Every change updates the 3D scene instantly.
          </p>
        </header>

        <div className="space-y-3">
          {/* 1. Table design */}
          <section
            className={stepCardClass("table-design")}
            onMouseEnter={() => onFocusPartChange("table-design")}
            onFocus={() => onFocusPartChange("table-design")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Table2 className="h-3.5 w-3.5" />
                <span>1. Table design</span>
              </span>
            </h2>
            <OptionRadioGroup<TableDesignStyle>
              label="Overall style"
              value={tableDesign.style}
              onChange={(style) => setConfig({ tableDesign: { ...tableDesign, style } })}
              options={[
                { value: "classic_straight_leg", label: "Classic straight-leg" },
                { value: "modern_slab_leg", label: "Modern slab-leg" },
                { value: "sculpted_leg", label: "Sculpted / curved" },
                { value: "minimal_floating", label: "Minimal floating top" },
                { value: "cross_trestle", label: "Cross / trestle" },
              ]}
            />
          </section>

          {/* 2. Size */}
          <section
            className={stepCardClass("size")}
            onMouseEnter={() => onFocusPartChange("size")}
            onFocus={() => onFocusPartChange("size")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Ruler className="h-3.5 w-3.5" />
                <span>2. Seating size</span>
              </span>
            </h2>
            <OptionRadioGroup<TableSizePreset>
              label="Capacity"
              value={sizePreset}
              onChange={(sizePreset) => setConfig({ sizePreset })}
              options={[
                { value: "4_seater", label: "4-seater" },
                { value: "6_seater", label: "6-seater" },
                { value: "8_seater", label: "8-seater" },
              ]}
            />
          </section>

          {/* 3. Tabletop geometry */}
          <section
            className={stepCardClass("tabletop")}
            onMouseEnter={() => onFocusPartChange("tabletop")}
            onFocus={() => onFocusPartChange("tabletop")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Grid3X3 className="h-3.5 w-3.5" />
                <span>3. Tabletop geometry</span>
              </span>
            </h2>
            <div className="space-y-3">
              <OptionRadioGroup<MarbleShape>
                label="Shape"
                value={marbleShape.shape}
                onChange={(shape) => setConfig({ marbleShape: { ...marbleShape, shape } })}
                options={[
                  { value: "rectangle", label: "Rectangle" },
                  { value: "oval", label: "Oval" },
                  { value: "rounded_rectangle", label: "Rounded rectangle" },
                  { value: "boat", label: "Boat" },
                  { value: "soft_organic", label: "Soft organic" },
                ]}
              />
            </div>
          </section>

          {/* 4. Marble material */}
          <section
            className={stepCardClass("tabletop")}
            onMouseEnter={() => onFocusPartChange("tabletop")}
            onFocus={() => onFocusPartChange("tabletop")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Sparkles className="h-3.5 w-3.5" />
                <span>4. Marble colour &amp; finish</span>
              </span>
            </h2>
            <div className="space-y-3">
              <OptionRadioGroup<MarbleColor>
                label="Colour"
                value={marbleMaterial.color}
                onChange={(color) => setConfig({ marbleMaterial: { ...marbleMaterial, color } })}
                options={[
                  { value: "white_carrara", label: "White Carrara" },
                  { value: "beige_cream", label: "Beige / cream" },
                  { value: "grey_veined", label: "Grey veined" },
                  { value: "black_marble", label: "Black marble" },
                  { value: "green_exotic", label: "Green / exotic" },
                ]}
              />

              <OptionRadioGroup<MarbleFinish>
                label="Finish"
                value={marbleMaterial.finish}
                onChange={(finish) => setConfig({ marbleMaterial: { ...marbleMaterial, finish } })}
                options={[
                  { value: "polished", label: "Polished" },
                  { value: "honed", label: "Honed (matte)" },
                  { value: "leathered", label: "Leathered" },
                ]}
              />
            </div>
          </section>

          {/* 5. Wood finish */}
          <section
            className={stepCardClass("finish")}
            onMouseEnter={() => onFocusPartChange("finish")}
            onFocus={() => onFocusPartChange("finish")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Sparkles className="h-3.5 w-3.5" />
                <span>5. Wood polish &amp; tone</span>
              </span>
            </h2>
            <div className="space-y-3">
              <section className={sectionClass}>
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                    <Hammer className="h-3.5 w-3.5" />
                    <span>Wood colour</span>
                  </span>
                </h2>
                <Select
                  value={woodMaterial.color}
                  onValueChange={(color: WoodColor) =>
                    setConfig({ woodMaterial: { ...woodMaterial, color } })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select wood colour" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="walnut_dark">Walnut dark</SelectItem>
                    <SelectItem value="oak_light">Oak light</SelectItem>
                    <SelectItem value="espresso">Espresso</SelectItem>
                    <SelectItem value="charcoal">Charcoal</SelectItem>
                  </SelectContent>
                </Select>
              </section>

              <OptionRadioGroup<WoodFinish>
                label="Sheen"
                value={woodMaterial.finish}
                onChange={(finish) => setConfig({ woodMaterial: { ...woodMaterial, finish } })}
                options={[
                  { value: "matte", label: "Matte" },
                  { value: "satin", label: "Satin" },
                  { value: "semi_gloss", label: "Semi-gloss" },
                ]}
              />
            </div>
          </section>

          {/* 6. Chairs */}
          <section
            className={stepCardClass("chairs")}
            onMouseEnter={() => onFocusPartChange("chairs")}
            onFocus={() => onFocusPartChange("chairs")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Armchair className="h-3.5 w-3.5" />
                <span>6. Chairs &amp; leather</span>
              </span>
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="chair-frame">
                <AccordionTrigger className="text-sm font-semibold tracking-wide text-muted-foreground">
                  Chair frame &amp; support
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <OptionRadioGroup<ChairDesignStyle>
                    label="Chair type"
                    value={chair.style}
                    onChange={(style) => setConfig({ chair: { ...chair, style } })}
                    options={[
                      { value: "minimal_modern", label: "Minimal modern" },
                      { value: "arm_chair", label: "Arm chair" },
                      { value: "high_back", label: "High-back" },
                      { value: "low_back", label: "Low-back" },
                      { value: "bench", label: "Bench seating" },
                    ]}
                  />

                  <OptionRadioGroup<ArmrestStyle>
                    label="Armrests"
                    value={chair.armrestStyle}
                    onChange={(armrestStyle) => setConfig({ chair: { ...chair, armrestStyle } })}
                    options={[
                      { value: "none", label: "None" },
                      { value: "slim", label: "Slim" },
                      { value: "full", label: "Full" },
                    ]}
                  />

                  <OptionRadioGroup<BackrestPattern>
                    label="Backrest pattern"
                    value={chair.backrestPattern}
                    onChange={(backrestPattern) =>
                      setConfig({ chair: { ...chair, backrestPattern } })
                    }
                    options={[
                      { value: "plain", label: "Plain" },
                      { value: "stitched", label: "Stitched" },
                      { value: "cut_out", label: "Cut-out" },
                    ]}
                  />

                  <OptionRadioGroup<ChairLegStyle>
                    label="Chair legs"
                    value={chair.legStyle}
                    onChange={(legStyle) => setConfig({ chair: { ...chair, legStyle } })}
                    options={[
                      { value: "match_table", label: "Match table" },
                      { value: "contrast", label: "Contrast" },
                    ]}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="leather-comfort">
                <AccordionTrigger className="text-sm font-semibold tracking-wide text-muted-foreground">
                  Leather &amp; comfort
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <section className={sectionClass}>
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                        <Armchair className="h-3.5 w-3.5" />
                        <span>Leather colour</span>
                      </span>
                    </h2>
                    <Select
                      value={leather.color}
                      onValueChange={(color: LeatherColor) =>
                        setConfig({ leather: { ...leather, color } })
                      }
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select leather colour" />
                      </SelectTrigger>
                      <SelectContent className="z-50 bg-popover">
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="tan">Tan</SelectItem>
                        <SelectItem value="brown">Brown</SelectItem>
                        <SelectItem value="grey">Grey</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="olive">Olive</SelectItem>
                      </SelectContent>
                    </Select>
                  </section>

                  <OptionRadioGroup<LeatherFinish>
                    label="Leather finish"
                    value={leather.finish}
                    onChange={(finish) => setConfig({ leather: { ...leather, finish } })}
                    options={[
                      { value: "smooth", label: "Smooth" },
                      { value: "grained", label: "Grained" },
                      { value: "distressed", label: "Distressed" },
                    ]}
                  />

                  <OptionRadioGroup<StitchingColor>
                    label="Stitching"
                    value={leather.stitchingColor}
                    onChange={(stitchingColor) =>
                      setConfig({ leather: { ...leather, stitchingColor } })
                    }
                    options={[
                      { value: "match", label: "Match" },
                      { value: "contrast", label: "Contrast" },
                    ]}
                  />

                  <OptionRadioGroup<CushionFirmness>
                    label="Cushion firmness"
                    value={leather.cushionFirmness}
                    onChange={(cushionFirmness) =>
                      setConfig({ leather: { ...leather, cushionFirmness } })
                    }
                    options={[
                      { value: "soft", label: "Soft" },
                      { value: "medium", label: "Medium" },
                      { value: "firm", label: "Firm" },
                    ]}
                  />

                  <OptionRadioGroup<SeatPaddingThickness>
                    label="Seat padding"
                    value={leather.seatPadding}
                    onChange={(seatPadding) =>
                      setConfig({ leather: { ...leather, seatPadding } })
                    }
                    options={[
                      { value: "slim", label: "Slim" },
                      { value: "standard", label: "Standard" },
                      { value: "plush", label: "Plush" },
                    ]}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* 7. Structural details */}
          <section
            className={stepCardClass("legs")}
            onMouseEnter={() => onFocusPartChange("legs")}
            onFocus={() => onFocusPartChange("legs")}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <Hammer className="h-3.5 w-3.5" />
                <span>7. Structural details</span>
              </span>
            </h2>
            <div className="space-y-3">
              <OptionRadioGroup<StretcherStyle>
                label="Stretchers"
                value={structural.stretcherStyle}
                onChange={(stretcherStyle) => setConfig({ structural: { ...structural, stretcherStyle } })}
                options={[
                  { value: "straight", label: "Straight" },
                  { value: "cross", label: "Cross" },
                  { value: "hidden", label: "Hidden" },
                ]}
              />

              <OptionRadioGroup<FootCapMaterial>
                label="Foot caps"
                value={structural.footCapMaterial}
                onChange={(footCapMaterial) => setConfig({ structural: { ...structural, footCapMaterial } })}
                options={[
                  { value: "wood", label: "Wood" },
                  { value: "metal", label: "Metal" },
                ]}
              />

              <OptionRadioGroup<LegThicknessLevel>
                label="Leg thickness"
                value={structural.legThickness}
                onChange={(legThickness) => setConfig({ structural: { ...structural, legThickness } })}
                options={[
                  { value: "slim", label: "Slim" },
                  { value: "medium", label: "Medium" },
                  { value: "thick", label: "Thick" },
                ]}
              />
            </div>
          </section>

          {/* 8. Scene presets */}
          <section className={stepCardClass(null)}>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                <SunMedium className="h-3.5 w-3.5" />
                <span>8. Scene &amp; lighting</span>
              </span>
            </h2>
            <div className="space-y-3">
              {/* Lighting mood: dropdown for quick selection */}
              <div className={sectionClass}>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lighting mood
                </Label>
                <Select
                  value={scene.lightingMood}
                  onValueChange={(lightingMood: LightingMood) =>
                    setConfig({ scene: { ...scene, lightingMood } })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select lighting" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="soft_daylight">Soft daylight</SelectItem>
                    <SelectItem value="warm_indoor">Warm indoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background: dropdown control */}
              <div className={sectionClass}>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Background
                </Label>
                <Select
                  value={scene.background}
                  onValueChange={(background: BackgroundPreset) =>
                    setConfig({ scene: { ...scene, background } })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="subtle_interior">Subtle interior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shadow intensity: keep simple radios for clarity */}
              <OptionRadioGroup<ShadowIntensity>
                label="Shadow intensity"
                value={scene.shadowIntensity}
                onChange={(shadowIntensity) => setConfig({ scene: { ...scene, shadowIntensity } })}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                ]}
              />
            </div>
          </section>
        </div>
      </Card>
    </aside>
  );
}
