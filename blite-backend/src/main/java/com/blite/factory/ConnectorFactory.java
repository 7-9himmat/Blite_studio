package com.blite.factory;

import com.blite.connector.SinkConnector;
import com.blite.connector.SourceConnector;
import com.blite.connector.impl.CsvSourceConnector;
import com.blite.connector.impl.JsonFileSinkConnector;
import com.blite.connector.impl.PostgresSinkConnector;
import org.springframework.stereotype.Component;

@Component
public class ConnectorFactory {

    // --- SOURCE FACTORY ---
    public SourceConnector createSource(String type) {
        if (type == null) throw new IllegalArgumentException("Source type cannot be null");

        switch (type.toUpperCase()) {
            case "CSV":
                return new CsvSourceConnector();
            // Future: case "MYSQL": return new MySqlSourceConnector();
            default:
                throw new UnsupportedOperationException("Unsupported Source Type: " + type);
        }
    }

    // --- SINK FACTORY ---
    public SinkConnector createSink(String type) {
        if (type == null) throw new IllegalArgumentException("Sink type cannot be null");

        switch (type.toUpperCase()) {
            case "JSON":
                return new JsonFileSinkConnector();
            case "POSTGRES":
                return new PostgresSinkConnector();
            // Future: case "S3": return new S3SinkConnector();
            default:
                throw new UnsupportedOperationException("Unsupported Sink Type: " + type);
        }
    }
}