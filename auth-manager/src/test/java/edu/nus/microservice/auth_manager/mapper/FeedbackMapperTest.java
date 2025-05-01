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

    @Test
    void convertToFeedbackEntity_ShouldHandleNullRequest() {
        UserInfoEntity user = UserInfoEntity.builder().id(UUID.randomUUID()).build();
        assertThrows(NullPointerException.class, () -> feedbackMapper.convertToFeedbackEntity(null, user));
    }

    @Test
    void convertToFeedbackEntity_ShouldHandleNullUser() {
        FeedbackRequest req = FeedbackRequest.builder().eventId(UUID.randomUUID().toString()).build();
        assertDoesNotThrow(() -> feedbackMapper.convertToFeedbackEntity(req, null));
    }

    @Test
    void convertToFeedbackEntity_ShouldHandleNullBoth() {
        assertThrows(NullPointerException.class, () -> feedbackMapper.convertToFeedbackEntity(null, null));
    }

    @Test
    void convertToFeedbackEntity_ShouldHandlePartialNullFields() {
        FeedbackRequest req = FeedbackRequest.builder()
                .eventId(null)
                .rating(0)
                .comment(null)
                .build();
        UserInfoEntity user = UserInfoEntity.builder().id(UUID.randomUUID()).username(null).build();
        assertThrows(NullPointerException.class, () -> feedbackMapper.convertToFeedbackEntity(req, user));
    }

    @Test
    void convertToFeedbackEntity_ShouldHandleUserWithPartialNullFields() {
        FeedbackRequest req = FeedbackRequest.builder().eventId(UUID.randomUUID().toString()).rating(1).comment("").build();
        UserInfoEntity user = UserInfoEntity.builder().id(UUID.randomUUID()).username(null).emailAddress(null).build();
        assertDoesNotThrow(() -> feedbackMapper.convertToFeedbackEntity(req, user));
    }

    @Test
    void convertToFeedbackEntity_ShouldHandleEmptyCommentAndZeroRating() {
        FeedbackRequest req = FeedbackRequest.builder().eventId(UUID.randomUUID().toString()).rating(0).comment("").build();
        UserInfoEntity user = UserInfoEntity.builder().id(UUID.randomUUID()).username("testuser").build();
        assertDoesNotThrow(() -> feedbackMapper.convertToFeedbackEntity(req, user));
    }
} 