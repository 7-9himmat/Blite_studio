package com.blite.service;

import com.blite.model.ConnectionConfig;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class QueryService {

    // Removed the global JdbcTemplate injection
    // because we create a new one for each request now.

    public List<Map<String, Object>> executeQuery(String sql, ConnectionConfig dbConfig) {

        // 1. Create a Dynamic DataSource based on the selected connection
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver"); // Assume Postgres for now
        dataSource.setUrl(dbConfig.getUrl());
        dataSource.setUsername(dbConfig.getUsername());
        dataSource.setPassword(dbConfig.getPassword());

        // 2. Create a temporary JdbcTemplate
        JdbcTemplate tempJdbc = new JdbcTemplate(dataSource);

        // 3. Clean and Execute SQL
        String cleanedSql = sql.trim();
        if (cleanedSql.endsWith(";")) {
            cleanedSql = cleanedSql.substring(0, cleanedSql.length() - 1);
        }

        return tempJdbc.queryForList(cleanedSql);
    }
}