import { ChromaClient, Collection, CloudClient } from 'chromadb';
import { VectorChunk, SearchResult } from '../types/index.js';

/**
 * A persistent vector store using ChromaDB.
 */
export class ChromaStore {
    private client: ChromaClient | CloudClient;
    private collection: Collection | null = null;
    private collectionName: string = "evidenceai_collection";

    constructor() {
        const apiKey = process.env.CHROMA_API_KEY;
        if (apiKey && apiKey.startsWith('ck-')) {
            // Use Cloud Connection
            this.client = new CloudClient({
                apiKey: apiKey,
                tenant: process.env.CHROMA_TENANT || 'default',
                database: process.env.CHROMA_DATABASE || 'default',
            });
        } else {
            // Local fallback
            this.client = new ChromaClient();
        }
    }

    /**
     * Initializes the ChromaDB collection.
     */
    public async init(): Promise<void> {
        try {
            this.collection = await this.client.getOrCreateCollection({
                name: this.collectionName,
            });
        } catch (error) {
            console.error('ChromaDB initialization error:', error);
            throw new Error('Failed to initialize ChromaDB.');
        }
    }

    /**
     * Adds multiple chunks with embeddings to ChromaDB.
     */
    public async addBatch(batch: VectorChunk[]): Promise<void> {
        if (!this.collection) await this.init();

        await this.collection!.add({
            ids: batch.map(c => c.id),
            embeddings: batch.map(c => c.embedding),
            metadatas: batch.map(c => ({ content: c.content, ...c.metadata })),
            documents: batch.map(c => c.content),
        });
    }

    /**
     * Searches for top-k similar documents.
     */
    public async searchSimilar(queryVector: number[], limit: number = 3): Promise<SearchResult[]> {
        if (!this.collection) await this.init();

        const results = await this.collection!.query({
            queryEmbeddings: [queryVector],
            nResults: limit,
        });

        const searchResults: SearchResult[] = [];

        if (results.ids[0]) {
            for (let i = 0; i < results.ids[0].length; i++) {
                const score = (results.distances && results.distances[0] && results.distances[0][i] !== undefined)
                    ? 1 - (results.distances[0][i] ?? 0)
                    : 0;

                searchResults.push({
                    id: results.ids[0][i],
                    content: results.documents[0]?.[i] || '',
                    score: score,
                    metadata: results.metadatas?.[0]?.[i] as Record<string, unknown>,
                });
            }
        }

        return searchResults;
    }

    /**
     * Clears the collection.
     */
    public async clear(): Promise<void> {
        await this.client.deleteCollection({ name: this.collectionName });
        this.collection = null;
    }
}
