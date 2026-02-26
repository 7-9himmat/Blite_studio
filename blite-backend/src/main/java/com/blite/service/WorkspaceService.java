package com.blite.service;

import com.blite.model.Workspace;
import com.blite.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public Workspace createWorkspace(Workspace ws) {
        // You could add logic here (e.g., check for duplicate names)
        return workspaceRepository.save(ws);
    }

    public Workspace getWorkspaceById(UUID id) {
        return workspaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workspace not found: " + id));
    }

    public void deleteWorkspace(UUID id) {
        // Optional: Check if it has connections before deleting?
        workspaceRepository.deleteById(id);
    }
}