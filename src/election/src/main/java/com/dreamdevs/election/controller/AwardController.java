package com.dreamdevs.election.controller;

import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.service.AwardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/awards")
public class AwardController {

    private final AwardService awardService;

    public AwardController(AwardService awardService) {
        this.awardService = awardService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Award createAward(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        @SuppressWarnings("unchecked")
        List<String> nominees = (List<String>) body.get("nominees");
        boolean anonymous = body.containsKey("anonymous") && (Boolean) body.get("anonymous");
        return awardService.createAward(title, nominees, anonymous);
    }

    @GetMapping
    public List<Award> listAwards() {
        return awardService.listAwards();
    }

    @GetMapping("/{id}")
    public Award getAward(@PathVariable String id) {
        return awardService.getAward(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAward(@PathVariable String id) {
        awardService.deleteAward(id);
    }

    @PatchMapping("/{id}/open")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void openAward(@PathVariable String id) {
        awardService.openAward(id);
    }

    @PatchMapping("/{id}/close")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void closeAward(@PathVariable String id) {
        awardService.closeAward(id);
    }

    @PatchMapping("/{id}/reveal")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revealAward(@PathVariable String id) {
        awardService.revealAward(id);
    }
}
