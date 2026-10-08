import React from 'react';
import { Cpu } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export function ChatHeader() {
    return (
        <header className="flex items-center justify-between mb-4 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-700 px-2 lg:px-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Cpu className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">EvidenceAI</h1>
                    <p className="text-xs text-slate-400 font-medium">Agentic RAG Engine</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                    v1.0.0
                </Badge>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5 text-[10px]">
                    Connected
                </Badge>
            </div>
        </header>
    );
}
