package com.blite.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "blite_connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String type; // POSTGRES, MYSQL
    private String url;
    private String username;
    private String password;

    // Relationship: Many Connections belong to One Workspace
    // 'optional = true' allows shared connections (workspace_id = null)
    @ManyToOne(optional = true)
    @JoinColumn(name = "workspace_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Prevent infinite recursion in JSON
    private Workspace workspace;
}