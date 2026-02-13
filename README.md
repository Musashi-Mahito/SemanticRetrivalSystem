# Semantic Retrieval System

A hybrid search application using Spring Boot, Neo4j, Qdrant, and Next.js.

## Prerequisites
- Java 17+
- Node.js 18+
- Docker & Docker Compose

## Getting Started

### 1. Database Setup
Ensure Docker is running, then start the databases:
```bash
docker-compose up -d
```

### 2. Backend
Navigate to `backend` folder.
If you have Maven installed:
```bash
mvn spring-boot:run
```
Or use your IDE to run `SemanticRetrievalSystemApplication.java`.

### 3. Frontend
Navigate to `frontend` folder:
```bash
cd frontend
npm run dev
```

## Architecture
- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: Spring Boot 3.2, Spring AI
- **Databases**: Neo4j (Graph), Qdrant (Vector)
