# Semantic Retrieval System

A high-performance hybrid search application that combines **Vector Search** (semantics) with **Knowledge Graph** (relationships) to provide highly accurate and context-aware search results.

## 🚀 Features

- **Hybrid Search**: Leverages both Vector Embeddings (Qdrant) for semantic understanding and Graph Database (Neo4j) for structured relationships.
- **Document Ingestion**: Parse and index documents into both vector and graph stores simultaneously.
- **Modern UI**: specialized interface built with Next.js 16 and Tailwind CSS for seamless user experience.
- **AI Integration**: Uses Google Gemini embeddings (via Spring AI) to vectorize content.

## 🏗️ Architecture

The system follows a microservices-style architecture with a clear separation between the Next.js frontend and Spring Boot backend.

```mermaid
graph TD
    User([User]) <--> Client[Frontend (Next.js)]
    
    subgraph Backend [Spring Boot Application]
        API[REST Controllers]
        Ingest[Ingestion Service]
        Search[Search Service]
        AI[Spring AI]
    end
    
    subgraph Infrastructure
        Neo4j[(Neo4j Graph DB)]
        Qdrant[(Qdrant Vector DB)]
        Gemini((Google Gemini API))
    end

    Client <-->|HTTP/JSON| API
    
    API --> Ingest
    API --> Search
    
    Ingest -->|Generate Embeddings| AI
    Search -->|Generate Query Embeddings| AI
    
    AI <-->|HTTP| Gemini
    
    Ingest -->|Store Structure| Neo4j
    Ingest -->|Store Vectors| Qdrant
    
    Search -->|Similarity Search| Qdrant
    Search -.->|Relational Lookup (Future)| Neo4j
```

### 🔄 Workflows

#### 1. Data Ingestion Workflow
When a user ingests a document via the `/api/ingest` endpoint:
1.  **Receive**: The backend receives the `title` and `content`.
2.  **Chunk**: The content is split into smaller chunks (e.g., by paragraphs).
3.  **Embed**: `Spring AI` calls the Google Gemini API to generate vector embeddings for each chunk.
4.  **Graph Storage (Neo4j)**:
    -   A `Document` node is created.
    -   `Chunk` nodes are created and linked to the document via `HAS_CHUNK` relationships.
5.  **Vector Storage (Qdrant)**:
    -   Vectors are stored with metadata (content, doc_title, chunk_index).
    -   This enables semantic search capability.

#### 2. Semantic Search Workflow
When a user searches via the `/api/search` endpoint:
1.  **Receive**: The backend receives the natural language `query`.
2.  **Embed**: The query is converted into a vector embedding using Google Gemini.
3.  **Vector Search**: The system queries **Qdrant** for the nearest neighbor chunks (Cosine Similarity).
4.  **Retrieval**: Top-k matching chunks are retrieved.
5.  **Response**: The content of these chunks is returned to the frontend.
    -   *Future enhancement*: The system can use the chunk IDs to look up related nodes in Neo4j for "Hybrid Retrieval".

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.2
- **AI Integration**: Spring AI (1.0.0-M1)
- **Model**: Google Gemini Pro / embedding-004
- **Database (Graph)**: Neo4j (v5.15)
- **Database (Vector)**: Qdrant
- **Build Tool**: Maven
- **Language**: Java 17

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📋 Prerequisites

Ensure you have the following installed:
- **Java 17+**
- **Node.js 18+**
- **Docker & Docker Compose** (for running databases)
- **Google Gemini API Key** (for generating embeddings)

## ⚡ Getting Started

### 1. Database Setup
Start the required databases (Neo4j and Qdrant) using Docker Compose.

```bash
docker-compose up -d
```

Verify containers are running:
- **Neo4j Dashboard**: [http://localhost:7474](http://localhost:7474) (Default login: `neo4j`/`password`)
- **Qdrant Dashboard**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Configure your Google Gemini API Key.
   You can export it as an environment variable:
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   # Windows PowerShell
   $env:GEMINI_API_KEY="your_api_key_here"
   ```
   *Alternatively, update `src/main/resources/application.properties` directly (not recommended for committed code).*

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on **http://localhost:8080**.

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at **http://localhost:3000**.

## 📖 Usage

### Search Interface
Visit `http://localhost:3000` to access the main search page. Enter natural language queries to retrieve results based on semantic meaning.

### Ingest Documents
Visit `http://localhost:3000/ingest` to add new knowledge to the system.
- **Title**: A descriptive title for the document.
- **Content**: The text content to be indexed.

## 🔌 API Reference

### Search
- **Endpoint**: `GET /api/search`
- **Query Param**: `query` (String)
- **Example**:
  ```bash
  curl "http://localhost:8080/api/search?query=artificial%20intelligence"
  ```

### Ingest
- **Endpoint**: `POST /api/ingest`
- **Body**: JSON
  ```json
  {
    "title": "Introduction to AI Agents",
    "content": "AI Agents are autonomous systems that allow..."
  }
  ```

## 📂 Project Structure

```
SemanticRetrivalSystem/
├── backend/                 # Spring Boot Application
│   ├── src/main/java       # Source code
│   └── src/main/resources  # Config (application.properties)
├── frontend/                # Next.js Application
│   ├── src/app             # App Router pages
│   └── public              # Static assets
├── docker-compose.yml       # Database orchestration
└── README.md                # Project Documentation
```
