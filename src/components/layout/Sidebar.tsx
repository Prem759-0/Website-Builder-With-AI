import React from 'react';
import { LayoutGrid, Plus, Search, Settings, Folder, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Project } from '@/types';

interface SidebarProps {
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (p: Project) => void;
  onNewProject: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export function Sidebar({ 
  projects, 
  currentProject, 
  onSelectProject, 
  onNewProject,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 260 }}
      className="h-screen bg-[#0B0F19] border-r border-white/10 flex flex-col relative transition-all duration-300"
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Lumina
            </span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-white/5"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="px-4 mb-4">
          <Button 
            onClick={onNewProject}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-medium gap-2 h-10 shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            New Project
          </Button>
        </div>
      )}

      {!isCollapsed && (
        <div className="px-4 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search projects..." 
              className="pl-9 bg-white/5 border-white/10 h-9 text-sm focus-visible:ring-blue-500/50"
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => onSelectProject(project)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                currentProject?._id === project._id 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Folder size={16} className={cn(
                currentProject?._id === project._id ? "text-blue-400" : "text-muted-foreground group-hover:text-white"
              )} />
              {!isCollapsed && <span className="truncate flex-1 text-left">{project.name}</span>}
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
          <Settings size={18} />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="w-8 h-8 ring-2 ring-white/5">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs">JD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          )}
          {!isCollapsed && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
