package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.dto.EventDetailResponse;
import edu.nus.microservice.auth_manager.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventService eventService;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private EventController eventController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(authentication.getCredentials()).thenReturn(jwt);
        when(jwt.getClaims()).thenReturn(Map.of("userid", "test-user-id"));
    }

    @Test
    void createEvent_ShouldCreateEvent() {
        // Arrange
        EventRequest request = EventRequest.builder()
                .title("Test Event")
                .description("Test Description")
                .location("Test Location")
                .startDatetime(LocalDateTime.now().toString())
                .endDatetime(LocalDateTime.now().plusHours(2).toString())
                .capacity(100)
                .build();

        EventDetailResponse expectedResponse = EventDetailResponse.builder()
                .id(UUID.randomUUID())
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .startDatetime(LocalDateTime.parse(request.getStartDatetime()))
                .endDatetime(LocalDateTime.parse(request.getEndDatetime()))
                .capacity(request.getCapacity())
                .status("ACTIVE")
                .build();

        when(eventService.createEvent(any(EventRequest.class), eq("test-user-id"))).thenReturn(expectedResponse);

        // Act
        ResponseEntity<?> response = eventController.createEvent(authentication, request);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        EventDetailResponse actualResponse = (EventDetailResponse) response.getBody();
        assertEquals(expectedResponse.getTitle(), actualResponse.getTitle());
        assertEquals(expectedResponse.getDescription(), actualResponse.getDescription());
        assertEquals(expectedResponse.getLocation(), actualResponse.getLocation());
        assertEquals(expectedResponse.getCapacity(), actualResponse.getCapacity());
        assertEquals(expectedResponse.getStatus(), actualResponse.getStatus());
        verify(eventService).createEvent(any(EventRequest.class), eq("test-user-id"));
    }
} 