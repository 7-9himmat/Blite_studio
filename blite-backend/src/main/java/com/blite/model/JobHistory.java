package com.blite.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blite_jobs")
@Getter
@Setter
public class JobHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    private JobStatus status;
    private String sourceType; // CSV, DB
    private String sinkType;   // POSTGRES, JSON

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private int rowsProcessed;

    // Link to Workspace (Optional but recommended)
    private UUID workspaceId;
}