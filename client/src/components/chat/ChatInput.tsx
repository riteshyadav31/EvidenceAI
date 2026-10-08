import React, { useRef } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    uploading: boolean;
}

export function ChatInput({
    input,
    setInput,
    onSend,
    onFileUpload,
    loading,
    uploading
}: ChatInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };

    return (
        <div className="p-2 sm:p-4 bg-slate-900/60 border-t border-slate-800/50 backdrop-blur-md">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileUpload}
                    className="hidden"
                    accept=".pdf"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95 flex-shrink-0"
                >
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                </Button>
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask EvidenceAI..."
                    className="bg-slate-950/50 border-slate-800 focus-visible:ring-indigo-500/50 h-10 sm:h-12 rounded-xl text-slate-200 flex-1 text-sm font-medium"
                />
                <Button
                    onClick={onSend}
                    disabled={loading || !input.trim()}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-90 flex-shrink-0 shadow-lg shadow-indigo-600/20"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>
            <p className="text-[9px] sm:text-[10px] text-center text-slate-500 mt-2">
                EvidenceAI Intelligence &bull; Powered by ChromaDB & Tavily
            </p>
        </div>
    );
}
