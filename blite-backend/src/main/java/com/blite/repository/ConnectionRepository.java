package com.blite.repository;

import com.blite.model.ConnectionConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ConnectionRepository extends JpaRepository<ConnectionConfig, UUID> {

    // Custom query to find connections by Specific Workspace OR Shared (null)
    @Query("SELECT c FROM ConnectionConfig c WHERE c.workspace.id = :workspaceId OR c.workspace IS NULL")
    List<ConnectionConfig> findByWorkspaceIdOrShared(@Param("workspaceId") UUID workspaceId);
}