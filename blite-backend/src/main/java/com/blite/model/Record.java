package com.blite.model;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class Record {
    private final Map<String, Object> data = new HashMap<>();

    public void put(String key, Object value) {
        data.put(key, value);
    }

    public Object get(String key) {
        return data.get(key);
    }

    @Override
    public String toString() {
        return data.toString();
    }
}