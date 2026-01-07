import { useEffect, useState } from "react";
import { ConfiguratorScene, FocusPart } from "@/components/ConfiguratorScene";
import { ConfigPanel } from "@/components/ConfigPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LucideIcon } from "lucide-react";
import { Armchair, Grid3X3, Hammer, LayoutPanelTop, Ruler, Sparkles, SunMedium, Table2 } from "lucide-react";
const steps: { id: FocusPart; label: string; icon: LucideIcon }[] = [
  { id: "table-design", label: "Table", icon: Table2 },
  { id: "size", label: "Size", icon: Ruler },
  { id: "tabletop", label: "Tabletop", icon: Grid3X3 },
  { id: "legs", label: "Legs", icon: Hammer },
  { id: "finish", label: "Finish", icon: Sparkles },
  { id: "chairs", label: "Chairs", icon: Armchair },
  { id: "scene", label: "Scene", icon: LayoutPanelTop },
];

const Index = () => {
  const [focusPart, setFocusPart] = useState<FocusPart | null>(null);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const initialDark = root.classList.contains("dark");
    setIsDark(initialDark);
  }, []);

  const handleToggleTheme = () => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    root.classList.toggle("dark", nextIsDark);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="space-y-0.5">
            <h1 className="text-base font-semibold tracking-tight md:text-lg">3D Dining Set Configurator</h1>
            <p className="text-xs text-muted-foreground">
              Follow the steps, or jump around freely. Every change updates the 3D scene instantly.
            </p>
          </div>

          <div className="flex flex-1 flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end">
            <div className="overflow-x-auto md:order-1">
              <Tabs
                value={focusPart ?? "scene"}
                onValueChange={(value) => setFocusPart(value as FocusPart)}
                className="min-w-max"
              >
                <TabsList>
                  {steps.map((step) => (
                    <TabsTrigger key={step.id} value={step.id} className="px-2 py-1 text-xs md:px-3 md:text-sm">
                      <span className="inline-flex items-center gap-1.5 hover-scale story-link">
                        <step.icon className="h-3.5 w-3.5" />
                        <span>{step.label}</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center justify-end gap-2 md:order-2">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setCameraResetKey((k) => k + 1)}
              >
                Reset view
              </Button>
              <Button
                size="icon"
                variant="outline"
                type="button"
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                onClick={handleToggleTheme}
              >
                {isDark ? <SunMedium className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-1 flex-col gap-4 overflow-hidden px-4 py-4 md:px-6 md:py-6">
        {/* Controls / configuration at the top, scrollable if needed */}
        <div className="w-full max-h-[45vh] overflow-y-auto pb-2">
          <ConfigPanel focusPart={focusPart} onFocusPartChange={setFocusPart} />
        </div>

        {/* 3D scene below, constrained in height with no page scroll */}
        <div className="w-full flex-1">
          <div className="h-full max-h-[55vh] overflow-hidden rounded-lg border bg-card/80">
            <ConfiguratorScene focusPart={focusPart} resetKey={cameraResetKey} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
