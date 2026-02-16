# Learning Path: Semantic Retrieval System

To completely understand this project, you need to master a blend of modern Backend engineering, AI concepts, and Frontend development. Here is the recommended learning path, ordered from fundamental concepts to specific implementation details.

## 1. Core Concepts (The "Why" and "What")
Before looking at code, you must understand the problem domain.

### A. Semantic Search vs. Keyword Search
-   **Traditional Search**: How keyword matching (TF-IDF, BM25) works and its limitations.
-   **Semantic Search**: Searching by *meaning* rather than exact words.
-   **Embeddings**: High-dimensional vectors representing text.

### B. Vector Databases
-   **Concept**: How databases store and index vectors.
-   **Similarity Metrics**: Cosine Similarity, Euclidean Distance, Dot Product.
-   **Qdrant**: The specific vector database used in this project.
    -   Collections, Points, Payloads.

### C. Knowledge Graphs
-   **Graph Theory Basics**: Nodes, Relationships, Properties, Labels.
-   **Neo4j**: The leading Graph Database.
    -   Cypher Query Language (CQL).
    -   Property Graph Model.
-   **Why Hybrid?**: Combining the "fuzzy" search of vectors with the "exact" relationships of graphs (RAG - Retrieval Augmented Generation).

---

## 2. Backend Engineering (The "How" - Server)
The heavy lifting happens here.

### A. Java & Spring Boot Core
-   **Java 17 Features**: Records, sealed classes, pattern matching.
-   **Spring Boot 3.x**:
    -   Dependency Injection (IoC).
    -   REST Controllers (`@RestController`, `@PostMapping`).
    -   Service Layer pattern.
    -   Configuration (`application.properties`, `@Value`).

### B. Spring AI
*This is the glue between Java and AI models.*
-   **`EmbeddingClient`**: Interface for generating embeddings (uses OpenAI in this project).
-   **`VectorStore`**: Abstraction for interacting with vector DBs (Qdrant).
-   **`Document` & `DocumentReader`**: Spring AI's data model for text.

### C. Spring Data Neo4j
-   **Object-Graph Mapping (OGM)**: Mapping Java classes (`@Node`, `@Relationship`) to graph nodes.
-   **Repositories**: Extends `Neo4jRepository` for collecting data.
-   **Cypher DSL**: Writing custom graph queries if needed.

### D. Practical Implementation Details (Seen in Code)
-   **Lombok**: Annotations like `@RequiredArgsConstructor`, `@Data` to reduce boilerplate.
-   **Microservice Logic**:
    -   *Ingestion*: Text splitting (Chunking), generating IDs (`UUID`), saving to multiple DBs transactionally (`@Transactional`).
    -   *Search*: Querying Vector Store, mapping results.

---

## 3. Frontend Development (The "How" - Client)
The user interface for searching and ingesting.

### A. Next.js 16 (React Framework)
-   **App Router**: The modern way to build Next.js apps (`app/` directory).
-   **Server Components vs. Client Components**: When to use `'use client'`.
-   **Data Fetching**: Calling the Spring Boot API.

### B. TypeScript
-   **Interfaces/Types**: Defining shapes for `Document`, `SearchResult`.
-   **Strict Typing**: Preventing runtime errors.

### C. Styling & UI
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Lucide React**: Icon library used in the project.

---

## 4. Infrastructure & DevOps
How the pieces run together.

### A. Containerization
-   **Docker**: Container basics.
-   **Docker Compose**: Orchestrating the multi-container environment (Neo4j + Qdrant + App).
    -   Understanding `docker-compose.yml`: Ports, volumes, environment variables.

---

## Recommended Learning Sequence
1.  **Start with Spring Boot basics** if you are strict on Java.
2.  **Dive into Spring AI** documentation to understand the `VectorStore` abstraction.
3.  **Learn Neo4j Basics & Cypher** to understand the `Document` and `Chunk` graph model.
4.  **Review the `IngestionService.java`** in this project to see how 2 & 3 are combined.
5.  **Explore the Next.js Frontend** to see how it consumes the API.
