package edu.nus.microservice.event_manager.controller;

import edu.nus.microservice.event_manager.dto.EventRequest;
import edu.nus.microservice.event_manager.dto.EventResponse;
import edu.nus.microservice.event_manager.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void searchEventByTitle_ShouldReturnEvent() {
        // Arrange
        String title = "Test Event";
        EventResponse expectedResponse = new EventResponse();
        when(eventService.searchEventByTitle(title)).thenReturn(expectedResponse);

        // Act
        EventResponse result = eventController.searchEventByTitle(title);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(eventService).searchEventByTitle(title);
    }

    @Test
    void searchEventByTitle_WithEmptyTitle_ShouldThrowException() {
        // Arrange
        String emptyTitle = "";

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            eventController.searchEventByTitle(emptyTitle);
        });
    }

    @Test
    void createEvent_ShouldCreateAndReturnEvent() {
        // Arrange
        EventRequest request = new EventRequest();
        request.setEventTitle("Test Event");
        EventResponse expectedResponse = new EventResponse();
        when(eventService.createEvent(any(EventRequest.class))).thenReturn(expectedResponse);

        // Act
        EventResponse result = eventController.createEvent(request);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(eventService).createEvent(request);
    }

    @Test
    void createEvent_WithNullRequest_ShouldThrowException() {
        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            eventController.createEvent(null);
        });
    }

    @Test
    void getAllEvents_ShouldReturnAllEvents() {
        // Arrange
        Map<String, String> headers = new HashMap<>();
        headers.put("userid", UUID.randomUUID().toString());
        List<EventResponse> expectedEvents = Arrays.asList(new EventResponse(), new EventResponse());
        when(eventService.getAllEvents(any(UUID.class))).thenReturn(expectedEvents);

        // Act
        List<EventResponse> result = eventController.getAllEvents(headers);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(eventService).getAllEvents(any(UUID.class));
    }

    @Test
    void getAllEvents_WithInvalidUserId_ShouldThrowException() {
        // Arrange
        Map<String, String> headers = new HashMap<>();
        headers.put("userid", "invalid-uuid");

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            eventController.getAllEvents(headers);
        });
    }

    @Test
    void deleteEvent_ShouldDeleteEvent() {
        // Arrange
        UUID eventId = UUID.randomUUID();

        // Act
        eventController.deleteEventUser(eventId);

        // Assert
        verify(eventService).deleteEventbyId(eventId);
    }

    @Test
    void deleteEvent_WithNullId_ShouldThrowException() {
        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            eventController.deleteEventUser(null);
        });
    }

    @Test
    void updateEvent_ShouldUpdateEvent() {
        // Arrange
        EventRequest request = new EventRequest();
        request.setEventId(UUID.randomUUID());
        request.setEventTitle("Updated Event");
        when(eventService.UpdateEvent(any(), any(), any(), any(), any(), any(), any(), anyInt()))
                .thenReturn(1);

        // Act
        eventController.UpdateStatus(request);

        // Assert
        verify(eventService).UpdateEvent(
                request.getEventId(),
                request.getEventTitle(),
                request.getEventDesc(),
                request.getEventCover(),
                request.getEventPlace(),
                request.getEventStartDt(),
                request.getEventEndDt(),
                request.getEventCapacity()
        );
    }

    @Test
    void updateEvent_WithUpdateFailure_ShouldThrowException() {
        // Arrange
        EventRequest request = new EventRequest();
        request.setEventId(UUID.randomUUID());
        when(eventService.UpdateEvent(any(), any(), any(), any(), any(), any(), any(), anyInt()))
                .thenReturn(0);

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            eventController.UpdateStatus(request);
        });
    }

    @Test
    void updateEvent_WithNullRequest_ShouldThrowException() {
        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            eventController.UpdateStatus(null);
        });
    }
} 