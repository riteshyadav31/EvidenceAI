export interface SearchResult {
    id: string;
    content: string;
    score: number;
    metadata?: {
        url?: string;
        title?: string;
    };
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    isFromWeb?: boolean;
    sources?: SearchResult[];
}
