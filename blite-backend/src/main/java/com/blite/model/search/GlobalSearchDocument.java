package com.blite.model.search;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.util.UUID;

@Document(indexName = "blite_global_search")
public class GlobalSearchDocument {

    @Id
    private String id; // Composite ID: "TYPE_UUID" (e.g., "CONN_123...")

    @Field(type = FieldType.Keyword)
    private String entityId; // The actual UUID in Postgres

    @Field(type = FieldType.Keyword)
    private SearchType type;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String title;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String workspaceId;

    public GlobalSearchDocument() {}

    public GlobalSearchDocument(String entityId, SearchType type, String title, String description, UUID workspaceId) {
        this.entityId = entityId;
        this.type = type;
        this.title = title;
        this.description = description;
        this.workspaceId = workspaceId != null ? workspaceId.toString() : null;
        this.id = type + "_" + entityId;
    }
}