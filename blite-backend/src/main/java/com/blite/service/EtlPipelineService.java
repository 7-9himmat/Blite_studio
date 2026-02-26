package com.blite.service;

import com.blite.connector.SinkConnector;
import com.blite.connector.SourceConnector;
import com.blite.connector.impl.CsvSourceConnector;
import com.blite.connector.impl.JsonFileSinkConnector;
import com.blite.dto.JobRequest;
import com.blite.dto.RuleConfig;
import com.blite.factory.ConnectorFactory;
import com.blite.model.JobHistory; // <--- Import Entity
import com.blite.model.JobStatus;
import com.blite.model.Record;
import com.blite.repository.JobRepository; // <--- Import Repo
import com.blite.transform.Transformation;
import com.blite.transform.impl.FilterTransformation;
import com.blite.transform.impl.UpperCaseTransformation;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime; // <--- For timestamps
import java.util.*;

@Service
public class EtlPipelineService {

    private final ConnectorFactory connectorFactory;
    private final JobRepository jobRepository; // <--- 1. Add Repository

    // Injection
    public EtlPipelineService(ConnectorFactory connectorFactory, JobRepository jobRepository) {
        this.connectorFactory = connectorFactory;
        this.jobRepository = jobRepository;
    }

    private List<Transformation> buildPipeline(List<RuleConfig> rules) {
        List<Transformation> pipeline = new ArrayList<>();
        if (rules == null) return pipeline; // Safety check

        for (RuleConfig rule : rules) {
            Transformation t = null;
            switch (rule.getType()) {
                case "UPPERCASE":
                    t = new UpperCaseTransformation();
                    t.init(Map.of("field", rule.getField()));
                    break;
                case "FILTER":
                    t = new FilterTransformation();
                    t.init(Map.of("field", rule.getField(), "value", rule.getValue()));
                    break;
            }
            if (t != null) pipeline.add(t);
        }
        return pipeline;
    }

    public List<Record> previewData(String tempFilePath, List<RuleConfig> rules, int limit) {
        List<Record> previewRows = new ArrayList<>();
        SourceConnector source = new CsvSourceConnector();
        source.init(Map.of("filePath", tempFilePath));

        List<Transformation> pipeline = buildPipeline(rules);
        Iterator<Record> stream = source.read();
        int count = 0;

        try {
            while (stream.hasNext() && count < limit) {
                Record row = stream.next();
                Record processedRow = row;
                for (Transformation step : pipeline) {
                    processedRow = step.apply(processedRow);
                    if (processedRow == null) break;
                }
                if (processedRow != null) {
                    previewRows.add(processedRow);
                    count++;
                }
            }
        } finally {
            source.close();
        }
        return previewRows;
    }

    // Used for JSON downloads (Legacy support)
    public Path processFullFile(String tempInputPath, List<RuleConfig> rules) throws Exception {
        Path tempOutputFile = Files.createTempFile("etl_output_", ".json");
        SourceConnector source = new CsvSourceConnector();
        source.init(Map.of("filePath", tempInputPath));
        SinkConnector sink = new JsonFileSinkConnector();
        sink.init(Map.of("outputPath", tempOutputFile.toString()));

        List<Transformation> pipeline = buildPipeline(rules);

        try {
            Iterator<Record> stream = source.read();
            while (stream.hasNext()) {
                Record row = stream.next();
                Record processedRow = row;
                for (Transformation step : pipeline) {
                    processedRow = step.apply(processedRow);
                    if (processedRow == null) break;
                }
                if (processedRow != null) {
                    sink.write(processedRow);
                }
            }
        } finally {
            source.close();
            sink.close();
        }
        return tempOutputFile;
    }

    /**
     * The Master Orchestration Method (Now with Job Tracking!)
     */
    public void executeJob(JobRequest job) {

        // 1. CREATE JOB RECORD (Status: RUNNING)
        JobHistory history = new JobHistory();
        history.setStatus(JobStatus.RUNNING);
        history.setStartTime(LocalDateTime.now());
        history.setSourceType(job.getSourceType());
        history.setSinkType(job.getSinkType());
        history.setWorkspaceId(job.getWorkspaceId());
        // history.setWorkspaceId(...) // If JobRequest has workspaceId, set it here

        history = jobRepository.save(history); // Save to DB to get ID

        SourceConnector source = null;
        SinkConnector sink = null;
        int rowCount = 0;

        try {
            // 2. Factory creates objects
            source = connectorFactory.createSource(job.getSourceType());
            sink = connectorFactory.createSink(job.getSinkType());

            source.init(job.getSourceConfig());
            sink.init(job.getSinkConfig());

            List<Transformation> pipeline = buildPipeline(job.getRules());

            // 3. Execution Loop
            Iterator<Record> stream = source.read();
            while (stream.hasNext()) {
                Record row = stream.next();
                Record processedRow = row;

                for (Transformation step : pipeline) {
                    processedRow = step.apply(processedRow);
                    if (processedRow == null) break;
                }

                if (processedRow != null) {
                    sink.write(processedRow);
                    rowCount++; // Count successful rows
                }
            }

            // 4. UPDATE JOB RECORD (Status: SUCCESS)
            history.setStatus(JobStatus.SUCCESS);
            history.setRowsProcessed(rowCount);

        } catch (Exception e) {
            // 5. HANDLE FAILURE (Status: FAILED)
            history.setStatus(JobStatus.FAILED);
            history.setErrorMessage(e.getMessage());
            e.printStackTrace(); // Log to console
            throw new RuntimeException("Job Failed: " + e.getMessage(), e);

        } finally {
            // 6. CLEANUP & FINAL SAVE
            if (source != null) source.close();
            if (sink != null) sink.close();

            history.setEndTime(LocalDateTime.now());
            jobRepository.save(history); // Update final state in DB
        }
    }

    public List<JobHistory> getJobHistory(UUID workspaceId) {
        if (workspaceId == null) {
            // Optional: Return all jobs or empty list if no workspace provided
            return jobRepository.findAll();
        }
        return jobRepository.findByWorkspaceIdOrderByStartTimeDesc(workspaceId);
    }
}