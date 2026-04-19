import { useState, useCallback } from 'react';
import { Message } from '@/types';
import { chatApi } from '@/lib/api';
import { GoogleGenAI } from "@google/genai";
import { toast } from 'sonner';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string, currentCode: string) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content };
    let currentMessages: Message[] = [];
    
    setMessages(prev => {
      currentMessages = [...prev, userMessage];
      return currentMessages;
    });

    const systemInstruction = `You are a web builder assistant. The user wants to modify their website. 
    Current website code:
    \`\`\`html
    ${currentCode}
    \`\`\`
    When generating code, always wrap the FINAL COMPLETE code in a single \`\`\`html ... \`\`\` block. 
    Focus on creating a polished, modern landing page with Tailwind CSS.`;

    try {
      // First attempt: OpenRouter via backend
      const response = await chatApi.send(currentMessages.map(m => ({
        role: m.role,
        content: m.role === 'user' ? `${systemInstruction}\n\nUser Request: ${m.content}` : m.content
      })));
      
      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const delta = data.choices[0].delta?.content;
                if (delta) {
                  assistantContent += delta;
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    if (newMsgs.length > 0) {
                      newMsgs[newMsgs.length - 1].content = assistantContent;
                    }
                    return newMsgs;
                  });
                }
              } catch (e) {}
            }
          }
        }
        return assistantContent;
      } else {
        // Fallback: Gemini
        const chat = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: { systemInstruction }
        });

        const streamResponse = await chat.sendMessageStream({ message: content });

        let assistantContent = '';
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        for await (const chunk of streamResponse) {
          const text = chunk.text;
          if (text) {
            assistantContent += text;
            setMessages(prev => {
              const newMsgs = [...prev];
              if (newMsgs.length > 0) {
                newMsgs[newMsgs.length - 1].content = assistantContent;
              }
              return newMsgs;
            });
          }
        }
        return assistantContent;
      }
    } catch (error) {
      console.error('Chat Error:', error);
      toast.error('AI error. Try checking your API connection.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencies empty because we use functional updates and local variable

  const [isGenerating, setIsGenerating] = useState(false);

  const generateSite = useCallback(async (prompt: string, currentCode: string) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, currentCode })
      });
      
      if (!res.ok) throw new Error('Failed to generate site');
      
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate site. Check your connection.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { messages, sendMessage, generateSite, isLoading, isGenerating, setMessages };
}
