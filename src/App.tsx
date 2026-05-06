import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSearch, Trash2, Download, ChevronLeft, RefreshCcw, Palette, Menu, HelpCircle, X as CloseIcon } from 'lucide-react';
import { saveAs } from 'file-saver';
import HelpOverlay from './components/HelpOverlay';
import FileUploader from './components/FileUploader';
import MetadataEditor from './components/MetadataEditor';
import MediaPreview from './components/MediaPreview';
import ThemeSelector from './components/ThemeSelector';
import { cn } from './lib/utils';
import { themes } from './themes';
interface AppState {
  file: File | null;
  metadata: any | null;
  previewUrl: string | null;
  isProcessing: boolean;
  isUpdating: boolean;
  error: string | null;
  success: string | null;
  themeId: string;
  isThemeOpen: boolean;
  isMobileMenuOpen: boolean;
  isHelpOpen: boolean;
}
export default function App() {
  const [state, setState] = useState<AppState>({
    file: null,
    metadata: null,
    previewUrl: null,
    isProcessing: false,
    isUpdating: false,
    error: null,
    success: null,
    themeId: 'ida-dark',
    isThemeOpen: false,
    isMobileMenuOpen: false,
    isHelpOpen: false,
  });
  const [logoError, setLogoError] = useState(false);
  useEffect(() => {
    const currentTheme = themes.find(t => t.id === state.themeId) || themes[0];
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-bg', currentTheme.bg);
    root.style.setProperty('--theme-surface', currentTheme.surface);
    root.style.setProperty('--theme-border', currentTheme.border);
    root.style.setProperty('--theme-text', currentTheme.text);
    root.style.setProperty('--theme-text-muted', currentTheme.textMuted);
  }, [state.themeId]);
  const handleFileSelect = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setState(prev => ({ 
      ...prev, file, previewUrl, isProcessing: true, metadata: null, error: null, success: null, isMobileMenuOpen: false
    }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/metadata', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || 'Failed to extract metadata');
        } catch (e) {
          throw new Error(`Server returned error: ${response.status} ${response.statusText}`);
        }
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Check API configuration.');
      }
      const data = await response.json();
      setState(prev => ({ ...prev, metadata: data.metadata, isProcessing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || 'Error processing file', isProcessing: false }));
    }
  };
  const handleUpdate = async (updates: any) => {
    if (!state.file) return;
    setState(prev => ({ ...prev, isUpdating: true, error: null, success: null }));
    try {
      const formData = new FormData();
      formData.append('file', state.file);
      formData.append('updates', JSON.stringify(updates));
      const response = await fetch('/api/update-metadata', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to update metadata');
      const blob = await response.blob();
      const updatedFile = new File([blob], `modified_${state.file.name}`, { type: state.file.type });
      if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
      const newPreviewUrl = URL.createObjectURL(updatedFile);
      setState(prev => ({ 
        ...prev, file: updatedFile, previewUrl: newPreviewUrl, isUpdating: false, success: 'Metadata updated successfully'
      }));
      handleFileSelect(updatedFile);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || 'Error updating metadata', isUpdating: false }));
    }
  };
  const reset = () => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    setState(prev => ({
      ...prev, file: null, metadata: null, previewUrl: null, isProcessing: false, isUpdating: false, error: null, success: null,
    }));
  };
  const download = () => {
    if (state.file) saveAs(state.file, state.file.name);
  };
  const currentTheme = themes.find(t => t.id === state.themeId) || themes[0];
  return (
    <div className="h-screen flex flex-col bg-theme-bg text-theme-text selection:bg-theme-primary selection:text-black">
      <AnimatePresence>
        {state.isThemeOpen && (
          <ThemeSelector 
            currentThemeId={state.themeId} 
            onThemeChange={(id) => setState(prev => ({ ...prev, themeId: id }))}
            onClose={() => setState(prev => ({ ...prev, isThemeOpen: false }))}
          />
        )}
        {state.isHelpOpen && <HelpOverlay onClose={() => setState(prev => ({ ...prev, isHelpOpen: false }))} />}
      </AnimatePresence>
      <header className="h-10 border-b border-theme-border bg-theme-surface flex items-center justify-between px-2 shrink-0 relative z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setState(prev => ({ ...prev, isMobileMenuOpen: !prev.isMobileMenuOpen }))} className="lg:hidden p-1.5 hover:bg-theme-text/5">
            {state.isMobileMenuOpen ? <CloseIcon className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-theme-text flex items-center justify-center overflow-hidden">
               {!logoError ? (
                 <img src="/img/EDXIF.jpg" alt="Logo" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
               ) : (
                 <FileSearch className="text-theme-bg w-3 h-3" />
               )}
            </div>
            <h1 className="text-[11px] font-black tracking-tight text-theme-text uppercase font-mono">EDXIF PRO : v1.0.42</h1>
          </div>
        </div>
        <div className="flex items-center h-full">
          <button onClick={() => setState(prev => ({ ...prev, isHelpOpen: true }))} className="h-full px-4 border-l border-theme-border hover:bg-theme-text/5 transition-all flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px] font-bold uppercase">HELP</span>
          </button>
          <button onClick={() => setState(prev => ({ ...prev, isThemeOpen: !prev.isThemeOpen }))} className={cn("h-full px-4 border-l border-theme-border hover:bg-theme-text/5 transition-all flex items-center gap-2", state.isThemeOpen && "bg-theme-primary/10")}>
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px] font-bold uppercase">{currentTheme.name}</span>
          </button>
          {state.file && (
            <button onClick={download} className="h-full px-6 bg-theme-primary text-black text-[10px] font-black uppercase border-l border-theme-border hover:opacity-90 transition-all flex items-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT</span>
            </button>
          )}
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden relative">
        <aside className={cn("fixed inset-0 top-10 z-40 bg-theme-bg lg:relative lg:top-0 lg:flex w-full lg:w-64 border-r border-theme-border flex-col shrink-0 transition-transform duration-100", state.isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
          <div className="flex flex-col h-full overflow-hidden">
            {!state.file ? (
              <div className="p-4 h-full flex flex-col justify-center">
                <FileUploader onFileSelect={handleFileSelect} isProcessing={state.isProcessing} />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="pane-header flex justify-between items-center pr-2">
                  <span>NAVIGATOR</span>
                  <button onClick={reset} className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <button onClick={reset} className="w-full flex items-center justify-between px-3 py-1.5 border border-theme-border bg-theme-bg text-[10px] font-bold text-theme-text-muted hover:text-theme-text transition-colors group">
                    <div className="flex items-center gap-2 text-theme-primary">
                      <ChevronLeft className="w-3 h-3" />
                      <span>IMPORT_NEW</span>
                    </div>
                    <span className="opacity-30 group-hover:opacity-100">ESC</span>
                  </button>
                  <div className="border border-theme-border bg-black/40 flex items-center justify-center p-1 relative">
                     <MediaPreview file={state.file} previewUrl={state.previewUrl} />
                     <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-theme-primary/50" />
                     <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-theme-primary/50" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="pane-header !h-5 !px-2 !bg-transparent border-b-theme-primary/30">DESCRIPTOR</h3>
                    <div className="space-y-px font-mono text-[10px]">
                      <div className="flex justify-between py-1 border-b border-theme-border/20">
                        <span className="text-theme-text-muted">NAME:</span>
                        <span className="font-bold truncate max-w-[110px]">{state.file.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-theme-border/20">
                        <span className="text-theme-text-muted">SIZE:</span>
                        <span className="font-bold">{(state.file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {state.error && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-2 bg-red-900/10 text-red-500 border border-red-500/30 text-[10px] font-bold">
                        ERR: {state.error}
                      </motion.div>
                    )}
                    {state.success && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-2 bg-theme-primary/10 text-theme-primary border border-theme-primary/30 text-[10px] font-bold">
                        OK: {state.success}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {state.isProcessing && (
                    <div className="flex items-center gap-2 text-[10px] text-theme-primary font-bold animate-pulse">
                      <RefreshCcw className="w-3 h-3 animate-spin" />
                      <span>PARSING_SEGMENTS...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
        <section className="flex-1 bg-theme-bg overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-hidden">
            {state.metadata ? (
              <MetadataEditor metadata={state.metadata} onUpdate={handleUpdate} isUpdating={state.isUpdating} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-10">
                <FileSearch className="w-16 h-16 mb-4" />
                <p className="text-[10px] uppercase font-black tracking-widest">Awaiting Input Stream</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="h-6 bg-theme-surface border-t border-theme-border px-4 flex items-center justify-between shrink-0 relative z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 grayscale opacity-50">
             <div className="w-1.5 h-1.5 bg-theme-primary"></div>
             <span className="text-[9px] font-bold uppercase tracking-tight">READY</span>
          </div>
          <span className="text-theme-border opacity-30">|</span>
          <span className="text-[9px] font-mono text-theme-text-muted">SESSION: 0x{Date.now().toString(16).toUpperCase()}</span>
        </div>
      </footer>
    </div>
  );
}
