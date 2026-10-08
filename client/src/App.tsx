import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { ChatHeader } from './components/chat/ChatHeader';
import { ChatMessage } from './components/chat/ChatMessage';
import { ChatInput } from './components/chat/ChatInput';
import type { Message } from './types/chat';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am **EvidenceAI**. Upload a document or ask me anything. If I don\'t know it locally, I\'ll search the internet for you.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Add empty assistant bubble immediately — chunks will fill it in
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('http://localhost:3001/api/query/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      setLoading(false); // Hide spinner as soon as steam opens

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE lines are separated by "\n\n"
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? ''; // Keep incomplete tail for next chunk

        for (const line of lines) {
          const raw = line.replace(/^data: /, '').trim();
          if (!raw || raw === '[DONE]') continue;

          const event = JSON.parse(raw);

          if (event.sources !== undefined) {
            // First event: metadata (sources + isFromWeb)
            setMessages(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, isFromWeb: event.isFromWeb, sources: event.sources };
              return updated;
            });
          } else if (event.chunk) {
            // Text chunk: append to the last assistant message
            setMessages(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, content: last.content + event.chunk };
              return updated;
            });
          } else if (event.error) {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: event.error };
              return updated;
            });
          }
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: 'Connection failed. Is the server running?' };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: `Success! I've indexed **${file.name}**. You can now ask questions about it.` }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to upload PDF.' }]);
    } finally {
      setUploading(false);
      // Reset input so the same file could be selected again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto h-screen flex flex-col p-2 sm:p-4 md:p-6">
        <ChatHeader />

        {/* Chat Area */}
        <Card className="flex-1 bg-slate-900/40 border-slate-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative mb-2 sm:mb-4">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 space-y-6">
              {messages.map((m, i) => (
                <ChatMessage key={i} message={m} />
              ))}

              {loading && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl rounded-tl-none p-4 backdrop-blur-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onFileUpload={handleFileUpload}
            loading={loading}
            uploading={uploading}
          />
        </Card>
      </div>
    </div>
  );
}
