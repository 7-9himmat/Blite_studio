package com.blite.repository;

import com.blite.model.SavedQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SavedQueryRepository extends JpaRepository<SavedQuery, UUID> {
    List<SavedQuery> findByWorkspaceIdOrderByUpdatedAtDesc(UUID workspaceId);
}