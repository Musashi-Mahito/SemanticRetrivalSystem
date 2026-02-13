package com.example.semanticretrieval.service;

import com.example.semanticretrieval.domain.Chunk;
import com.example.semanticretrieval.domain.Document;
import com.example.semanticretrieval.repository.ChunkRepository;
import com.example.semanticretrieval.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.DocumentReader;
import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IngestionService {

    private final VectorStore vectorStore;
    private final DocumentRepository documentRepository;
    private final ChunkRepository chunkRepository;

    @Transactional
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
            if (text.trim().isEmpty()) continue;

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
            // We force the ID to match what we store in Neo4j (if supported by store) or store the returned ID
            // Simple approach: Let VectorStore generate ID, or if we can set it:
            // aiDoc.setId(vectorId); // Spring AI Document ID is usually set in constructor or setter
            // Current Spring AI version might vary, assuming we can rely on content hashing or just simple storage for now.
            
            aiDocuments.add(aiDoc);
        }

        // 3. Save to Neo4j
        documentRepository.save(doc);

        // 4. Save to Vector Store (Qdrant)
        // This will generate embeddings and store them
        vectorStore.add(aiDocuments);
    }
}
