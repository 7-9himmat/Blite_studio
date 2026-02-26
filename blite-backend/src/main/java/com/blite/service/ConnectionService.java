package com.blite.service;

import com.blite.model.ConnectionConfig;
import com.blite.model.Workspace;
import com.blite.model.search.SearchType;
import com.blite.repository.ConnectionRepository;
import com.blite.repository.SearchRepository;
import com.blite.repository.WorkspaceRepository;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final WorkspaceRepository workspaceRepository;
    private final SearchService searchService;
    private final CacheManager cacheManager;

    public ConnectionService(ConnectionRepository connectionRepository,
                             WorkspaceRepository workspaceRepository, SearchService searchService,
                             CacheManager cacheManager) {
        this.connectionRepository = connectionRepository;
        this.workspaceRepository = workspaceRepository;
        this.searchService = searchService;
        this.cacheManager = cacheManager;
    }

    @Cacheable(value = "connections", key = "#workspaceId")
    public List<ConnectionConfig> getConnections(UUID workspaceId) {
        if (workspaceId == null) {
            return connectionRepository.findAll(); // Or just shared?
        }
        return connectionRepository.findByWorkspaceIdOrShared(workspaceId);
    }

    @CacheEvict(value = "connections", key = "#conn.workspace.id")
    public ConnectionConfig saveConnection(ConnectionConfig conn) {
        // JPA handles Insert vs Update automatically based on whether ID is null
        ConnectionConfig saved = connectionRepository.save(conn);
        try {
            searchService.indexItem(
                    saved.getId().toString(),
                    SearchType.CONNECTION,
                    saved.getName(),
                    saved.getType() + " @ " + saved.getUrl(), // Description
                    saved.getWorkspace() != null ? saved.getWorkspace().getId() : null
            );
        } catch (Exception e) {
            System.err.println("Search Indexing Failed: " + e.getMessage());
            // Don't fail the transaction, just log it
        }

        return saved;
    }

    /**
     * OPTIMIZED DELETE
     * 1. Fetch the connection to find out which Workspace it belongs to.
     * 2. Delete it from the Database.
     * 3. Manually evict ONLY that workspace's cache key.
     */
    public void deleteConnection(UUID id) {
        // 1. Fetch First (The "Extra" DB Read)
        ConnectionConfig conn = connectionRepository.findById(id).orElse(null);

        if (conn != null) {
            // Capture the key before we delete the object
            UUID workspaceId = (conn.getWorkspace() != null) ? conn.getWorkspace().getId() : null;

            // 2. Delete from DB
            connectionRepository.delete(conn);

            // 3. Surgical Eviction
            // We access the 'connections' cache and remove the specific key
            if (cacheManager.getCache("connections") != null) {
                Objects.requireNonNull(cacheManager.getCache("connections")).evict(workspaceId);
            }
        }
    }

    // Helper to fetch full entity (useful for the QueryService)
    public ConnectionConfig getConnectionById(UUID id) {
        return connectionRepository.findById(id).orElseThrow(() -> new RuntimeException("Connection not found"));
    }
}