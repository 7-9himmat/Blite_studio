package com.blite.controller;

import com.blite.model.Workspace;
import com.blite.service.WorkspaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workspaces")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to call this
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping
    public List<Workspace> list() {
        return workspaceService.getAllWorkspaces();
    }

    @PostMapping
    public Workspace create(@RequestBody Workspace ws) {
        return workspaceService.createWorkspace(ws);
    }

    @GetMapping("/{id}")
    public Workspace get(@PathVariable UUID id) {
        return workspaceService.getWorkspaceById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        workspaceService.deleteWorkspace(id);
    }
}