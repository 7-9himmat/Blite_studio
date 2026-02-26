package com.blite.service;

import com.blite.model.search.GlobalSearchDocument;
import com.blite.model.search.SearchType;
import com.blite.repository.SearchRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class SearchService {

    private final SearchRepository repository;

    public SearchService(SearchRepository repository) {
        this.repository = repository;
    }

    public void indexItem(String entityId, SearchType type, String title, String desc, UUID workspaceId) {
        GlobalSearchDocument doc = new GlobalSearchDocument(entityId, type, title, desc, workspaceId);
        repository.save(doc);
    }

    public void deleteItem(String entityId, SearchType type) {
        repository.deleteById(type.name() + "_" + entityId);
    }

    public List<GlobalSearchDocument> search(String query, UUID workspaceId) {
        String wsId = workspaceId.toString();
        // Simple fuzzy search implementation using the Repo method
        return repository.findByWorkspaceIdAndTitleContainingOrWorkspaceIdAndDescriptionContaining(
                wsId, query, wsId, query
        );
    }
}