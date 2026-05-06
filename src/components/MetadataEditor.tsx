import React, { useState, useEffect } from 'react';
import { File, Image as ImageIcon, MapPin, Calendar, Save, RefreshCcw, Hash } from 'lucide-react';
import { cn } from '../lib/utils';
interface MetadataEditorProps {
  metadata: any;
  onUpdate: (updates: any) => void;
  isUpdating: boolean;
}
const sections = [
  { id: 'all', name: 'All Tags', icon: Hash },
  { id: 'image', name: 'Camera', icon: ImageIcon },
  { id: 'gps', name: 'Location', icon: MapPin },
  { id: 'date', name: 'Timeline', icon: Calendar },
  { id: 'file', name: 'System', icon: File },
];
export default function MetadataEditor({ metadata, onUpdate, isUpdating }: MetadataEditorProps) {
  const [activeTab, setActiveTab] = useState('image');
  const [editedMetadata, setEditedMetadata] = useState<any>({});
  useEffect(() => { setEditedMetadata({}); }, [metadata]);
  const handleFieldChange = (key: string, value: string) => {
    setEditedMetadata(prev => ({ ...prev, [key]: value }));
  };
  const getFields = () => {
    const allKeys = Object.keys(metadata).sort();
    if (activeTab === 'all') return allKeys;
    return allKeys.filter(key => {
      const k = key.toLowerCase();
      if (activeTab === 'image') return k.includes('make') || k.includes('model') || k.includes('fnumber') || k.includes('iso') || k.includes('exposure') || k.includes('aperture') || k.includes('shutter') || k.includes('lens') || k.includes('focal');
      if (activeTab === 'gps') return k.includes('gps') || k.includes('latitude') || k.includes('longitude') || k.includes('altitude') || k.includes('coord') || k.includes('position') || k.includes('loc');
      if (activeTab === 'date') return k.includes('date') || k.includes('time') || k.includes('create') || k.includes('modify') || k.includes('original') || k.includes('birth');
      if (activeTab === 'file') return k.includes('file') || k.includes('size') || k.includes('format') || k.includes('name') || k.includes('path') || k.includes('mimetype');
      return true;
    });
  };
  const fields = getFields();
  const canUpdate = Object.keys(editedMetadata).length > 0;
  return (
    <div className="flex flex-col h-full bg-theme-bg overflow-hidden border-b border-theme-border">
      <div className="flex bg-theme-surface border-b border-theme-border overflow-x-auto no-scrollbar">
        <div className="flex border-r border-theme-border">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.id;
            return (
              <button key={s.id} onClick={() => setActiveTab(s.id)} className={cn("ida-tab", isActive && "ida-tab-active")}>
                <Icon className="w-3 h-3" />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>
        <div className="flex-1 flex justify-end items-center px-2 gap-4 bg-theme-surface">
           {canUpdate && (
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-theme-primary animate-pulse" />
                <span className="text-[9px] font-black text-theme-primary font-mono tracking-tighter hidden sm:inline">MODIFIED</span>
             </div>
           )}
           <button onClick={() => onUpdate(editedMetadata)} disabled={!canUpdate || isUpdating} className={cn("btn-boxy h-6 flex items-center gap-2 text-[9px] font-black px-3 py-0 uppercase", canUpdate && !isUpdating ? "bg-theme-primary text-black border-theme-primary" : "opacity-30 grayscale cursor-not-allowed")}>
            {isUpdating ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            <span>{isUpdating ? "COMMIT..." : "COMMIT"}</span>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse font-mono">
          <thead>
            <tr className="bg-theme-text/5 text-left border-b border-theme-border">
              <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border-r border-theme-border w-1/3">TAG_IDENTIFIER</th>
              <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest">VALUE_FIELD</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((key) => {
              const value = metadata[key];
              const isEdited = editedMetadata[key] !== undefined;
              const displayValue = isEdited ? editedMetadata[key] : value;
              const isEditable = typeof value !== 'object';
              return (
                <tr key={key} className="border-b border-theme-border group hover:bg-theme-text/[0.02] transition-colors">
                  <td className="px-4 py-1 border-r border-theme-border alignment-baseline">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-theme-text-muted group-hover:text-theme-text tracking-tighter">{key}</span>
                      {isEdited && <span className="bg-theme-primary text-black px-1 text-[8px] font-black leading-tight">DIRTY</span>}
                    </div>
                  </td>
                  <td className="px-4 py-1">
                    {isEditable ? (
                      <input value={displayValue ?? ''} onChange={(e) => handleFieldChange(key, e.target.value)} className={cn("w-full bg-transparent text-[11px] focus:outline-none focus:text-theme-primary py-0.5", isEdited ? "text-theme-primary font-bold" : "text-theme-text group-hover:text-theme-primary")} spellCheck={false} autoComplete="off" />
                    ) : (
                      <div className="text-[10px] text-theme-text-muted italic truncate py-0.5 opacity-50">{JSON.stringify(value)}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {fields.length === 0 && (
          <div className="py-20 text-center text-theme-text-muted opacity-30">
            <p className="text-[10px] font-black uppercase underline decoration-dashed tracking-widest">0x00: EMPTY_SET</p>
          </div>
        )}
      </div>
    </div>
  );
}
