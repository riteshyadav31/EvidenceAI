import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Creates a semantic vector embedding using Google Gemini (Free Tier).
 * This model converts text into a mathematical representation used for vector search.
 * 
 * @param text The source text to be vectorized.
 * @returns A promise that resolves to an array of numbers representing the text.
 */
export async function createEmbedding(text: string): Promise<number[]> {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️ No GEMINI_API_KEY found. Falling back to mock embeddings for development.');
        return Array.from({ length: 3072 }, () => Math.random() * 2 - 1);
    }

    try {
        // Using 'gemini-embedding-001' as it is the standard for stable embeddings
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(text);

        if (!result.embedding?.values) {
            throw new Error('Gemini returned an empty embedding.');
        }

        return result.embedding.values;
    } catch (error: any) {
        // Handle specific quota errors gracefully
        if (error.message?.includes('429') || error.message?.includes('Quota exceeded')) {
            console.warn('🕒 Gemini Quota Limit reached. Using mock fallback for current request.');
            return Array.from({ length: 3072 }, () => Math.random() * 2 - 1);
        }

        console.error('❌ Gemini Embedding error:', error.message);
        // Minimal fallback to prevent application crash
        return Array.from({ length: 3072 }, () => Math.random() * 2 - 1);
    }
}

/**
 * Creates embeddings for multiple text chunks in parallel.
 * Follows 'Parallel execution' coding standard.
 * 
 * @param chunks Array of strings to vectorize.
 * @returns Array of numerical embeddings.
 */
export async function createBatchEmbeddings(chunks: string[]): Promise<number[][]> {
    return Promise.all(chunks.map(chunk => createEmbedding(chunk)));
}
