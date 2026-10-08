import { RagEngine } from './lib/rag.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Demo entry point for the RAG system.
 */
async function runEvidenceAI() {
    const rag = new RagEngine();

    // 1. Loading dummy document data
    const longText = `
    The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. 
    It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. 
    The vast majority (99.86%) of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter. 
    The four inner system planets—Mercury, Venus, Earth and Mars—are terrestrial planets, being composed primarily of rock and metal. 
    The four outer system planets are giant planets, being substantially more massive than the terrestrials. 
    The two largest planets, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium. 
    The two outermost planets, Uranus and Neptune, are ice giants, being composed mostly of substances with relatively high melting points. 
    All eight planets have almost circular orbits that lie within a nearly flat disc called the ecliptic.
  `;

    console.log('🚀 Indexing document...');
    await rag.indexDocument(longText);

    // 2. Querying the document
    const userQuery = 'What are the two largest planets and what are they made of?';
    console.log(`🔍 Query: "${userQuery}"`);

    try {
        const { answer, sources } = await rag.query(userQuery);

        console.log('\n--- AI RESPONSE ---');
        console.log(answer);

        console.log('\n--- SOURCES USED ---');
        sources.forEach((s, i) => {
            console.log(`[Source ${i + 1}]: ${s.content.slice(0, 100)}... (Score: ${s.score.toFixed(4)})`);
        });
    } catch (error) {
        console.error('An error occurred during query:', error);
    }
}

// Global error handling for the entry point
runEvidenceAI().catch(console.error);
