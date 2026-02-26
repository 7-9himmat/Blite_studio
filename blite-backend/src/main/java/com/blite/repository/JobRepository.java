package com.blite.repository;

import com.blite.model.JobHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JobRepository extends JpaRepository<JobHistory, UUID> {
    // Fetch jobs for a specific workspace, newest first
    List<JobHistory> findByWorkspaceIdOrderByStartTimeDesc(UUID workspaceId);
}