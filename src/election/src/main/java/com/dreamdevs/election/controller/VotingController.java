package com.dreamdevs.election.controller;

import com.dreamdevs.election.exception.ElectionException;
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
        String voterId = body.get("voterId");
        String awardId = body.get("awardId");
        String nomineeName = body.get("nomineeName");

        if (voterId == null || voterId.isBlank()) throw new ElectionException("voterId is required.");
        if (awardId == null || awardId.isBlank()) throw new ElectionException("awardId is required.");
        if (nomineeName == null || nomineeName.isBlank()) throw new ElectionException("nomineeName is required.");

        return votingService.castVote(voterId, awardId, nomineeName);
    }
}
