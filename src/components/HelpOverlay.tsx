import React from 'react';
import { X, HelpCircle, Upload, Edit3, Download, Zap } from 'lucide-react';
import { motion } from 'motion/react';
export default function HelpOverlay({ onClose }: { onClose: () => void }) {
  const guides = [
    { icon: Upload, title: 'LOAD_FILE', desc: 'Drag or select image video or audio into the navigator pane' },
    { icon: Edit3, title: 'MODIFY_TAGS', desc: 'Select a segment and click value fields to edit technical markers' },
    { icon: Zap, title: 'COMMIT_DATA', desc: 'Use the commit button to bake metadata updates into the source' },
    { icon: Download, title: 'EXPORT_ASSET', desc: 'Save the processed file with new metadata to your local drive' }
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-theme-bg border border-theme-border shadow-2xl overflow-hidden font-mono">
        <div className="pane-header flex items-center justify-between">
          <div className="flex items-center gap-2"><HelpCircle className="w-3 h-3 text-theme-primary" /><span>SYSTEM_GUIDE</span></div>
          <button onClick={onClose} className="hover:text-red-500"><X className="w-3 h-3" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {guides.map((g, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 shrink-0 bg-theme-primary/10 flex items-center justify-center border border-theme-primary/20 text-theme-primary"><g.icon className="w-4 h-4" /></div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black text-theme-primary">{g.title}</h4>
                  <p className="text-[10px] text-theme-text-muted leading-relaxed uppercase">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-theme-border/30">
            <p className="text-[9px] text-theme-text-muted italic opacity-50">EDXIF PRO UTILIZES SERVER SIDE EXIFTOOL PROCESSING FOR MAXIMUM INTEGRITY</p>
          </div>
          <button onClick={onClose} className="w-full h-10 bg-theme-primary text-black text-[11px] font-black uppercase hover:opacity-90 transition-opacity">CLOSE_GUIDE</button>
        </div>
      </div>
    </motion.div>
  );
}
