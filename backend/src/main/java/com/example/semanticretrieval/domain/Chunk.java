package com.example.semanticretrieval.domain;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
@Data
public class Chunk {
    @Id
    @GeneratedValue
    private Long id;

    private String content;
    private int index;
    // We can store embedding ID here or just rely on text content matching
    private String embeddingId; 
}
