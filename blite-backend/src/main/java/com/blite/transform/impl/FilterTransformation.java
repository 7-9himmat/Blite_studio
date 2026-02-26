package com.blite.transform.impl;

import com.blite.transform.Transformation;
import com.blite.model.Record;
import java.util.Map;

public class FilterTransformation implements Transformation {
    private String field;
    private String valueToKeep;

    @Override
    public void init(Map<String, String> config) {
        this.field = config.get("field");
        this.valueToKeep = config.get("value");
    }

    @Override
    public Record apply(Record record) {
        Object actualValue = record.get(field);

        // If it doesn't match, return NULL (signal to drop)
        if (actualValue == null || !actualValue.toString().equals(valueToKeep)) {
            return null;
        }
        return record;
    }
}