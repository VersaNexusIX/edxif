import React from 'react';
import { File, Music, Archive } from 'lucide-react';
interface MediaPreviewProps { file: File; previewUrl: string | null; }
export default function MediaPreview({ file, previewUrl }: MediaPreviewProps) {
  const isImage = file.type.startsWith('image/'), isVideo = file.type.startsWith('video/'), isAudio = file.type.startsWith('audio/'), isZip = file.type.includes('zip') || file.name.endsWith('.zip');
  return (
    <div className="w-full bg-theme-bg aspect-video flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-theme-primary/5" />
      {isImage && previewUrl ? (
        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain relative z-10" />
      ) : isVideo && previewUrl ? (
        <video src={previewUrl} controls className="w-full h-full object-contain relative z-10" />
      ) : isAudio && previewUrl ? (
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="w-16 h-16 bg-theme-primary/10 flex items-center justify-center border border-theme-primary/20"><Music className="w-8 h-8 text-theme-primary" /></div>
          <audio src={previewUrl} controls className="w-full max-w-[280px] h-8 opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 text-theme-text-muted/20 relative z-10">
          {isZip ? <Archive className="w-16 h-16" /> : <File className="w-16 h-16" />}
          <p className="mono text-[9px] uppercase tracking-[0.2em] font-bold text-theme-text-muted">{file.name}</p>
        </div>
      )}
      <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md px-2 py-0.5 flex items-center gap-2 border-l border-b border-white/10 z-20">
        <div className="w-1.5 h-1.5 bg-theme-primary animate-pulse" />
        <span className="mono text-[9px] font-bold uppercase text-white tracking-widest">{file.type?.split('/')[1] || '0xBIN'}</span>
      </div>
    </div>
  );
}
