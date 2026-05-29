package com.example.semanticretrieval.controller;
 
import com.example.semanticretrieval.service.SearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
 
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend
public class SearchController {
 
    private final SearchService searchService;
 
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }
 
    @GetMapping
    public ResponseEntity<?> search(@RequestParam String query) {
        try {
            return ResponseEntity.ok(searchService.search(query));
        } catch (Exception e) {
            Throwable cause = e;
            while (cause.getCause() != null) {
                cause = cause.getCause();
            }
            return ResponseEntity.status(500).body(Map.of("error", cause.getMessage()));
        }
    }
}
