import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { BuilderPanel } from '@/components/layout/BuilderPanel';
import { LandingPageBuilder } from '@/components/layout/LandingPageBuilder';
import { Project, Message } from '@/types';
import { projectApi } from '@/lib/api';
import { useChat } from '@/hooks/useChat';
import { toast } from 'sonner';
import { MessageSquare, ListTree } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mode, setMode] = useState<'chat' | 'structure'>('chat');
  const [code, setCode] = useState('<!-- Describe your website in the chat to start generating! -->\n<div style="height: 100vh; display: flex; align-items: center; justify-center; background: #0B0F19; color: white; font-family: sans-serif;">\n  <h1>Welcome to Lumina</h1>\n</div>');
  
  const { messages, sendMessage, isLoading } = useChat();

  const handleSendMessage = async (msg: string) => {
    const aiContent = await sendMessage(msg, code);
    
    // Extract code from AI response if it contains a code block
    if (aiContent) {
      const codeMatch = aiContent.match(/```html\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        setCode(codeMatch[1]);
        if (currentProject) {
           updateProject(currentProject._id, { code: codeMatch[1], name: currentProject.name });
        }
      }
    }
  };

  const loadProjects = async () => {
    try {
      const res = await projectApi.list('user_123'); // Semi-hardcoded for now
      setProjects(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleNewProject = async () => {
    const name = `New Project ${projects.length + 1}`;
    try {
      const res = await projectApi.create({ name, userId: 'user_123', code });
      setProjects([res.data, ...projects]);
      setCurrentProject(res.data);
      toast.success('Project created');
    } catch (e) {
      toast.error('Failed to create project');
    }
  };

  const updateProject = async (id: string, data: { code: string, name: string }) => {
    try {
      await projectApi.update(id, data);
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0F19] overflow-hidden text-slate-100">
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
      
      <main className="flex-1 flex overflow-hidden relative">
        <div className="absolute left-4 top-4 z-20 flex bg-[#0B0F19]/80 backdrop-blur-md p-1 border border-white/10 rounded-xl">
           <button 
             onClick={() => setMode('chat')}
             className={cn("p-2 rounded-lg transition-all", mode === 'chat' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-muted-foreground hover:text-white")}
           >
             <MessageSquare size={18} />
           </button>
           <button 
             onClick={() => setMode('structure')}
             className={cn("p-2 rounded-lg transition-all", mode === 'structure' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-muted-foreground hover:text-white")}
           >
             <ListTree size={18} />
           </button>
        </div>

        {mode === 'chat' ? (
          <ChatPanel 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
        ) : (
          <div className="w-[400px] border-r border-white/10 flex-shrink-0">
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
      </main>
    </div>
  );
}
