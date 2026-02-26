package com.blite.controller;

import com.blite.dto.JobRequest;
import com.blite.dto.RuleConfig;
import com.blite.model.Record;
import com.blite.service.EtlPipelineService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EtlController {

    private final EtlPipelineService etlService;

    public EtlController(EtlPipelineService etlService) {
        this.etlService = etlService;
    }

    @PostMapping(value = "/preview", consumes = { "multipart/form-data" })
    public List<Map<String, Object>> uploadAndPreview(
            @RequestPart("file") MultipartFile file,
            @RequestPart("config") List<RuleConfig> rules
    ) throws IOException {

        Path tempFile = Files.createTempFile("etl_", ".csv");
        Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);

        // Pass the rules to the service
        List<Record> records = etlService.previewData(tempFile.toString(), rules, 5);

        return records.stream().map(Record::getData).toList();
    }

    @PostMapping(value = "/download", consumes = { "multipart/form-data" })
    public ResponseEntity<Resource> downloadProcessedFile(
            @RequestPart("file") MultipartFile file,
            @RequestPart("config") List<RuleConfig> rules
    ) throws Exception {

        // 1. Save input file
        Path tempInput = Files.createTempFile("etl_in_", ".csv");
        Files.copy(file.getInputStream(), tempInput, StandardCopyOption.REPLACE_EXISTING);

        // 2. Process full file
        Path outputJson = etlService.processFullFile(tempInput.toString(), rules);

        // 3. Prepare Download Response
        Resource resource = new UrlResource(outputJson.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"transformed_data.json\"")
                .body(resource);
    }

    @PostMapping(value = "/execute", consumes = { "multipart/form-data" })
    public Map<String, String> executeGenericJob(
            @RequestPart("file") MultipartFile file,
            @RequestPart("jobConfig") String jobConfigJson // <-- Frontend sends full config as JSON string
    ) throws IOException {

        // 1. Save File to Temp
        Path tempInput = Files.createTempFile("etl_source_", ".csv");
        Files.copy(file.getInputStream(), tempInput, StandardCopyOption.REPLACE_EXISTING);

        // 2. Parse the JSON Config
        ObjectMapper mapper = new ObjectMapper();
        JobRequest job = mapper.readValue(jobConfigJson, JobRequest.class);

        // 3. INJECT the dynamic file path into the Source Config
        // This bridges the gap between "Web Upload" and "Generic File Reader"
        if (job.getSourceConfig() == null) {
            job.setSourceConfig(new HashMap<>());
        }
        job.getSourceConfig().put("filePath", tempInput.toString());

        // 4. Run the Generic Job
        etlService.executeJob(job);

        return Map.of("status", "success", "message", "Job executed successfully");
    }
}