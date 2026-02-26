package com.blite.controller;

import com.blite.model.ConnectionConfig;
import com.blite.service.QueryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class QueryController {

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    // DTO class to handle the incoming JSON structure
    static class QueryRequest {
        public String sql;
        public ConnectionConfig dbConfig;
    }

    @PostMapping("/query")
    public List<Map<String, Object>> runQuery(@RequestBody QueryRequest request) {
        // Pass both the SQL and the connection details to the service
        return queryService.executeQuery(request.sql, request.dbConfig);
    }
}