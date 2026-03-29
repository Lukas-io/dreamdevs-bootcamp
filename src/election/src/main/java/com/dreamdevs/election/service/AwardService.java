package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.AwardStatus;
import com.dreamdevs.election.repository.AwardRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
public class AwardService {

    private final AwardRepository awardRepository;

    public AwardService(AwardRepository awardRepository) {
        this.awardRepository = awardRepository;
    }

    public Award createAward(String title, List<String> nominees, boolean anonymous) {
        if (title == null || title.isBlank()) {
            throw new ElectionException("Award title cannot be empty.");
        }
        if (nominees == null || nominees.isEmpty()) {
            throw new ElectionException("An award must have at least one nominee.");
        }
        for (String nominee : nominees) {
            if (nominee == null || nominee.isBlank()) {
                throw new ElectionException("Nominee names cannot be blank.");
            }
        }
        if (new HashSet<>(nominees).size() < nominees.size()) {
            throw new ElectionException("Nominee list contains duplicates.");
        }
        Award award = new Award(title, nominees, anonymous);
        return awardRepository.save(award);
    }

    public Award getAward(String id) {
        return awardRepository.findById(id)
                .orElseThrow(() -> new ElectionException("Award not found: " + id));
    }

    public List<Award> listAwards() {
        return awardRepository.findAll();
    }

    public void openAward(String id) {
        Award award = getAward(id);
        if (award.getStatus() != AwardStatus.PENDING) {
            throw new ElectionException("Only a PENDING award can be opened. Current status: " + award.getStatus());
        }
        award.setStatus(AwardStatus.OPEN);
        awardRepository.save(award);
    }

    public void closeAward(String id) {
        Award award = getAward(id);
        if (award.getStatus() != AwardStatus.OPEN) {
            throw new ElectionException("Only an OPEN award can be closed. Current status: " + award.getStatus());
        }
        award.setStatus(AwardStatus.CLOSED);
        awardRepository.save(award);
    }

    public void revealAward(String id) {
        Award award = getAward(id);
        if (award.getStatus() != AwardStatus.CLOSED) {
            throw new ElectionException("Results can only be revealed after the award is CLOSED.");
        }
        award.setRevealed(true);
        awardRepository.save(award);
    }

    public void deleteAward(String id) {
        Award award = getAward(id);
        if (award.getStatus() != AwardStatus.PENDING) {
            throw new ElectionException("Only a PENDING award can be deleted. Current status: " + award.getStatus());
        }
        awardRepository.deleteById(id);
    }
}
