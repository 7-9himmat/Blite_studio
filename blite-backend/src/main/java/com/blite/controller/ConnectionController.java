package com.blite.controller;

import com.blite.model.ConnectionConfig;
import com.blite.service.ConnectionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:5173")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping
    public List<ConnectionConfig> list(@RequestParam(required = false) UUID workspaceId) {
        return connectionService.getConnections(workspaceId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        connectionService.deleteConnection(id);
    }
    @PostMapping
    public void create(@RequestBody ConnectionConfig config) {
        connectionService.saveConnection(config);
    }
}