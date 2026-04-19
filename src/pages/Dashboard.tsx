import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { BuilderPanel } from '@/components/layout/BuilderPanel';
import { LandingPageBuilder } from '@/components/layout/LandingPageBuilder';
import { Project, Message } from '@/types';
import { projectApi } from '@/lib/api';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { MessageSquare, ListTree, Menu, Share2, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState<'chat' | 'structure'>('chat');
  const [code, setCode] = useState('<!-- Describe your website in the chat to start generating! -->\n<div style="height: 100vh; display: flex; align-items: center; justify-center; background: #0B0F19; color: white; font-family: sans-serif; text-align: center;">\n  <div>\n    <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem;">Ready to Build</h1>\n    <p style="color: #94a3b8;">Start a conversation with Lumina AI to generate your site.</p>\n  </div>\n</div>');
  
  const { messages, sendMessage, isLoading } = useChat();

  const handleSendMessage = useCallback(async (msg: string) => {
    const aiContent = await sendMessage(msg, code);
    
    if (aiContent) {
      const codeMatch = aiContent.match(/```html\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        const newCode = codeMatch[1];
        setCode(newCode);
        if (currentProject) {
           updateProject(currentProject._id, { code: newCode, name: currentProject.name });
        }
      }
    }
  }, [sendMessage, code, currentProject]);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      const res = await projectApi.list(user.id);
      setProjects(res.data);
      if (res.data.length > 0 && !currentProject) {
        setCurrentProject(res.data[0]);
        setCode(res.data[0].code);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user, currentProject]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNewProject = useCallback(async () => {
    if (!user) return;
    const name = `Project ${projects.length + 1}`;
    const initialCode = '<!-- New Project -->\n<div style="padding: 100px; text-align: center; background: #0B0F19; color: white; min-height: 100vh;">\n  <h1>' + name + '</h1>\n</div>';
    try {
      const res = await projectApi.create({ name, userId: user.id, code: initialCode });
      setProjects(prev => [res.data, ...prev]);
      setCurrentProject(res.data);
      setCode(initialCode);
      toast.success('New project created');
    } catch (e) {
      toast.error('Failed to create project');
    }
  }, [user, projects.length]);

  const updateProject = useCallback(async (id: string, data: { code: string, name: string }) => {
    try {
      await projectApi.update(id, data);
    } catch (e) {
      console.error('Update failed', e);
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] overflow-hidden text-slate-100 selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          projects={projects}
          currentProject={currentProject}
          onSelectProject={(p) => {
            setCurrentProject(p);
            setCode(p.code);
          }}
          onNewProject={handleNewProject}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/5 h-10 w-10">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] bg-[#0B0F19] border-white/5">
            <Sidebar 
              projects={projects}
              currentProject={currentProject}
              onSelectProject={(p) => {
                setCurrentProject(p);
                setCode(p.code);
              }}
              onNewProject={handleNewProject}
              isCollapsed={false}
              setIsCollapsed={() => {}}
            />
          </SheetContent>
        </Sheet>
      </div>
      
      <main className="flex-1 flex overflow-hidden relative">
        {/* Toggle Mode Button */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 z-30 flex bg-[#111827]/80 backdrop-blur-xl p-1.5 border border-white/10 rounded-2xl shadow-2xl">
           <button 
             onClick={() => setMode('chat')}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm", 
               mode === 'chat' 
                 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                 : "text-gray-400 hover:text-white"
             )}
           >
             <MessageSquare size={16} />
             <span>AI Chat</span>
           </button>
           <button 
             onClick={() => setMode('structure')}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm", 
               mode === 'structure' 
                 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                 : "text-gray-400 hover:text-white"
             )}
           >
             <ListTree size={16} />
             <span>Structure</span>
           </button>
        </div>

        {/* Deploy Status Indicator (Top Right) */}
        <div className="absolute right-4 top-4 z-30 hidden lg:flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {mode === 'chat' ? (
            <ChatPanel 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
          ) : (
            <div className="w-[450px] flex-shrink-0 bg-[#0B0F19] border-r border-white/5 animate-in slide-in-from-left duration-300">
              <LandingPageBuilder />
            </div>
          )}

          <BuilderPanel 
            code={code} 
            onCodeChange={(newCode) => {
              setCode(newCode);
              if (currentProject) {
                 updateProject(currentProject._id, { code: newCode, name: currentProject.name });
              }
            }} 
          />
        </div>
      </main>
    </div>
  );
}

