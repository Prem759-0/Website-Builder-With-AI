import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, User, Bot, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#111827] border-r border-white/10 w-full max-w-xl">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-400" size={18} />
          <h2 className="font-semibold text-white">Lumina AI</h2>
        </div>
        <select className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-muted-foreground outline-none focus:ring-1 focus:ring-blue-500">
          <option value="gpt-4o">Gemma 2b (Fast)</option>
          <option value="claude-3-5">Llama 3 (Precise)</option>
        </select>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                <Sparkles size={32} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">How can I help you build today?</h3>
                <p className="text-muted-foreground text-sm max-w-[280px]">
                  Describe the website you want to create, and I'll generate the code for you instantly.
                </p>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                  msg.role === 'user' ? "bg-white/10" : "bg-blue-600"
                )}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                  "flex flex-col gap-1 max-w-[85%]",
                  msg.role === 'user' ? "items-end" : ""
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm prose prose-invert overflow-x-auto",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white/5 text-gray-200 border border-white/10 rounded-tl-none ring-1 ring-white/5"
                  )}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 px-1">
                      <button className="text-muted-foreground hover:text-white p-1 rounded-md transition-colors">
                        <Copy size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center animate-pulse">
                <Bot size={16} />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 w-12 h-10 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 bg-[#111827]">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-15 group-focus-within:opacity-30 transition duration-500"></div>
          <div className="relative bg-[#0B0F19] rounded-2xl border border-white/10 p-2 focus-within:border-white/20 transition-all">
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g. Create a dark landing page for a gym..."
              className="min-h-[60px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 resize-none py-2 pr-12 text-sm text-white placeholder:text-muted-foreground/60"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center justify-between px-2 py-1.5 border-t border-white/5">
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5">
                  <Paperclip size={16} />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5">
                  <Mic size={16} />
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className={cn(
                  "h-8 px-4 rounded-xl transition-all font-medium",
                  input.trim() && !isLoading 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-white/5 text-muted-foreground"
                )}
              >
                <Send size={14} className="mr-2" />
                Send
              </Button>
            </div>
          </div>
        </form>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          Powered by Lumina Intelligence & Gemini 1.5
        </p>
      </div>
    </div>
  );
}
