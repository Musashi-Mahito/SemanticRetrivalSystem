package com.example.semanticretrieval.service;

import com.example.semanticretrieval.domain.Document;
import com.example.semanticretrieval.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final VectorStore vectorStore;
    private final DocumentRepository documentRepository;

    public List<String> search(String query) {
        // 1. Vector Search
        // Find similar chunks in Qdrant
        List<org.springframework.ai.document.Document> similarDocuments = vectorStore
                .similaritySearch(SearchRequest.query(query).withTopK(5));

        // 2. Extract content from vector results
        List<String> results = similarDocuments.stream()
                .map(doc -> {
                    String content = doc.getContent();
                    // We could also enrich this with data from Neo4j using metadata
                    // String docTitle = (String) doc.getMetadata().get("doc_title");
                    // return "From [" + docTitle + "]: " + content;
                    return content;
                })
                .collect(Collectors.toList());

        // 3. (Optional) Graph Search - Expand results or find related concepts
        // For this simple implementation, we are just returning the vector hits.
        // A true hybrid approach might look up the Document node in Neo4j and return
        // siblings.

        return results;
    }
}
