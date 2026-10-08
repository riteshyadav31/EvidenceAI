import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { RagEngine } from './lib/rag.js';
import { loadPdfFromBuffer } from './lib/pdfLoader.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const rag = new RagEngine();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
});

/**
 * Endpoint to ask a question (RAG + Web Search) — standard JSON response.
 */
app.post('/api/query', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const result = await rag.query(query);
        res.json(result);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Query error:', message);
        res.status(500).json({ error: message });
    }
});

/**
 * Streaming endpoint for real-time word-by-word AI responses (Server-Sent Events).
 */
app.post('/api/query/stream', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        for await (const event of rag.queryStream(query)) {
            const payload = JSON.stringify(event);
            res.write(`data: ${payload}\n\n`);
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Streaming failed.';
        console.error('Stream error:', message);
        res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    } finally {
        res.write('data: [DONE]\n\n');
        res.end();
    }
});

/**
 * Endpoint to upload and index a PDF document.
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const { text } = await loadPdfFromBuffer(req.file.buffer);
        await rag.indexDocument(text);
        res.json({ success: true, message: 'PDF indexed successfully' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to process PDF';
        console.error('Upload error:', message);
        res.status(500).json({ error: message });
    }
});

/**
 * Health check.
 */
app.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'EvidenceAI' });
});

app.listen(port, () => {
    console.log(`🚀 EvidenceAI API running at http://localhost:${port}`);
});
