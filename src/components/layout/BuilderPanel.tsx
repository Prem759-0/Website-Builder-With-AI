import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Eye, Code, Layout, Smartphone, Tablet, Monitor, RotateCcw, Share2, Download, Maximize2, Zap, ExternalLink, Rocket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Device, ViewMode } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Separator } from '@/components/ui/separator';

const Editor = lazy(() => import('@monaco-editor/react').then(mod => ({ default: mod.Editor })));

interface BuilderPanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
}

export function BuilderPanel({ code, onCodeChange }: BuilderPanelProps) {
  const [device, setDevice] = useState<Device>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [iframeKey, setIframeKey] = useState(0);

  const containerSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] max-h-[85vh]',
    mobile: 'w-[375px] h-[667px] max-h-[85vh]',
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const openInNewTab = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden relative z-0">
      {/* Builder Toolbar */}
      <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0B0F19]/50 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/10 shadow-inner">
            {[
              { id: 'preview', icon: <Eye size={15} />, label: 'Preview' },
              { id: 'code', icon: <Code size={15} />, label: 'Code' },
              { id: 'split', icon: <Layout size={15} />, label: 'Split' },
            ].map((tab) => (
              <Button 
                key={tab.id}
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={cn(
                  "h-8 rounded-xl px-4 gap-2 text-xs font-bold transition-all duration-300", 
                  viewMode === tab.id 
                    ? "bg-white/10 text-white shadow-xl" 
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-4 bg-white/5" />

          {viewMode !== 'code' && (
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/10">
              {[
                { id: 'mobile', icon: <Smartphone size={15} /> },
                { id: 'tablet', icon: <Tablet size={15} /> },
                { id: 'desktop', icon: <Monitor size={15} /> },
              ].map((d) => (
                <Button 
                  key={d.id}
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDevice(d.id as Device)}
                  className={cn(
                    "h-8 w-8 rounded-xl transition-all", 
                    device === d.id ? "bg-white/10 text-blue-400" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {d.icon}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1 mr-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Zap size={10} className="text-blue-500" />
            Auto-Saving
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-9 w-9 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            <RotateCcw size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openInNewTab}
            className="h-9 w-9 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-all"
          >
            <ExternalLink size={16} />
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/[0.03] hover:bg-white/5 rounded-xl gap-2 font-bold text-xs" onClick={() => toast.info("Share functionality coming soon!")}>
            <Share2 size={14} />
            Share
          </Button>
          <Button size="sm" className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl gap-2 font-bold text-xs shadow-lg shadow-blue-500/10 transition-all active:scale-95">
             <Rocket size={14} />
             Deploy
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={viewMode}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "h-full grid",
              viewMode === 'split' ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            {/* Monaco Editor Container */}
            {(viewMode === 'code' || viewMode === 'split') && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full border-r border-white/5 bg-[#1e1e1e]/60 backdrop-blur-xl relative group z-10"
              >
                <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   HTML / Tailwind
                </div>
                <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-gray-500 text-sm font-mono animate-pulse">Initializing Reactor Core...</div>}>
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => onCodeChange(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      padding: { top: 20 },
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      cursorStyle: 'block',
                      cursorBlinking: 'smooth',
                      smoothScrolling: true,
                      contextmenu: false,
                      wordWrap: 'on',
                    }}
                  />
                </Suspense>
              </motion.div>
            )}

            {/* Iframe Preview Container */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={cn(
                "h-full flex items-center justify-center transition-all duration-700 bg-[#0B0F19] relative overflow-hidden z-0",
                device === 'desktop' ? "p-0" : "p-12"
              )}>
                {/* Decorative Backdrop */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
                   <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
                </div>

                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "bg-white rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10",
                    containerSizes[device],
                    device !== 'desktop' && "ring-12 ring-[#111827] ring-inset"
                  )}
                >
                  {/* Device Frame Extras (Camera/Speaker hole on mobile) */}
                  {device === 'mobile' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#111827] rounded-b-2xl z-20 flex items-center justify-center gap-1.5 p-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/[0.05]" />
                      <div className="w-8 h-1 rounded-full bg-white/[0.05]" />
                    </div>
                  )}

                  <iframe
                    key={iframeKey}
                    srcDoc={code}
                    className="w-full h-full border-none rounded-[inherit]"
                    title="Lumina Preview"
                    referrerPolicy="no-referrer"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                  />
                </motion.div>

                {/* Status Overlay */}
                <div className="absolute bottom-6 right-6 flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest z-10">
                   <div className="flex items-center gap-1.5">
                      <Smartphone size={10} />
                      <span>{device} mode</span>
                   </div>
                   <div className="w-1 h-1 rounded-full bg-gray-800" />
                   <div className="flex items-center gap-1.5">
                      <Maximize2 size={10} />
                      <span>Responsive</span>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
import { toast } from 'sonner';

