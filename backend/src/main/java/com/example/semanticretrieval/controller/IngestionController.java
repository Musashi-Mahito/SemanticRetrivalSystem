package com.example.semanticretrieval.controller;

import com.example.semanticretrieval.service.IngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@RestController
@RequestMapping("/api/ingest")
@CrossOrigin(origins = "http://localhost:3000")
public class IngestionController {

    private final IngestionService ingestionService;

    public IngestionController(IngestionService ingestionService) {
        this.ingestionService = ingestionService;
    }

    @PostMapping
    public ResponseEntity<?> ingest(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String content = payload.get("content");
        
        if (title == null || content == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Title and content are required"));
        }

        try {
            ingestionService.ingestDocument(title, content);
            return ResponseEntity.ok(Map.of("message", "Document ingested successfully"));
        } catch (Exception e) {
            Throwable cause = e;
            while (cause.getCause() != null) {
                cause = cause.getCause();
            }
            return ResponseEntity.status(500).body(Map.of("error", cause.getMessage()));
        }
    }
}
