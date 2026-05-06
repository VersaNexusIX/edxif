import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}
export default function FileUploader({ onFileSelect, isProcessing }: FileUploaderProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, disabled: isProcessing } as any);
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraOpen(true);
    } catch (err) { alert("Failed to access camera"); }
  };
  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); }
    setIsCameraOpen(false);
  };
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            onFileSelect(new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' }));
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };
  return (
    <div className="relative w-full space-y-2">
      <div {...getRootProps()} className={cn("relative w-full h-[200px] border border-theme-border bg-theme-text/5 flex flex-col items-center justify-center cursor-pointer transition-all group", isDragActive && "bg-theme-primary/10 border-theme-primary/50", isProcessing && "opacity-50 cursor-not-allowed")}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4 px-6 text-center">
          <div className={cn("w-12 h-12 flex items-center justify-center border border-theme-border bg-theme-bg group-hover:border-theme-primary transition-colors", isDragActive && "border-theme-primary")}><Upload className={cn("w-5 h-5 text-theme-text/40 group-hover:text-theme-primary transition-colors", isDragActive && "text-theme-primary")} /></div>
          <div><h3 className="mono font-bold uppercase tracking-[0.2em]">IMPORT</h3><p className="mono opacity-40 mt-1">BUFF_STREAM</p></div>
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); startCamera(); }} className="w-full flex items-center justify-center gap-3 h-9 border border-theme-border bg-theme-surface text-theme-text mono font-bold uppercase tracking-widest hover:bg-theme-text/5 active:bg-theme-primary/10 transition-all"><Camera className="w-4 h-4 text-theme-primary" /><span>CAPTURE</span></button>
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[3/4] bg-neutral-900 border border-white/20">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <button onClick={stopCamera} className="absolute top-4 right-4 p-2 bg-black border border-white/20 text-white"><X className="w-5 h-5" /></button>
              <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4">
                <button onClick={capturePhoto} className="w-14 h-14 border-4 border-white/50 flex items-center justify-center p-1"><div className="w-full h-full bg-white active:scale-90 transition-transform" /></button>
                <p className="mono text-[10px] text-white/40 uppercase tracking-widest">CAPTURE</p>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
