import { PDFParse } from 'pdf-parse';

/**
 * Utility to extract text content and metadata from PDF buffers.
 */
export async function loadPdfFromBuffer(buffer: Buffer): Promise<{ text: string; metadata: any }> {
    try {
        const parser = new PDFParse({ data: buffer });
        const textResult = await parser.getText();
        const infoResult = await parser.getInfo();

        return {
            text: textResult.text || '',
            metadata: {
                pages: infoResult.pages,
                info: infoResult.info,
            },
        };
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF document.');
    } finally {
        // Based on the API, there might not be a destroy or it might be explicit
    }
}
