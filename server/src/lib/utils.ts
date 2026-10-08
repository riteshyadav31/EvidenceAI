/**
 * Splits text into fixed-size chunks with overlap.
 * This is a foundational step in RAG.
 * 
 * @param text The source text.
 * @param chunkSize Maximum characters per chunk.
 * @param overlap Overlap between chunks.
 * @returns Array of text chunks.
 */
export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end).trim());
        start += chunkSize - overlap;
    }

    return chunks;
}
