package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.AwardStatus;
import com.dreamdevs.election.model.Nominee;
import com.dreamdevs.election.repository.AwardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AwardServiceTest {

    private AwardService awardService;
    private AwardRepository awardRepository;

    @BeforeEach
    void setUp() {
        awardRepository = new AwardRepository();
        awardService = new AwardService(awardRepository);
    }

    @Test
    void createAward_withValidData_succeeds() {
        Award award = awardService.createAward("Class Clown",
                List.of(Nominee.of("Tunde"), Nominee.of("Amaka"), Nominee.of("Seun")), false);

        assertNotNull(award.getId());
        assertEquals("Class Clown", award.getTitle());
        assertEquals(3, award.getNominees().size());
        assertEquals(AwardStatus.PENDING, award.getStatus());
        assertFalse(award.isRevealed());
    }

    @Test
    void createAward_withEmptyTitle_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                awardService.createAward("", List.of(Nominee.of("Tunde"), Nominee.of("Amaka")), false)
        );
    }

    @Test
    void createAward_withBlankTitle_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                awardService.createAward("   ", List.of(Nominee.of("Tunde"), Nominee.of("Amaka")), false)
        );
    }

    @Test
    void createAward_withEmptyNomineesList_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                awardService.createAward("Most Likely to Travel the World", Collections.emptyList(), false)
        );
    }

    @Test
    void createAward_withNullNominees_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                awardService.createAward("Most Likely to Travel the World", null, false)
        );
    }

    @Test
    void createAward_withBlankNomineeName_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                awardService.createAward("Best Dressed", List.of(new Nominee("  ", null), Nominee.of("Valid Name")), false)
        );
    }

    @Test
    void createAward_withNullNomineeName_throwsElectionException() {
        List<Nominee> nominees = new ArrayList<>();
        nominees.add(new Nominee(null, null));
        nominees.add(Nominee.of("Valid Name"));
        assertThrows(ElectionException.class, () ->
                awardService.createAward("Best Dressed", nominees, false)
        );
    }

    @Test
    void openAward_changeStatusToOpen() {
        Award award = awardService.createAward("Most Successful", List.of(Nominee.of("Chidi"), Nominee.of("Ngozi")), false);

        awardService.openAward(award.getId());

        assertEquals(AwardStatus.OPEN, awardService.getAward(award.getId()).getStatus());
    }

    @Test
    void openAward_thatIsAlreadyOpen_throwsElectionException() {
        Award award = awardService.createAward("Most Successful", List.of(Nominee.of("Chidi"), Nominee.of("Ngozi")), false);
        awardService.openAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.openAward(award.getId()));
    }

    @Test
    void openAward_thatIsClosed_throwsElectionException() {
        Award award = awardService.createAward("Most Successful", List.of(Nominee.of("Chidi"), Nominee.of("Ngozi")), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.openAward(award.getId()));
    }

    @Test
    void closeAward_changeStatusToClosed() {
        Award award = awardService.createAward("Most Likely to Get Married", List.of(Nominee.of("Bisi"), Nominee.of("Emeka")), false);
        awardService.openAward(award.getId());

        awardService.closeAward(award.getId());

        assertEquals(AwardStatus.CLOSED, awardService.getAward(award.getId()).getStatus());
    }

    @Test
    void closeAward_thatIsPending_throwsElectionException() {
        Award award = awardService.createAward("Most Likely to Get Married", List.of(Nominee.of("Bisi"), Nominee.of("Emeka")), false);

        assertThrows(ElectionException.class, () -> awardService.closeAward(award.getId()));
    }

    @Test
    void closeAward_thatIsAlreadyClosed_throwsElectionException() {
        Award award = awardService.createAward("Most Likely to Get Married", List.of(Nominee.of("Bisi"), Nominee.of("Emeka")), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.closeAward(award.getId()));
    }

    @Test
    void deleteAward_thatIsPending_succeeds() {
        Award award = awardService.createAward("Best Dressed", List.of(Nominee.of("Kemi"), Nominee.of("Femi")), false);

        awardService.deleteAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.getAward(award.getId()));
    }

    @Test
    void deleteAward_thatIsOpen_throwsElectionException() {
        Award award = awardService.createAward("Best Dressed", List.of(Nominee.of("Kemi"), Nominee.of("Femi")), false);
        awardService.openAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.deleteAward(award.getId()));
    }

    @Test
    void deleteAward_thatIsClosed_throwsElectionException() {
        Award award = awardService.createAward("Best Dressed", List.of(Nominee.of("Kemi"), Nominee.of("Femi")), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.deleteAward(award.getId()));
    }

    @Test
    void getAward_withNonExistentId_throwsElectionException() {
        assertThrows(ElectionException.class, () -> awardService.getAward("non-existent-id"));
    }

    @Test
    void listAwards_returnsAllCreatedAwards() {
        awardService.createAward("Class Clown", List.of(Nominee.of("Tunde")), false);
        awardService.createAward("Most Successful", List.of(Nominee.of("Amaka")), false);

        assertEquals(2, awardService.listAwards().size());
    }

    @Test
    void revealAward_flipsRevealedFlag() {
        Award award = awardService.createAward("Most Likely to Be Famous", List.of(Nominee.of("Sola"), Nominee.of("Taiwo")), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());

        awardService.revealAward(award.getId());

        assertTrue(awardService.getAward(award.getId()).isRevealed());
    }

    @Test
    void revealAward_thatIsNotClosed_throwsElectionException() {
        Award award = awardService.createAward("Most Likely to Be Famous", List.of(Nominee.of("Sola"), Nominee.of("Taiwo")), false);
        awardService.openAward(award.getId());

        assertThrows(ElectionException.class, () -> awardService.revealAward(award.getId()));
    }
}
