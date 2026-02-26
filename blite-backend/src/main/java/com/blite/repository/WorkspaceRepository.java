package com.blite.repository;

import com.blite.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {
}