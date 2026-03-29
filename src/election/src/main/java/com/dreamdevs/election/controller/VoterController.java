package com.dreamdevs.election.controller;

import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.service.VoterService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/voters")
public class VoterController {

    private final VoterService voterService;

    public VoterController(VoterService voterService) {
        this.voterService = voterService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Voter registerVoter(@RequestBody Map<String, String> body) {
        return voterService.registerVoter(body.get("name"), body.get("studentId"));
    }

    @GetMapping
    public List<Voter> listVoters() {
        return voterService.listVoters();
    }

    @GetMapping("/{id}")
    public Voter getVoter(@PathVariable String id) {
        return voterService.getVoter(id);
    }

    @PatchMapping("/{id}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateVoter(@PathVariable String id) {
        voterService.deactivateVoter(id);
    }
}
