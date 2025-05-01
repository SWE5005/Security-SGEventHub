package edu.nus.microservice.auth_manager.util;

import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.FeedbackEntity;
import edu.nus.microservice.auth_manager.entity.RefreshTokenEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.enums.RegistrationTypes;

import java.time.LocalDateTime;
import java.util.UUID;

public class TestUtil {

    public static UserInfoEntity createTestUser() {
        return UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .emailAddress("test@example.com")
                .password("password")
                .roles("USER")
                .build();
    }

    public static UserRegistrationRequest createTestUserRegistrationRequest() {
        return UserRegistrationRequest.builder()
                .userName("newuser")
                .userEmail("newuser@example.com")
                .userPassword("password")
                .userRole("USER")
                .build();
    }

    public static CreateUserRequest createTestCreateUserRequest() {
        return CreateUserRequest.builder()
                .userName("newuser")
                .emailAddress("newuser@example.com")
                .mobileNumber("1234567890")
                .build();
    }

    public static ManageUserRequest createTestManageUserRequest() {
        return ManageUserRequest.builder()
                .userId(UUID.randomUUID().toString())
                .userName("updateduser")
                .mobileNumber("1234567890")
                .roles("ADMIN")
                .activeStatus("true")
                .build();
    }

    public static EventRequest createTestEventRequest() {
        return EventRequest.builder()
                .title("Test Event")
                .description("Test Description")
                .startDatetime("2024-03-20T10:00:00")
                .endDatetime("2024-03-20T12:00:00")
                .location("Test Location")
                .capacity(100)
                .status("ACTIVE")
                .build();
    }

    public static EventEntity createTestEvent() {
        return EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("Test Description")
                .startDatetime(LocalDateTime.now())
                .endDatetime(LocalDateTime.now().plusHours(2))
                .location("Test Location")
                .capacity(100)
                .status("ACTIVE")
                .build();
    }

    public static EventRegistrationEntity createTestEventRegistration(EventEntity event, UserInfoEntity user) {
        return EventRegistrationEntity.builder()
                .id(UUID.randomUUID())
                .event(event)
                .user(user)
                .build();
    }

    public static FeedbackRequest createTestFeedbackRequest() {
        return FeedbackRequest.builder()
                .eventId(UUID.randomUUID().toString())
                .rating(5)
                .comment("Great event!")
                .build();
    }

    public static FeedbackEntity createTestFeedback(EventEntity event, UserInfoEntity user) {
        return FeedbackEntity.builder()
                .id(UUID.randomUUID())
                .eventId(event.getId())
                .rating(5)
                .comment("Great event!")
                .user(user)
                .build();
    }

    public static RefreshTokenEntity createTestRefreshToken(UserInfoEntity user) {
        return RefreshTokenEntity.builder()
                .refreshToken("test-refresh-token")
                .revoked(false)
                .user(user)
                .build();
    }

    public static AuthResponse createTestAuthResponse() {
        return AuthResponse.builder()
                .accessToken("test-access-token")
                .accessTokenExpiry(300)
                .userName("testuser")
                .emailAddress("test@example.com")
                .userRole("USER")
                .build();
    }
} 