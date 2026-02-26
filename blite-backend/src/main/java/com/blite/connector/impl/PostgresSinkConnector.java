package com.blite.connector.impl;

import com.blite.connector.SinkConnector;
import com.blite.model.Record;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class PostgresSinkConnector implements SinkConnector {
    private static final Logger logger = LoggerFactory.getLogger(PostgresSinkConnector.class);

    private JdbcTemplate jdbcTemplate;
    private String tableName;
    private boolean tableInitialized = false;

    @Override
    public void init(Map<String, String> config) {
        this.tableName = config.get("tableName");

        // Setup manual connection (In a real app, you might inject the global DataSource)
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(config.get("url"));
        dataSource.setUsername(config.get("user"));
        dataSource.setPassword(config.get("password"));

        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public void write(Record record) {
        Map<String, Object> data = record.getData();
        if (data.isEmpty()) return;

        // 1. Create Table on first record (Lazy Initialization)
        if (!tableInitialized) {
            createTable(data.keySet());
            tableInitialized = true;
        }

        // 2. Insert Record
        insertRecord(data);
    }

    private void createTable(Set<String> headers) {
        // DROP TABLE IF EXISTS users_upload; (Optional: dangerous in production, useful for dev)
        jdbcTemplate.execute("DROP TABLE IF EXISTS " + tableName);

        // Build SQL: CREATE TABLE my_table ( col1 TEXT, col2 TEXT, ... )
        // Note: For simplicity, we treat everything as TEXT.
        // Real ETL tools inspect the value type (Integer vs String).
        String columns = headers.stream()
                .map(h -> h + " TEXT")
                .collect(Collectors.joining(", "));

        String sql = "CREATE TABLE " + tableName + " ( " + columns + " )";
        logger.info("Creating table: {}", sql);
        jdbcTemplate.execute(sql);
    }

    private void insertRecord(Map<String, Object> data) {
        String columns = String.join(", ", data.keySet());
        String placeholders = data.keySet().stream().map(k -> "?").collect(Collectors.joining(", "));

        String sql = "INSERT INTO " + tableName + " (" + columns + ") VALUES (" + placeholders + ")";

        // Convert map values to Object[] for JdbcTemplate
        Object[] values = data.values().toArray();

        jdbcTemplate.update(sql, values);
    }

    @Override
    public void close() {
        logger.info("Finished writing to Database Table: {}", tableName);
    }
}