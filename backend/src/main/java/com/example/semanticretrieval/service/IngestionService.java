package com.example.semanticretrieval.service;

import com.example.semanticretrieval.domain.Chunk;
import com.example.semanticretrieval.domain.Document;
import com.example.semanticretrieval.repository.DocumentRepository;
import org.springframework.ai.document.DocumentReader;
// import org.springframework.ai.embedding.EmbeddingModel; // Unused
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class IngestionService {

    private final VectorStore vectorStore;
    private final DocumentRepository documentRepository;
    // private final ChunkRepository chunkRepository; // Unused

    public IngestionService(VectorStore vectorStore, DocumentRepository documentRepository) {
        this.vectorStore = vectorStore;
        this.documentRepository = documentRepository;
    }

    @Transactional("transactionManager")
    public void ingestDocument(String title, String content) {
        // 1. Save Document Node to Neo4j
        Document doc = new Document();
        doc.setTitle(title);
        doc.setContent(content);

        // 2. Chunking (Simple split by newline or length for now)
        // In a real app, use a proper TokenSplitter
        String[] textChunks = content.split("\n\n");

        List<org.springframework.ai.document.Document> aiDocuments = new ArrayList<>();

        for (int i = 0; i < textChunks.length; i++) {
            String text = textChunks[i];
            if (text.trim().isEmpty())
                continue;

            // Neo4j Chunk
            Chunk chunk = new Chunk();
            chunk.setContent(text);
            chunk.setIndex(i);

            // Assign a unique ID for Vector Store correlation
            String vectorId = UUID.randomUUID().toString();
            chunk.setEmbeddingId(vectorId);

            doc.getChunks().add(chunk);

            // Prepare for Vector Store
            org.springframework.ai.document.Document aiDoc = new org.springframework.ai.document.Document(text);
            aiDoc.getMetadata().put("doc_title", title);
            aiDoc.getMetadata().put("chunk_index", i);
            aiDoc.getMetadata().put("embedding_id", vectorId);

            aiDocuments.add(aiDoc);
        }

        // 3. Save to Neo4j
        documentRepository.save(doc);

        // 4. Save to Vector Store (Qdrant)
        // This will generate embeddings and store them
        vectorStore.add(aiDocuments);
    }
}
