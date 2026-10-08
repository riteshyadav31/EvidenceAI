import { tavily } from '@tavily/core';
import dotenv from 'dotenv';
import { SearchResult } from '../types/index.js';

dotenv.config();

/**
 * Conducts a web search using the Tavily API.
 * This is used when the local vector store doesn't have relevant information.
 * 
 * @param query The search term.
 * @returns Object containing a summary (answer) and individual source snippets.
 */
export async function searchWeb(query: string): Promise<{ answer: string; sources: SearchResult[] }> {
    const apiKey = process.env.TAVILY_API_KEY;

    // Check for real key presence before even creating the client
    if (!apiKey || apiKey.includes('your_')) {
        console.warn('⚠️ Tavily key missing or placeholder used.');
        return {
            answer: `[SIMULATED SEARCH] No Tavily key found for "${query}".`,
            sources: [{ id: 'mock-web', content: 'Web search simulation activated.', score: 0.5 }]
        };
    }

    // Only initialize Tavily client when a real key is available
    const tvly = tavily({ apiKey });

    try {
        console.log(`🌐 EvidenceAI Web Search: Fetching results for "${query}"...`);

        const response = await tvly.search(query, {
            searchDepth: 'basic',
            maxResults: 3,
        });

        // Map results to our standard SearchResult type
        const sources: SearchResult[] = response.results.map((res: any, index: number) => ({
            id: `web-${index}`,
            content: res.content,
            score: res.score || 0.8,
            metadata: {
                url: res.url,
                title: res.title
            }
        }));

        const combinedContext = sources.map(s => s.content).join('\n\n');

        return {
            answer: combinedContext,
            sources
        };
    } catch (error: any) {
        // Handle common API issues like unauthorized access
        if (error.message?.includes('Unauthorized') || error.status === 401) {
            console.warn('❌ Tavily Authorization failed.');
            return {
                answer: `⚠️ **Search Error**: Web search authorization failed. Check your TAVILY_API_KEY.`,
                sources: []
            };
        }

        console.error('❌ Tavily search execution error:', error.message);
        throw new Error('Web search system failure.');
    }
}
