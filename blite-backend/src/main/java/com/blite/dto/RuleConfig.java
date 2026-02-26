package com.blite.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RuleConfig {
    private String type;  // "UPPERCASE" or "FILTER"
    private String field;
    private String value; // Optional (used for Filter)
}