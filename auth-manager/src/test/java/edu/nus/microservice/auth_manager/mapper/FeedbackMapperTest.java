package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.entity.FeedbackEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class FeedbackMapperTest {
    private FeedbackMapper feedbackMapper;

    @BeforeEach
    void setUp() {
        feedbackMapper = new FeedbackMapper();
    }

    @Test
    void convertToFeedbackEntity_ShouldMapFields() {
        FeedbackRequest req = FeedbackRequest.builder()
                .eventId(UUID.randomUUID().toString())
                .rating(5)
                .comment("Great event!")
                .build();
        UserInfoEntity user = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .build();
        FeedbackEntity entity = feedbackMapper.convertToFeedbackEntity(req, user);
        assertNotNull(entity);
        assertEquals(5, entity.getRating());
        assertEquals("Great event!", entity.getComment());
        assertEquals(user, entity.getUser());
    }
} 