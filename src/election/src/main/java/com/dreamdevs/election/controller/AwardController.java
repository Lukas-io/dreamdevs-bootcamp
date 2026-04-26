package com.dreamdevs.election.controller;

import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.Nominee;
import com.dreamdevs.election.service.AwardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        boolean anonymous = body.containsKey("anonymous") && Boolean.TRUE.equals(body.get("anonymous"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> nomineeRaw = (List<Map<String, Object>>) body.get("nominees");
        List<Nominee> nominees = nomineeRaw == null ? List.of() : nomineeRaw.stream()
                .map(m -> new Nominee((String) m.get("name"), (String) m.get("imageUrl")))
                .collect(Collectors.toList());

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
