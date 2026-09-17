"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Palette, ChevronDown } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl glass animate-pulse"></div>;
  }

  const themes = [
    { name: "Light", value: "light", color: "#f8fafc" },
    { name: "Dark", value: "dark", color: "#020617" },
    { name: "Cyberpunk", value: "cyberpunk", color: "#ec4899" },
    { name: "Midnight", value: "midnight", color: "#0a192f" },
    { name: "Forest", value: "forest", color: "#064e3b" },
    { name: "Sunset", value: "sunset", color: "#f97316" },
    { name: "Matrix", value: "matrix", color: "#22c55e" },
    { name: "Ocean", value: "ocean", color: "#06b6d4" },
    { name: "Royal", value: "royal", color: "#a855f7" },
    { name: "Monochrome", value: "monochrome", color: "#171717" },
    { name: "Rose Gold", value: "rosegold", color: "#fb7185" },
    { name: "Solarized", value: "solarized", color: "#002b36" },
  ];

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass hover:bg-[var(--glass-border)] transition-colors px-4 py-2.5 rounded-xl flex items-center gap-2 text-dynamic font-semibold text-sm"
      >
        <Palette size={18} className="text-dynamic-sec" />
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown size={14} className={`text-dynamic-sec transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl overflow-hidden border-dynamic animate-fade-in-up">
          <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-bold transition-all ${
                  theme === t.value 
                    ? 'bg-glow text-dynamic' 
                    : 'text-dynamic-sec hover:bg-[var(--glass-bg)] hover:text-dynamic'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-dynamic shadow-sm" 
                  style={{ backgroundColor: t.color }}
                ></span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
