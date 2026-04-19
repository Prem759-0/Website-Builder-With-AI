import React, { useState } from 'react';
import { Eye, Code, Layout, Smartphone, Tablet, Monitor, RotateCcw, Share2, Download, Maximize2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Editor } from '@monaco-editor/react';
import { Device, ViewMode } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface BuilderPanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
}

export function BuilderPanel({ code, onCodeChange }: BuilderPanelProps) {
  const [device, setDevice] = useState<Device>('desktop');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');

  const containerSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F19] overflow-hidden">
      <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-[#111827]/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          <Button 
            variant={viewMode === 'preview' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('preview')}
            className={cn("h-8 rounded-lg gap-2", viewMode === 'preview' && "bg-white/10 shadow-sm")}
          >
            <Eye size={16} />
            Preview
          </Button>
          <Button 
            variant={viewMode === 'code' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('code')}
            className={cn("h-8 rounded-lg gap-2", viewMode === 'code' && "bg-white/10 shadow-sm")}
          >
            <Code size={16} />
            Code
          </Button>
          <Button 
            variant={viewMode === 'split' ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setViewMode('split')}
            className={cn("h-8 rounded-lg gap-2", viewMode === 'split' && "bg-white/10 shadow-sm")}
          >
            <Layout size={16} />
            Split
          </Button>
        </div>

        {viewMode === 'preview' && (
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDevice('mobile')}
              className={cn("h-8 w-8 rounded-lg", device === 'mobile' && "bg-white/10 text-blue-400")}
            >
              <Smartphone size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDevice('tablet')}
              className={cn("h-8 w-8 rounded-lg", device === 'tablet' && "bg-white/10 text-blue-400")}
            >
              <Tablet size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDevice('desktop')}
              className={cn("h-8 w-8 rounded-lg", device === 'desktop' && "bg-white/10 text-blue-400")}
            >
              <Monitor size={16} />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
            <RotateCcw size={16} />
          </Button>
          <Separator orientation="vertical" className="h-4 bg-white/10" />
          <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 hover:bg-white/10 gap-2">
            <Download size={14} />
            Export
          </Button>
          <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-white gap-2">
            <Share2 size={14} />
            Deploy
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className={cn(
          "h-full transition-all duration-500 grid",
          viewMode === 'split' ? "grid-cols-2" : "grid-cols-1"
        )}>
          {(viewMode === 'code' || viewMode === 'split') && (
            <div className="h-full border-r border-white/10 bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage="html"
                theme="vs-dark"
                value={code}
                onChange={(val) => onCodeChange(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  padding: { top: 20 },
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={cn(
              "h-full flex items-center justify-center p-8 transition-all duration-500 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed",
              device === 'desktop' ? "p-0" : "p-8"
            )}>
              <div className={cn(
                "h-full bg-white rounded-xl shadow-2xl transition-all duration-500 overflow-hidden relative group",
                containerSizes[device]
              )}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <iframe
                  srcDoc={code}
                  className="w-full h-full border-none"
                  title="Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Separator({ className, orientation }: { className?: string, orientation?: "horizontal" | "vertical" }) {
  return <div className={cn(
    "bg-white/10",
    orientation === "horizontal" ? "h-[1px] w-full" : "w-[1px] h-full",
    className
  )} />
}
