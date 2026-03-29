package com.dreamdevs.election.controller;

import com.dreamdevs.election.service.ResultsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/results")
public class ResultsController {

    private final ResultsService resultsService;

    public ResultsController(ResultsService resultsService) {
        this.resultsService = resultsService;
    }

    @GetMapping("/{awardId}")
    public Map<String, Object> getResults(@PathVariable String awardId) {
        return resultsService.getResults(awardId);
    }

    @GetMapping("/{awardId}/winner")
    public Map<String, Object> declareWinner(@PathVariable String awardId) {
        return resultsService.declareWinner(awardId);
    }

    @GetMapping("/{awardId}/stats")
    public Map<String, Double> getStats(@PathVariable String awardId) {
        return resultsService.getStats(awardId);
    }

    @GetMapping("/mvp")
    public Map<String, String> getClassMvp() {
        return Map.of("mvp", resultsService.getClassMvp());
    }

    @GetMapping("/sweep")
    public Map<String, List<String>> getSweep() {
        return resultsService.getSweep();
    }

    @GetMapping("/most-nominated")
    public Map<String, String> getMostNominated() {
        return Map.of("mostNominated", resultsService.getMostNominated());
    }

    @GetMapping("/underdogs")
    public Map<String, List<String>> getUnderdogs() {
        return resultsService.getUnderdogs();
    }

    @GetMapping("/summary")
    public Map<String, String> getSummary() {
        return Map.of("summary", resultsService.getSummary());
    }
}
