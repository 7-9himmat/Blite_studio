package com.blite.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.blite.repository")
@EnableElasticsearchRepositories(basePackages = "com.blite.repository")
public class DataConfig {
    // This class stays empty, it just acts as a map for Spring
}