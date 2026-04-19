import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { BuilderPanel } from '@/components/layout/BuilderPanel';
const LandingPageBuilder = lazy(() => import('@/components/layout/LandingPageBuilder').then(mod => ({ default: mod.LandingPageBuilder })));
import { Project, Message } from '@/types';
import { projectApi, userApi } from '@/lib/api';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { MessageSquare, ListTree, Menu, Share2, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserStats } from '@/types';

export default function Dashboard() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState<'chat' | 'structure'>('chat');
  const [code, setCode] = useState('<!-- Describe your website in the chat to start generating! -->\n<div style="height: 100vh; display: flex; align-items: center; justify-center; background: #0B0F19; color: white; font-family: sans-serif; text-align: center;">\n  <div>\n    <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem;">Ready to Build</h1>\n    <p style="color: #94a3b8;">Start a conversation with Lumina AI to generate your site.</p>\n  </div>\n</div>');
  
  const { messages, sendMessage, generateSite, isLoading, isGenerating } = useChat();

  const handleSendMessage = useCallback(async (msg: string) => {
    // If it looks like a design request, use the generation engine
    if (msg.toLowerCase().includes('create') || msg.toLowerCase().includes('build') || msg.toLowerCase().includes('generate')) {
      toast.loading('Generating your website...');
      const siteData = await generateSite(msg, code);
      if (siteData && siteData.html) {
        setCode(siteData.html);
        if (currentProject) {
          updateProject(currentProject._id, { code: siteData.html, name: siteData.title || currentProject.name });
        }
        toast.dismiss();
        toast.success('Website generated!');
      } else {
        toast.dismiss();
      }
      return;
    }

    // Otherwise, normal chat logic
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
  }, [sendMessage, generateSite, code, currentProject]);

  const handleImproveDesign = useCallback(async () => {
    if (!currentProject) return;
    const prompt = "Improve the overall UI/UX of this website. Make it more professional, modern, and high-converting. Use better typography, spacing, and micro-interactions with Tailwind CSS.";
    handleSendMessage(prompt);
  }, [currentProject, handleSendMessage]);

  const handlePublish = useCallback(async () => {
    if (!code) return;
    toast.loading('Publishing your site...');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      toast.dismiss();
      if (data.url) {
        toast.success('Site published successfully!');
        window.open(data.url, '_blank');
      }
    } catch (e) {
      toast.dismiss();
      toast.error('Failed to publish site');
    }
  }, [code]);

  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await userApi.getStats(user.id);
      setStats(res.data);
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  }, [user]);

  const loadProjects = useCallback(async () => {
    if (!user) return;
    try {
      const res = await projectApi.list(user.id);
      setProjects(res.data);
      if (res.data.length > 0 && !currentProject) {
        setCurrentProject(res.data[0]);
        setCode(res.data[0].code);
      }
      loadStats();
    } catch (e) {
      console.error(e);
    }
  }, [user, currentProject, loadStats]);

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
      toast.error('Failed to sync changes');
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] overflow-hidden text-slate-100 selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar 
          projects={projects}
          stats={stats}
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
              stats={stats}
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
              <Suspense fallback={
                <div className="flex-1 flex items-center justify-center bg-[#0B0F19] border-r border-white/5">
                  <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              }>
                <LandingPageBuilder />
              </Suspense>
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
            onImprove={handleImproveDesign}
            onPublish={handlePublish}
          />
        </div>
      </main>
    </div>
  );
}

