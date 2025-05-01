package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.ApiResponse;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FeedbackControllerTest {
    @Mock
    private FeedbackService feedbackService;
    @Mock
    private Authentication authentication;
    @Mock
    private Jwt jwt;
    @InjectMocks
    private FeedbackController feedbackController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createFeedback_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        when(authentication.getCredentials()).thenReturn(jwt);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userid", "123");
        when(jwt.getClaims()).thenReturn(claims);
        when(feedbackService.createFeedback(any(), any())).thenReturn("success");

        FeedbackRequest request = new FeedbackRequest();
        ResponseEntity<?> response = feedbackController.createFeedback(authentication, request);
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void createFeedback_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        when(authentication.getCredentials()).thenReturn(jwt);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userid", "123");
        when(jwt.getClaims()).thenReturn(claims);
        when(feedbackService.createFeedback(any(), any())).thenThrow(new RuntimeException("fail"));

        FeedbackRequest request = new FeedbackRequest();
        ResponseEntity<?> response = feedbackController.createFeedback(authentication, request);
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void getFeedbackList_ShouldReturnOk() {
        var principal = mock(java.security.Principal.class);
        when(principal.getName()).thenReturn("testuser");
        when(feedbackService.getFeedbackByEventId(any())).thenReturn(java.util.Collections.emptyList());
        ResponseEntity<?> response = feedbackController.getFeedbackList(principal, "eventId");
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void getFeedbackList_ShouldReturnError() {
        var principal = mock(java.security.Principal.class);
        when(principal.getName()).thenReturn("testuser");
        when(feedbackService.getFeedbackByEventId(any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = feedbackController.getFeedbackList(principal, "eventId");
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }
} 