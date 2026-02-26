package com.blite.connector;

import com.blite.model.Record;
import java.util.Map;

public interface SinkConnector {
    // Setup (open file, connect to DB)
    void init(Map<String, String> config);

    // Write a single record
    void write(Record record);

    // Clean up (close streams, commit transactions)
    void close();
}