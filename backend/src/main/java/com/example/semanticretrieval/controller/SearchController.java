package com.example.semanticretrieval.controller;

import com.example.semanticretrieval.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public List<String> search(@RequestParam String query) {
        return searchService.search(query);
    }
}
