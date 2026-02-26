package com.blite.controller;

import com.blite.model.JobHistory;
import com.blite.service.EtlPipelineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final EtlPipelineService etlService;

    public JobController(EtlPipelineService etlService) {
        this.etlService = etlService;
    }

    @GetMapping
    public List<JobHistory> getHistory(@RequestParam(required = false) UUID workspaceId) {
        return etlService.getJobHistory(workspaceId);
    }
}