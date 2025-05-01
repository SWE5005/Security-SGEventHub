package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.EventDetailUser;
import edu.nus.microservice.auth_manager.dto.FeedbackDetailResponse;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.entity.FeedbackEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.FeedbackMapper;
import edu.nus.microservice.auth_manager.repository.FeedbackRepository;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.impl.FeedbackServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FeedbackMapper feedbackMapper;

    @InjectMocks
    private FeedbackServiceImpl feedbackService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createFeedback_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        String eventId = UUID.randomUUID().toString();
        FeedbackRequest request = FeedbackRequest.builder()
                .eventId(eventId)
                .rating(5)
                .comment("Great event!")
                .build();

        UserInfoEntity user = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .emailAddress("test@example.com")
                .build();

        FeedbackEntity feedbackEntity = FeedbackEntity.builder()
                .id(UUID.randomUUID())
                .eventId(UUID.fromString(eventId))
                .rating(request.getRating())
                .comment(request.getComment())
                .user(user)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(feedbackMapper.convertToFeedbackEntity(request, user)).thenReturn(feedbackEntity);
        when(feedbackRepository.save(any(FeedbackEntity.class))).thenReturn(feedbackEntity);

        // Act
        String result = feedbackService.createFeedback(request, userId.toString());

        // Assert
        assertEquals("Create feedback successfully.", result);
        verify(feedbackRepository).save(any(FeedbackEntity.class));
    }

    @Test
    void createFeedback_UserNotFound() {
        // Arrange
        UUID userId = UUID.randomUUID();
        FeedbackRequest request = FeedbackRequest.builder()
                .eventId(UUID.randomUUID().toString())
                .rating(5)
                .comment("Great event!")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> feedbackService.createFeedback(request, userId.toString()));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }

    @Test
    void createFeedback_Exception() {
        // Arrange
        UUID userId = UUID.randomUUID();
        FeedbackRequest request = FeedbackRequest.builder()
                .eventId(UUID.randomUUID().toString())
                .rating(5)
                .comment("Great event!")
                .build();

        UserInfoEntity user = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .emailAddress("test@example.com")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(feedbackMapper.convertToFeedbackEntity(request, user)).thenThrow(new RuntimeException("Mapping error"));

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> feedbackService.createFeedback(request, userId.toString()));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }

    @Test
    void getFeedbackByEventId_Success() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UserInfoEntity user = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .emailAddress("test@example.com")
                .build();

        FeedbackEntity feedback1 = FeedbackEntity.builder()
                .id(UUID.randomUUID())
                .eventId(eventId)
                .rating(5)
                .comment("Great event!")
                .user(user)
                .build();

        FeedbackEntity feedback2 = FeedbackEntity.builder()
                .id(UUID.randomUUID())
                .eventId(eventId)
                .rating(4)
                .comment("Good event")
                .user(user)
                .build();

        EventDetailUser eventUser = EventDetailUser.builder()
                .userId(userId)
                .emailAddress(user.getEmailAddress())
                .build();

        FeedbackDetailResponse response1 = FeedbackDetailResponse.builder()
                .id(feedback1.getId())
                .eventId(eventId)
                .rating(feedback1.getRating())
                .comment(feedback1.getComment())
                .user(eventUser)
                .build();

        FeedbackDetailResponse response2 = FeedbackDetailResponse.builder()
                .id(feedback2.getId())
                .eventId(eventId)
                .rating(feedback2.getRating())
                .comment(feedback2.getComment())
                .user(eventUser)
                .build();

        when(feedbackRepository.findByEventId(eventId)).thenReturn(Arrays.asList(feedback1, feedback2));
        when(feedbackMapper.convertToFeedbackResponse(feedback1)).thenReturn(response1);
        when(feedbackMapper.convertToFeedbackResponse(feedback2)).thenReturn(response2);

        // Act
        List<FeedbackDetailResponse> result = feedbackService.getFeedbackByEventId(eventId.toString());

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(feedback1.getId(), result.get(0).getId());
        assertEquals(feedback2.getId(), result.get(1).getId());
        assertEquals(feedback1.getRating(), result.get(0).getRating());
        assertEquals(feedback2.getRating(), result.get(1).getRating());
        assertEquals(feedback1.getComment(), result.get(0).getComment());
        assertEquals(feedback2.getComment(), result.get(1).getComment());
    }

    @Test
    void getFeedbackByEventId_EmptyList() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        when(feedbackRepository.findByEventId(eventId)).thenReturn(Arrays.asList());

        // Act
        List<FeedbackDetailResponse> result = feedbackService.getFeedbackByEventId(eventId.toString());

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getFeedbackByEventId_InvalidEventId() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> feedbackService.getFeedbackByEventId("invalid-uuid"));
    }
} 