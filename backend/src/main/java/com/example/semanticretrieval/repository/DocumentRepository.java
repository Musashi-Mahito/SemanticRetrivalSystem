package com.example.semanticretrieval.repository;

import com.example.semanticretrieval.domain.Document;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends Neo4jRepository<Document, Long> {
    Optional<Document> findByTitle(String title);
}
