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
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Prompt for the AI
    const systemInstruction = `You are a web builder assistant. The user wants to modify their website. 
    Current website code:
    \`\`\`html
    ${currentCode}
    \`\`\`
    When generating code, always wrap the FINAL COMPLETE code in a single \`\`\`html ... \`\`\` block. 
    Focus on creating a polished, modern landing page with Tailwind CSS.`;

    try {
      // First attempt: OpenRouter via backend
      const response = await chatApi.send(updatedMessages.map(m => ({
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
                const delta = data.choices[0].delta.content;
                if (delta) {
                  assistantContent += delta;
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].content = assistantContent;
                    return newMsgs;
                  });
                }
              } catch (e) {}
            }
          }
        }
        return assistantContent;
      } else {
        // Fallback: Use Gemini directly from frontend
        console.warn("OpenRouter failed or not configured. Falling back to Gemini.");
        
        const geminiMessages = updatedMessages.map(m => ({
           role: m.role === 'user' ? 'user' : 'model',
           parts: [{ text: m.role === 'user' ? (m === updatedMessages[updatedMessages.length - 1] ? `${systemInstruction}\n\nUser Request: ${m.content}` : m.content) : m.content }]
        }));

        const chat = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction
          }
        });

        // Use streaming for Gemini
        const streamResponse = await chat.sendMessageStream({ 
          message: content 
        });

        let assistantContent = '';
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        for await (const chunk of streamResponse) {
          const text = chunk.text;
          if (text) {
            assistantContent += text;
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1].content = assistantContent;
              return newMsgs;
            });
          }
        }
        return assistantContent;
      }
    } catch (error) {
      console.error('Chat Error:', error);
      toast.error('AI error. Try checking your API connection.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. If you are using OpenRouter, please ensure your API key is correct.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, sendMessage, isLoading, setMessages };
}
