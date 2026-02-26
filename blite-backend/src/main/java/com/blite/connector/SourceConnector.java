package com.blite.connector;

import com.blite.model.Record;
import java.util.Iterator;
import java.util.Map;

public interface SourceConnector {
    // Setup the connection (open file, connect to DB)
    void init(Map<String, String> config);

    // Stream the data row by row
    Iterator<Record> read();

    // Clean up
    void close();
}