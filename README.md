# ChatSensei 📄🤖

**ChatSensei** is a full-stack, Retrieval-Augmented Generation (RAG) platform that lets you chat with your PDF documents. Upload one or more PDFs, ask questions in natural language, and get context-aware answers grounded in your document content — with persistent, multi-session chat history per user.

## ✨ Features

- **Document Q&A with RAG** — Ask questions about your uploaded PDFs and get answers generated from the actual document content, not hallucinated from general knowledge.
- **Multi-document support** — Upload and query across multiple PDFs at once, either from your saved library or a one-off temporary file.
- **Semantic search** — Documents are chunked and embedded with Google's Gemini embedding model, then indexed with **HNSW** for fast approximate nearest-neighbor vector search.
- **Multi-session conversations** — Each user can maintain multiple chat sessions, with full question/answer history persisted and retrievable.
- **User accounts** — Simple username/password registration and login.
- **File management** — Upload, list, and delete your PDF files.

## 🏗️ Tech Stack

**Frontend (`client/`)**
- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS 4

**Backend (`server/`)**
- Node.js + Express 5
- MySQL (via `mysql2`) for users, sessions, messages, and stored PDFs
- [LangChain](https://js.langchain.com/) (`@langchain/community`, `@langchain/core`, `@langchain/classic`) for the RAG pipeline
- `@langchain/google-genai` — Gemini embeddings (`gemini-embedding-001`) and chat model (`gemini-2.5-flash`)
- `hnswlib-node` — in-memory HNSW vector store for semantic retrieval
- `pdf-parse` / LangChain's `PDFLoader` for document parsing
- `multer` for file uploads

## 📁 Project Structure

```
ChatSensei/
├── client/                 # Next.js frontend
│   └── app/
│       ├── page.tsx        # Landing page
│       ├── login/          # Login page
│       ├── register/       # Registration page
│       └── dashboard/      # Main chat / document dashboard
└── server/                 # Express backend
    ├── controllers/        # Route handlers (auth, upload, chat)
    ├── routes/              # Express route definitions
    ├── database.js          # MySQL table definitions
    └── server.js             # App entry point
```

## 🔌 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register/users` | Register a new user |
| `POST` | `/login/users` | Log in a user |
| `POST` | `/upload/files` | Upload a PDF to a user's library |
| `GET` | `/upload/files/:id` | List a user's uploaded files |
| `DELETE` | `/upload/deleteFiles/:id` | Delete an uploaded file |
| `POST` | `/chat/session` | Create a new chat session |
| `POST` | `/chat/ask/:id` | Ask a question (RAG query) against a user's documents |
| `GET` | `/chat/session/:userid` | List a user's chat sessions |
| `GET` | `/chat/messages/:sessionId` | Get message history for a session |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A running MySQL server
- A [Google AI (Gemini) API key](https://ai.google.dev/)

### 1. Clone the repo
```bash
git clone https://github.com/Saniya0804/ChatSensei.git
cd ChatSensei
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/` with:
```env
GOOGLE_API_KEY=your_gemini_api_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
```

> **Note:** the current `server.js` connects to MySQL with hardcoded credentials. Before running the project, update it to read from `process.env` (`DB_HOST`, `DB_USER`, `DB_PASSWORD`) instead of a literal password, so you don't commit secrets to the repo.

Start the backend (runs on `http://localhost:8000`):
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🧠 How the RAG Pipeline Works

1. A user's PDFs (saved + optional temporary upload) are loaded and parsed with `PDFLoader`.
2. Documents are split into ~1000-character chunks (200-character overlap) via `RecursiveCharacterTextSplitter`.
3. Each chunk is embedded using Gemini's `gemini-embedding-001` model.
4. Embeddings are indexed in-memory with **HNSWLib** for fast semantic search.
5. On a question, the top relevant chunks are retrieved and passed to `gemini-2.5-flash` via a `RetrievalQAChain` to generate a grounded answer.
6. The question and answer are saved to `chat_messages`, linked to the active session.

## 🗺️ Roadmap Ideas

- Move the MySQL connection to environment variables
- Persist the vector index instead of rebuilding it on every request
- Add streaming responses for the chat UI
- Add file size/type validation on upload

## 📄 License

No license specified yet — consider adding one (e.g. MIT) if you plan to open this up for contributions.
