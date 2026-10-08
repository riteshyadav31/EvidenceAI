
import { Shield, Globe } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "max-w-[90%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-sm leading-relaxed shadow-sm",
                isUser
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-tl-none backdrop-blur-sm"
            )}>
                <div className="flex items-center gap-2 mb-2 opacity-60">
                    {isUser ? (
                        <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                            <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Alex&backgroundColor=transparent" alt="User" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                        {isUser ? 'User' : 'EvidenceAI'}
                    </span>
                    {message.isFromWeb && (
                        <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-blue-500/30 text-blue-400 bg-blue-500/5">
                            <Globe className="w-2 h-2 mr-1" /> WEB SEARCH
                        </Badge>
                    )}
                </div>
                <div className="prose prose-sm prose-invert max-w-none break-words leading-relaxed">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-2">Sources Found</p>
                        <div className="flex flex-wrap gap-2">
                            {message.sources.map((s, idx) => (
                                <div key={idx} className="text-[10px] bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50 text-slate-400 truncate max-w-[200px]">
                                    {s.metadata?.title || s.metadata?.url || `Source ${idx + 1}`}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
