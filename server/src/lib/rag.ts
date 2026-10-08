import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { ChromaStore } from './vectorStore.js';
import { createEmbedding } from './embedding.js';
import { chunkText } from './utils.js';
import { searchWeb } from './search.js';
import { SearchResult } from '../types/index.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Similarity threshold for RAG. 
 * If the best local match is below this, we trigger external search.
 */
const SIMILARITY_THRESHOLD = 0.5;

const SYSTEM_INSTRUCTIONS = `
    You are EvidenceAI, an expert AI coding agent and assistant.
    Rules:
    1. Answer the question based ONLY on the provided Context.
    2. If the Context doesn't contain the answer, say "I don't have enough information in my current data."
    3. Keep answers concise and strictly technical if necessary.
    4. Provide high-quality code snippets and explanations when coding tasks are involved.
    5. Use Markdown for formatting.
`;

/**
 * EvidenceAI RAG Engine (Orchestrator).
 * Manages document indexing, semantic search, and AI response generation.
 */
export class RagEngine {
    private store = new ChromaStore();

    /**
     * Breaks down text into semantic chunks and stores them in ChromaDB.
     */
    public async indexDocument(text: string): Promise<void> {
        console.log(`📑 Indexing document (${text.length} characters)...`);
        const chunks = chunkText(text);

        const vectorChunks = await Promise.all(
            chunks.map(async (content) => {
                const embedding = await createEmbedding(content);
                return { id: uuidv4(), content, embedding };
            })
        );

        await this.store.addBatch(vectorChunks);
        console.log(`✅ Successfully indexed ${chunks.length} chunks.`);
    }

    /**
     * Retrieves context (sources) for a query — shared by both query methods.
     */
    private async retrieveContext(query: string): Promise<{ sources: SearchResult[]; isFromWeb: boolean; context: string }> {
        const queryVector = await createEmbedding(query);
        let sources = await this.store.searchSimilar(queryVector, 2);
        let isFromWeb = false;

        const bestScore = sources.length > 0 ? sources[0].score : 0;

        if (bestScore < SIMILARITY_THRESHOLD) {
            console.log(`🕒 Low local match (${bestScore.toFixed(2)}). Engaging EvidenceAI Web Search...`);
            const webResult = await searchWeb(query);
            sources = webResult.sources;
            isFromWeb = true;
        }

        const context = sources.map(s => `[Source]: ${s.content}`).join('\n\n');
        return { sources, isFromWeb, context };
    }

    /**
     * Standard (non-streaming) query — kept for compatibility.
     */
    public async query(query: string): Promise<{ answer: string; sources: SearchResult[]; isFromWeb: boolean }> {
        const { sources, isFromWeb, context } = await this.retrieveContext(query);

        if (!process.env.GEMINI_API_KEY) {
            return {
                answer: '⚠️ **Key Missing**: Please add a `GEMINI_API_KEY` to your .env file.',
                sources,
                isFromWeb,
            };
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const prompt = `${SYSTEM_INSTRUCTIONS}\n\nContext:\n${context}\n\nUser Question: ${query}`;
            const result = await model.generateContent(prompt);
            const responseText = (await result.response).text();

            return { answer: responseText || 'No response generated.', sources, isFromWeb };
        } catch (error: any) {
            if (error.message?.includes('429') || error.message?.includes('Quota')) {
                return {
                    answer: '🕒 **EvidenceAI is resting**: Rate limit reached. Try again in a moment.',
                    sources,
                    isFromWeb,
                };
            }
            console.error('❌ Generation Agent error:', error.message);
            return {
                answer: `⚠️ **EvidenceAI Error**: ${error.message || 'The AI is currently unavailable.'}`,
                sources,
                isFromWeb,
            };
        }
    }

    /**
     * Streams the answer word-by-word using Gemini's streaming API.
     * Yields metadata first (sources, isFromWeb), then text chunks, then an optional error.
     */
    public async *queryStream(query: string): AsyncGenerator<{
        chunk?: string;
        sources?: SearchResult[];
        isFromWeb?: boolean;
        error?: string;
    }> {
        const { sources, isFromWeb, context } = await this.retrieveContext(query);

        // Emit sources/metadata immediately so the frontend can show it right away
        yield { sources, isFromWeb };

        if (!process.env.GEMINI_API_KEY) {
            yield { error: '⚠️ **Key Missing**: Please add a `GEMINI_API_KEY` to your .env file.' };
            return;
        }

        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const prompt = `${SYSTEM_INSTRUCTIONS}\n\nContext:\n${context}\n\nUser Question: ${query}`;

            const streamResult = await model.generateContentStream(prompt);

            // Iterate over the stream of chunks
            for await (const chunk of streamResult.stream) {
                const text = chunk.text();
                if (text) {
                    yield { chunk: text };
                }
            }
        } catch (error: any) {
            if (error.message?.includes('429') || error.message?.includes('Quota')) {
                yield { error: '🕒 **EvidenceAI is resting**: Rate limit reached. Try again in a moment.' };
                return;
            }
            console.error('❌ Stream error:', error.message);
            yield { error: `⚠️ **EvidenceAI Error**: ${error.message || 'The AI is currently unavailable.'}` };
        }
    }
}
