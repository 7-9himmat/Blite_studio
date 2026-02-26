package com.blite.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class JobRequest {
    // Source Details
    private String sourceType; // e.g., "CSV"
    private Map<String, String> sourceConfig; // e.g., { "filePath": "..." }

    // Transformation Details
    private List<RuleConfig> rules;

    // Sink Details
    private String sinkType;   // e.g., "POSTGRES" or "JSON"
    private Map<String, String> sinkConfig;   // e.g., { "tableName": "users", "url": "..." }
    private UUID workspaceId;
}