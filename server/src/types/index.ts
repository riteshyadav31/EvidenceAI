/**
 * Represents a document chunk with its metadata and embedding.
 */
export interface DocumentChunk {
    id: string;
    content: string;
    metadata?: Record<string, unknown>;
}

/**
 * Represents a document chunk with its vector embedding.
 */
export interface VectorChunk extends DocumentChunk {
    embedding: number[];
}

/**
 * Result of a vector search, including a similarity score.
 */
export interface SearchResult extends DocumentChunk {
    score: number;
}
