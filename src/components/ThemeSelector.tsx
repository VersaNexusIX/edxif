import React from 'react';
import { themes } from '../themes';
import { cn } from '../lib/utils';
import { X, Check } from 'lucide-react';
import { motion } from 'motion/react';
interface ThemeSelectorProps { currentThemeId: string; onThemeChange: (themeId: string) => void; onClose: () => void; }
export default function ThemeSelector({ currentThemeId, onThemeChange, onClose }: ThemeSelectorProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute top-10 right-0 z-[60] w-64 h-[calc(100vh-2.5rem)] bg-theme-surface border-l border-theme-border shadow-2xl overflow-hidden flex flex-col">
      <div className="pane-header flex items-center justify-between"><span>Palette</span><button onClick={onClose} className="p-1 hover:bg-theme-text/10 transition-colors"><X className="w-3 h-3" /></button></div>
      <div className="flex-1 overflow-y-auto p-2 bg-theme-bg">
        <div className="grid grid-cols-1 gap-px bg-theme-border border border-theme-border">
          {themes.map((theme) => {
            const isActive = theme.id === currentThemeId;
            return (
              <button key={theme.id} onClick={() => onThemeChange(theme.id)} className={cn("flex items-center justify-between px-3 py-2 transition-all mono", isActive ? "bg-theme-primary text-black font-bold" : "bg-theme-surface hover:bg-theme-text/5 text-theme-text-muted hover:text-theme-text")}>
                <div className="flex items-center gap-3"><div className="w-3 h-3 border border-black/10" style={{ backgroundColor: theme.primary }} /><span className="uppercase tracking-tighter">{theme.name}</span></div>
                {isActive && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
