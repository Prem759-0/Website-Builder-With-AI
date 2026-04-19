import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, User, Bot, Copy, Check, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const suggestions = [
    { label: "SaaS Landing Page", prompt: "Create a modern SaaS landing page for a fitness app" },
    { label: "Portfolio", prompt: "Build a sleek personal portfolio for a designer" },
    { label: "E-commerce", prompt: "Create a clean e-commerce homepage for a coffee brand" },
    { label: "Startup", prompt: "Generate a vibrant startup website with pricing and features" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0F19] border-r border-white/5 w-full max-w-2xl relative z-10 transition-all">
      {/* Chat Header */}
      <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-[#0B0F19]/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
            <Sparkles className="text-blue-400" size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Lumina Assistant</h2>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg">
              <Terminal size={16} />
           </Button>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
        <div className="max-w-2xl mx-auto space-y-8">
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center pt-20 text-center space-y-6"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-500">
                  <Sparkles size={40} className="text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight">What shall we build?</h3>
                <p className="text-gray-500 text-sm max-w-[320px] leading-relaxed">
                  I can help you build landing pages, dashboards, or any web component using AI.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
                 {suggestions.map((s) => (
                   <button 
                     key={s.label}
                     onClick={() => onSendMessage(s.prompt)}
                     className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-all hover:border-white/10"
                   >
                     {s.label}
                   </button>
                 ))}
              </div>
            </motion.div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "flex gap-4 group",
                  msg.role === 'user' ? "flex-row-reverse" : "items-start"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 shadow-lg",
                  msg.role === 'user' 
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600" 
                    : "bg-white/5 border border-white/10"
                )}>
                  {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-blue-400" />}
                </div>

                <div className={cn(
                  "flex flex-col gap-2 relative",
                  msg.role === 'user' ? "items-end max-w-[80%]" : "items-start max-w-[85%]"
                )}>
                  <div className={cn(
                    "px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-xl",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10" 
                      : "bg-white/[0.03] text-gray-100 border border-white/5 rounded-tl-none ring-1 ring-white/5"
                  )}>
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-xl font-black mb-4 text-white tracking-tight">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-bold mb-3 text-white/90 tracking-tight">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-white/80">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-gray-200/90">{children}</p>,
                        ul: ({ children }) => <ul className="space-y-2 mb-4 list-disc list-inside text-gray-300">{children}</ul>,
                        ol: ({ children }) => <ol className="space-y-2 mb-4 list-decimal list-inside text-gray-300">{children}</ol>,
                        li: ({ children }) => <li className="marker:text-blue-500">{children}</li>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500/50 pl-4 py-1 my-4 italic bg-blue-500/5 rounded-r-lg text-gray-400">
                            {children}
                          </blockquote>
                        ),
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <div className="relative my-6 group/code">
                              <div className="absolute -top-3 left-4 px-2 py-0.5 rounded-md bg-[#1e1e1e] border border-white/10 text-[10px] font-bold text-gray-500 uppercase tracking-widest z-10">
                                {match ? match[1] : 'code'}
                              </div>
                              <pre className="p-5 rounded-2xl bg-black/40 border border-white/10 overflow-x-auto text-[13px] font-mono leading-relaxed ring-1 ring-white/5 shadow-2xl">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            </div>
                          ) : (
                            <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-blue-400 text-[13px] font-medium" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {msg.role === 'assistant' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3 px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button 
                        onClick={() => copyToClipboard(msg.content)}
                        className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all outline-none"
                        title="Copy to clipboard"
                      >
                        <Copy size={13} />
                      </button>
                      <button className="text-gray-500 hover:text-blue-400 transition-colors">
                        <Check size={13} />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                <Bot size={18} className="text-blue-400" />
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl rounded-tl-none px-6 h-12 flex items-center justify-center gap-1.5 shadow-lg">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-6 border-t border-white/5 bg-[#0B0F19]">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group/input">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 via-indigo-600/50 to-purple-600/50 rounded-[28px] blur-2xl opacity-0 group-focus-within/input:opacity-30 transition-all duration-1000 shadow-[0_0_50px_rgba(59,130,246,0.3)]"></div>
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700"></div>
            <div className="relative bg-[#111827]/80 backdrop-blur-3xl rounded-[24px] border border-white/10 p-2 shadow-2xl focus-within:border-white/20 transition-all duration-500 ring-1 ring-white/5 group-focus-within/input:ring-blue-500/20">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to build anything..."
                className="min-h-[70px] max-h-[220px] bg-transparent border-none focus-visible:ring-0 resize-none py-3 px-4 text-sm text-white placeholder:text-gray-600 leading-relaxed font-medium"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex gap-1.5">
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Paperclip size={18} />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Mic size={18} />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest hidden sm:block">Press Enter ↵</span>
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "h-10 px-6 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider",
                      input.trim() && !isLoading 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 scale-100" 
                        : "bg-white/5 text-gray-600 scale-95 opacity-50"
                    )}
                  >
                    <Send size={14} className="mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </form>
          <div className="flex items-center justify-center gap-4 mt-4">
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-none">GPT-4o Ready</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest leading-none">Vercel Edge</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
