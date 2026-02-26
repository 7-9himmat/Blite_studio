package com.blite.controller;

import com.blite.model.SavedQuery;
import com.blite.repository.SavedQueryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin(origins = "http://localhost:5173")
public class SavedQueryController {

    private final SavedQueryRepository repository;

    public SavedQueryController(SavedQueryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SavedQuery> list(@RequestParam UUID workspaceId) {
        return repository.findByWorkspaceIdOrderByUpdatedAtDesc(workspaceId);
    }

    @PostMapping
    public SavedQuery save(@RequestBody SavedQuery query) {
        return repository.save(query);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        repository.deleteById(id);
    }
}