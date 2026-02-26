package com.blite.transform;

import com.blite.model.Record;
import java.util.Map;

public interface Transformation {
    /**
     * Configure the transformation (e.g., which column to uppercase).
     */
    void init(Map<String, String> config);

    /**
     * Apply the logic.
     * @return The modified Record, or null if the record should be dropped (filtered out).
     */
    Record apply(Record record);
}