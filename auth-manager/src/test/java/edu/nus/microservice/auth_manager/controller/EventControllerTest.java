package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.EventDetailResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.enums.RegistrationTypes;
import edu.nus.microservice.auth_manager.service.EventService;
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
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
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
    }

    private void mockJwtUserId() {
        when(authentication.getCredentials()).thenReturn(jwt);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userid", "123");
        when(jwt.getClaims()).thenReturn(claims);
    }

    @Test
    void getAllEvents_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.getAllEvents(any())).thenReturn(java.util.Collections.emptyList());
        ResponseEntity<?> response = eventController.getAllEvents(authentication);
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void getAllEvents_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.getAllEvents(any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = eventController.getAllEvents(authentication);
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void getEventDetails_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        EventDetailResponse detailResponse = EventDetailResponse.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .build();
        when(eventService.getEventDetails(any(), any())).thenReturn(detailResponse);
        ResponseEntity<?> response = eventController.getEventDetails(authentication, "eventId");
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void getEventDetails_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.getEventDetails(any(), any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = eventController.getEventDetails(authentication, "eventId");
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void createEvent_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        EventDetailResponse detailResponse = EventDetailResponse.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .build();
        when(eventService.createEvent(any(), any())).thenReturn(detailResponse);
        EventRequest req = new EventRequest();
        ResponseEntity<?> response = eventController.createEvent(authentication, req);
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void createEvent_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.createEvent(any(), any())).thenThrow(new RuntimeException("fail"));
        EventRequest req = new EventRequest();
        ResponseEntity<?> response = eventController.createEvent(authentication, req);
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void registerEvent_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.registerEvent(any(), any(), any())).thenReturn("ok");
        ResponseEntity<?> response = eventController.registerEvent(authentication, "eventId", RegistrationTypes.REGISTER.name());
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void registerEvent_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.registerEvent(any(), any(), any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = eventController.registerEvent(authentication, "eventId", RegistrationTypes.REGISTER.name());
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void removeParticipant_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.registerEvent(any(), any(), any())).thenReturn("ok");
        ResponseEntity<?> response = eventController.removeParticipant(authentication, "eventId", "userId");
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void removeParticipant_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.registerEvent(any(), any(), any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = eventController.removeParticipant(authentication, "eventId", "userId");
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void deleteEvent_ShouldReturnOk() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.deleteEvent(any())).thenReturn("ok");
        ResponseEntity<?> response = eventController.deleteEvent(authentication, "eventId");
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void deleteEvent_ShouldReturnError() {
        when(authentication.getName()).thenReturn("testuser");
        mockJwtUserId();
        when(eventService.deleteEvent(any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = eventController.deleteEvent(authentication, "eventId");
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }
} 