package com.blite.repository;

import com.blite.model.search.GlobalSearchDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import java.util.List;

public interface SearchRepository extends ElasticsearchRepository<GlobalSearchDocument, String> {

    List<GlobalSearchDocument> findByWorkspaceIdAndTitleContainingOrWorkspaceIdAndDescriptionContaining(
            String wsId1, String title,
            String wsId2, String desc
    );
}