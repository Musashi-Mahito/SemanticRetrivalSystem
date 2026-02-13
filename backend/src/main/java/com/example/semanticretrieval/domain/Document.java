package com.example.semanticretrieval.domain;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Node
@Data
public class Document {
    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private String content;

    @Relationship(type = "HAS_CHUNK", direction = Relationship.Direction.OUTGOING)
    private List<Chunk> chunks = new ArrayList<>();
}
