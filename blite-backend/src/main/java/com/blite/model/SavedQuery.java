package com.blite.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "blite_saved_queries")
@Getter
@Setter
public class SavedQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String sqlText;

    private String description;

    // Link to Workspace (Notebooks belong to a workspace)
    @Column(nullable = false)
    private UUID workspaceId;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}