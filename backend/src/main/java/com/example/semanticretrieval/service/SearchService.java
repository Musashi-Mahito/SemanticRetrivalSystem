package com.example.semanticretrieval.service;

import com.example.semanticretrieval.domain.Document;
import com.example.semanticretrieval.repository.DocumentRepository;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final VectorStore vectorStore;
    private final DocumentRepository documentRepository;

    public SearchService(VectorStore vectorStore, DocumentRepository documentRepository) {
        this.vectorStore = vectorStore;
        this.documentRepository = documentRepository;
    }

    public List<String> search(String query) {
        // 1. Vector Search
        // Find similar chunks in Qdrant
        List<org.springframework.ai.document.Document> similarDocuments = vectorStore
                .similaritySearch(SearchRequest.query(query).withTopK(5));

        // 2. Extract content and enrich from Neo4j (Hybrid Search)
        return similarDocuments.stream()
                .map(doc -> {
                    String content = doc.getContent();
                    String embeddingId = (String) doc.getMetadata().get("embedding_id");

                    if (embeddingId != null) {
                        Optional<Document> parentDocOpt = documentRepository.findByChunkEmbeddingId(embeddingId);
                        if (parentDocOpt.isPresent()) {
                            Document parentDoc = parentDocOpt.get();
                            return "From Document [" + parentDoc.getTitle() + "]: " + content;
                        }
                    }

                    // Fallback to vector metadata if not found in graph
                    String docTitle = (String) doc.getMetadata().get("doc_title");
                    if (docTitle != null) {
                        return "From [" + docTitle + "] (Vector fallback): " + content;
                    }
                    return content;
                })
                .collect(Collectors.toList());
    }
}
