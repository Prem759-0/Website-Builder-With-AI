import React, { useState } from 'react';
import { LayoutGrid, Plus, Search, Settings, Folder, User, LogOut, ChevronLeft, ChevronRight, Sparkles, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '@/types';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';

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
  const [search, setSearch] = useState('');
  const { user } = useUser();
  const { signOut } = useClerk();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 280 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen bg-[#0B0F19] border-r border-white/5 flex flex-col relative z-30 overflow-hidden"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-[#0B0F19]">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div 
              key="logo-full"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <LayoutGrid size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white leading-none">Lumina AI</span>
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-wider mt-0.5">Editor</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="logo-mini"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 mx-auto"
            >
              <LayoutGrid size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isCollapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(true)}
            className="h-8 w-8 hover:bg-white/5 text-gray-500 hover:text-white"
          >
            <ChevronLeft size={16} />
          </Button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {!isCollapsed ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Button 
              onClick={onNewProject}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold gap-2.5 h-11 shadow-lg shadow-blue-500/10 rounded-xl"
            >
              <Plus size={18} />
              New Website
            </Button>

            <div className="relative group">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find project..." 
                className="pl-10 bg-white/5 border-white/5 h-10 text-sm focus-visible:ring-blue-500/40 rounded-xl placeholder:text-gray-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
                 <kbd className="text-[10px] bg-white/10 px-1 rounded text-gray-400">ESC</kbd>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={onNewProject}
              size="icon"
              className="h-11 w-11 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/10"
            >
              <Plus size={20} />
            </Button>
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => setIsCollapsed(false)}
              className="h-11 w-11 rounded-xl hover:bg-white/5 text-gray-500"
            >
              <Search size={20} />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 px-3 pb-4">
        <div className="px-3 mb-3 flex items-center justify-between">
           {!isCollapsed && <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Recent Projects</span>}
           {!isCollapsed && <span className="text-[10px] text-gray-600">{filteredProjects.length}</span>}
        </div>
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-1 pr-3">
            {filteredProjects.map((project) => (
              <button
                key={project._id}
                onClick={() => onSelectProject(project)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                  currentProject?._id === project._id 
                    ? "bg-blue-600/10 text-blue-400 font-medium" 
                    : "text-gray-400 hover:bg-white/[0.03] hover:text-gray-200"
                )}
              >
                {currentProject?._id === project._id && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute left-0 w-1 h-5 bg-blue-500 rounded-full"
                  />
                )}
                <Folder size={18} className={cn(
                  "transition-colors",
                  currentProject?._id === project._id ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300"
                )} />
                {!isCollapsed && <span className="truncate flex-1 text-left">{project.name}</span>}
              </button>
            ))}
            {filteredProjects.length === 0 && !isCollapsed && (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-gray-600">No projects found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-auto p-4 border-t border-white/5 bg-[#0B0F19]/50 backdrop-blur-md">
        {!isCollapsed && (
          <div className="mb-4 bg-white/[0.03] rounded-2xl p-3 border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5">
              <Sparkles size={18} className="text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[11px] font-bold text-white uppercase tracking-tight">Pro Plan</p>
               <p className="text-[10px] text-gray-500">Unlimited AI generations</p>
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed ? "justify-center" : "px-1"
        )}>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
                userButtonTrigger: "focus:shadow-none"
              }
            }}
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          )}
          {!isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => signOut()}
              className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </Button>
          )}
        </div>
      </div>

      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#0B0F19] border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white shadow-xl z-50 group transition-transform hover:scale-110"
        >
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </motion.aside>
  );
}

