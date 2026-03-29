package com.dreamdevs.election.controller;

import com.dreamdevs.election.model.Vote;
import com.dreamdevs.election.service.VotingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/votes")
public class VotingController {

    private final VotingService votingService;

    public VotingController(VotingService votingService) {
        this.votingService = votingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Vote castVote(@RequestBody Map<String, String> body) {
        return votingService.castVote(body.get("voterId"), body.get("awardId"), body.get("nomineeName"));
    }
}
