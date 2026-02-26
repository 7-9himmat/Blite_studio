package com.blite.transform.impl;

import com.blite.transform.Transformation;
import com.blite.model.Record;
import java.util.Map;

public class UpperCaseTransformation implements Transformation {
    private String targetField;

    @Override
    public void init(Map<String, String> config) {
        // The user tells us which field to modify
        this.targetField = config.get("field");
        if (this.targetField == null) {
            throw new IllegalArgumentException("UpperCaseTransformation requires a 'field' config");
        }
    }

    @Override
    public Record apply(Record record) {
        Object value = record.get(targetField);
        if (value instanceof String) {
            record.put(targetField, ((String) value).toUpperCase());
        }
        return record;
    }
}