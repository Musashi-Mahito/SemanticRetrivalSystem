package com.example.semanticretrieval.controller;

import com.example.semanticretrieval.service.IngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/ingest")
@RequiredArgsConstructor
public class IngestionController {

    private final IngestionService ingestionService;

    @PostMapping
    public ResponseEntity<String> ingest(@RequestBody Map<String, String> payload) {
        String title = payload.get("title");
        String content = payload.get("content");
        
        if (title == null || content == null) {
            return ResponseEntity.badRequest().body("Title and content are required");
        }

        ingestionService.ingestDocument(title, content);
        return ResponseEntity.ok("Document ingested successfully");
    }
}
