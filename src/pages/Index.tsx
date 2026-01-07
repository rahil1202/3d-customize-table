import { useEffect, useState } from "react";
import { ConfiguratorScene } from "@/components/ConfiguratorScene";
import { ConfigPanel, FocusPart } from "@/components/ConfigPanel";
import { Button } from "@/components/ui/button";
import { SunMedium, RotateCcw } from "lucide-react";

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
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* HEADER: 
        Minimal height, sits at the top. 
        Removed the Tabs since they are now in the bottom ConfigPanel.
      */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">3D Dining Configurator</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Real-time customization engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => setCameraResetKey((k) => k + 1)}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset View</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleTheme}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            <SunMedium className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT (3D SCENE):
        Uses flex-1 to occupy all remaining vertical space.
        pb-14 adds padding at the bottom so the Fixed Footer doesn't overlap the 3D model's feet.
      */}
      <ConfigPanel focusPart={focusPart} onFocusPartChange={setFocusPart} />
      
      <section className="relative flex-1 w-full bg-accent/10 pb-14">
        <ConfiguratorScene focusPart={focusPart}  />
      </section>

      {/* FOOTER CONTROLS:
        The component itself contains 'fixed bottom-0', 
        so it will overlay perfectly at the bottom.
      */}
    </main>
  );
};

export default Index;