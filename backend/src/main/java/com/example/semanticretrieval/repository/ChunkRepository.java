package com.example.semanticretrieval.repository;

import com.example.semanticretrieval.domain.Chunk;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChunkRepository extends Neo4jRepository<Chunk, Long> {
}
