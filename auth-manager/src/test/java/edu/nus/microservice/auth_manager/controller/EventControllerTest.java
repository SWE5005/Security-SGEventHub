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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(authentication.getCredentials()).thenReturn(jwt);
        when(jwt.getClaims()).thenReturn(Map.of("userid", "test-user-id"));
    }

    @Test
    void getAllEvents_ShouldReturnEvents() {
        // Arrange
        when(eventService.getAllEvents("test-user-id")).thenReturn(List.of());

        // Act
        ResponseEntity<?> response = eventController.getAllEvents(authentication);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }

    @Test
    void createEvent_ShouldCreateEvent() {
        // Arrange
        EventRequest request = new EventRequest();
        request.setTitle("Test Event");
        request.setDescription("Test Description");
        request.setStartDatetime(LocalDateTime.now().toString());
        request.setEndDatetime(LocalDateTime.now().plusHours(2).toString());
        request.setLocation("Test Location");
        request.setCapacity(100);

        EventDetailResponse expectedResponse = new EventDetailResponse();
        expectedResponse.setId(UUID.randomUUID());
        expectedResponse.setTitle(request.getTitle());
        expectedResponse.setDescription(request.getDescription());
        expectedResponse.setStartDatetime(LocalDateTime.parse(request.getStartDatetime()));
        expectedResponse.setEndDatetime(LocalDateTime.parse(request.getEndDatetime()));
        expectedResponse.setLocation(request.getLocation());
        expectedResponse.setCapacity(request.getCapacity());
        expectedResponse.setStatus("OPEN");
        expectedResponse.setRegistrationCount(0);

        // Set up the mock to return the expected response
        doReturn(expectedResponse).when(eventService).createEvent(any(EventRequest.class), eq("test-user-id"));

        // Act
        ResponseEntity<?> response = eventController.createEvent(authentication, request);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        EventDetailResponse actualResponse = (EventDetailResponse) response.getBody();
        assertEquals(expectedResponse.getTitle(), actualResponse.getTitle());
        assertEquals(expectedResponse.getDescription(), actualResponse.getDescription());
        assertEquals(expectedResponse.getLocation(), actualResponse.getLocation());
        assertEquals(expectedResponse.getCapacity(), actualResponse.getCapacity());
        assertEquals(expectedResponse.getStatus(), actualResponse.getStatus());

        // Verify the service method was called
        verify(eventService, times(1)).createEvent(any(EventRequest.class), eq("test-user-id"));
    }

    // 其它接口的测试可依次补充
} 