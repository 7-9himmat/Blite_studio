package com.blite.connector.impl;

import com.blite.connector.SinkConnector;
import com.blite.model.Record;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

public class JsonFileSinkConnector implements SinkConnector {
    private static final Logger logger = LoggerFactory.getLogger(JsonFileSinkConnector.class);

    private BufferedWriter writer;
    private ObjectMapper objectMapper;
    private boolean isFirstRecord = true; // New flag to track the first item

    @Override
    public void init(Map<String, String> config) {
        String outputPath = config.get("outputPath");
        this.objectMapper = new ObjectMapper();

        try {
            logger.info("Initializing JSON Sink: {}", outputPath);
            this.writer = new BufferedWriter(new FileWriter(outputPath));

            // Start the JSON array
            writer.write("[\n");
        } catch (IOException e) {
            throw new RuntimeException("Failed to open output file", e);
        }
    }

    @Override
    public void write(Record record) {
        try {
            // Logic: If it's NOT the first record, add a comma before writing the new one.
            if (!isFirstRecord) {
                writer.write(",\n");
            }

            String json = objectMapper.writeValueAsString(record.getData());
            writer.write("  " + json);

            // Once we write the first one, the flag is forever false
            isFirstRecord = false;
        } catch (IOException e) {
            logger.error("Failed to write record", e);
        }
    }

    @Override
    public void close() {
        try {
            if (writer != null) {
                // Just close the array cleanly
                writer.write("\n]");
                writer.close();
            }
        } catch (IOException e) {
            logger.error("Failed to close writer", e);
        }
    }
}