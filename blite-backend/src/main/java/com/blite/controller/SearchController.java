package com.blite.controller;

import com.blite.model.search.GlobalSearchDocument;
import com.blite.service.SearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public List<GlobalSearchDocument> search(
            @RequestParam String q,
            @RequestParam UUID workspaceId
    ) {
        return searchService.search(q, workspaceId);
    }
}