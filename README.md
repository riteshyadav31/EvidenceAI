# 🧠 EvidenceAI: Intelligent RAG & Web Search Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)](./CONTRIBUTING.md)

**EvidenceAI** is an intelligent Retrieval-Augmented Generation (RAG) application that lets users chat with their documents and automatically use web search when relevant information cannot be found in the uploaded content.

It combines **Google Gemini**, **ChromaDB Cloud**, and **Tavily** to create a document-aware AI assistant with real-time response streaming.

---

## ✨ Key Features

- 📄 **PDF Intelligence** — Upload PDF documents and index their content for semantic retrieval.
- 🔎 **RAG-based Retrieval** — Retrieve relevant document chunks using vector similarity search.
- 🌐 **Smart Web Fallback** — Automatically use Tavily web search when the required information is not available in the uploaded documents.
- ⚡ **Real-time Streaming** — Stream AI responses using Server-Sent Events (SSE).
- 📝 **Markdown Rendering** — Display AI responses with formatted text, lists, code blocks, and other Markdown content.
- 📎 **File Attachments** — Upload documents directly through the chat interface.
- 🎨 **Modern UI** — Responsive interface built with React and modern UI components.
- 📊 **Backend Logging** — Track application interactions with timestamped server-side logs.

---

## 🧠 How EvidenceAI Works

EvidenceAI follows a typical RAG pipeline:

```text
                  ┌──────────────────┐
                  │      User        │
                  │  Question / PDF  │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  PDF Processing  │
                  │  Text Extraction │
                  │   + Chunking     │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Gemini Embedding │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    ChromaDB      │
                  │   Vector Store   │
                  └────────┬─────────┘
                           │
                    User Question
                           │
                           ▼
                  ┌──────────────────┐
                  │ Semantic Search  │
                  │   + Retrieval    │
                  └────────┬─────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
          Relevant Context       No Relevant
             Found?               Context
                │                     │
                ▼                     ▼
        ┌───────────────┐    ┌────────────────┐
        │ Gemini LLM    │    │ Tavily Web     │
        │ Generation    │    │ Search         │
        └───────┬───────┘    └───────┬────────┘
                │                    │
                └─────────┬──────────┘
                          ▼
                  ┌──────────────────┐
                  │ Streaming Answer │
                  │      via SSE     │
                  └──────────────────┘
```

### RAG Pipeline

1. **Ingestion** — PDF text is extracted and divided into smaller chunks.
2. **Embedding** — Document chunks are converted into vector embeddings using Google Gemini.
3. **Storage** — Embeddings and document information are stored in ChromaDB Cloud.
4. **Retrieval** — User queries are converted into embeddings and compared against stored vectors.
5. **Fallback Search** — If relevant document context is not available, Tavily performs a web search.
6. **Generation** — Retrieved context is provided to Gemini to generate the final response.
7. **Streaming** — The response is sent to the frontend incrementally using SSE.

---

## ⚡ Real-Time Streaming

EvidenceAI uses **Server-Sent Events (SSE)** to provide a real-time AI chat experience.

```text
User sends message
        ↓
Frontend creates assistant message
        ↓
POST /api/query/stream
        ↓
Backend processes the request
        ↓
Retrieve document context
        ↓
Fallback to web search if required
        ↓
Gemini generates response
        ↓
Response chunks streamed via SSE
        ↓
Frontend progressively updates the message
        ↓
[DONE]
```

This allows users to start seeing the response without waiting for the complete AI generation to finish.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- **Node.js 18+**
- **npm**
- Google Gemini API key
- ChromaDB Cloud credentials
- Tavily API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/evidenceai.git
cd evidenceai
```

Replace `YOUR_USERNAME` with your GitHub username.

---

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key

CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_chroma_tenant
CHROMA_DATABASE=evidenceai

TAVILY_API_KEY=your_tavily_api_key
```

**Never commit your `.env` file or API keys to GitHub.**

---

### 3. Install Dependencies

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

---

### 4. Run the Backend

```bash
cd server
npm run dev
```

---

### 5. Run the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development and build tooling |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| Shadcn UI | UI components |
| Radix UI | Accessible primitives |
| React Markdown | Markdown rendering |
| Lucide Icons | Interface icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | Backend API |
| TypeScript | Type-safe backend development |
| Google Gemini | AI generation and embeddings |
| ChromaDB Cloud | Vector database |
| Tavily | Web search |
| Multer | File upload handling |
| PDF Parser | PDF text extraction |
| Server-Sent Events | Real-time streaming |

---

## 📁 Project Structure

```text
EvidenceAI/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── chat/
│       │   └── ui/
│       ├── types/
│       └── App.tsx
│
├── server/
│   └── src/
│       ├── lib/
│       │   ├── rag.ts
│       │   ├── embedding.ts
│       │   ├── vectorStore.ts
│       │   ├── search.ts
│       │   └── utils.ts
│       │
│       └── server.ts
│
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

---

## 🔐 Security

EvidenceAI uses external API services, so API credentials must be handled securely.

### Important

- Never commit `.env` files.
- Never expose API keys in frontend code.
- Use environment variables for sensitive configuration.
- Do not include private credentials in Git commits.
- Report security vulnerabilities privately instead of creating public issues.

See [SECURITY.md](./SECURITY.md) for security reporting guidelines.

---

## 🎨 Design Philosophy

EvidenceAI focuses on a simple and modern AI interaction experience.

### Responsive Interface

The application is designed to work across desktop and mobile screen sizes.

### Streaming Experience

AI responses appear progressively instead of waiting for the entire response to finish.

### Document + Web Intelligence

The system combines private document retrieval with web search fallback to provide broader contextual answers.

### Simple User Experience

The interface keeps document upload, questions, retrieved information, and AI responses within a single conversational workflow.

---

## 🤝 Contributing

Contributions are welcome!

Before contributing, please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

You can contribute through:

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation
- 🧪 Tests
- ⚡ Performance improvements
- 🔐 Security improvements
- 💡 Feature suggestions

---

## 📄 License

EvidenceAI is released under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Ritesh Yadav**

Built as an independent project to explore:

- Retrieval-Augmented Generation
- Vector databases
- AI-powered document search
- Web search integration
- Streaming AI responses
- Modern full-stack application architecture

---

## ⭐ Support

If you find EvidenceAI useful, consider giving the repository a ⭐ on GitHub.

Contributions, suggestions, and feedback are welcome.