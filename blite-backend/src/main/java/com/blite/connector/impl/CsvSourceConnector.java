package com.blite.connector.impl;

import com.blite.connector.SourceConnector;
import com.blite.model.Record;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Iterator;
import java.util.Map;

public class CsvSourceConnector implements SourceConnector {

    private static final Logger logger = LoggerFactory.getLogger(CsvSourceConnector.class);
    private BufferedReader reader;
    private String[] headers;
    private String delimiter;

    @Override
    public void init(Map<String, String> config) {
        String filePath = config.get("filePath");
        this.delimiter = config.getOrDefault("delimiter", ",");

        try {
            logger.info("Opening CSV file: {}", filePath);
            this.reader = new BufferedReader(new FileReader(filePath));

            // Read the first line as header
            String headerLine = reader.readLine();
            if (headerLine != null) {
                this.headers = headerLine.split(delimiter);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize CSV Connector", e);
        }
    }

    @Override
    public Iterator<Record> read() {
        return new Iterator<>() {
            private String nextLine = null;

            private void loadNext() {
                try {
                    if (nextLine == null) nextLine = reader.readLine();
                } catch (Exception e) {
                    // ignore for now
                }
            }

            @Override
            public boolean hasNext() {
                loadNext();
                return nextLine != null;
            }

            @Override
            public Record next() {
                loadNext();
                if (nextLine == null) return null;

                String[] values = nextLine.split(delimiter);
                Record record = new Record();

                // Safer mapping logic
                for (int i = 0; i < headers.length; i++) {
                    if (i < values.length) {
                        record.put(headers[i].trim(), values[i].trim());
                    }
                }

                nextLine = null;
                return record;
            }
        };
    }

    @Override
    public void close() {
        try { if (reader != null) reader.close(); } catch (Exception ignored) {}
    }
}