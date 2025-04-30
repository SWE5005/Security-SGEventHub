package edu.nus.microservice.event_manager.service;

import edu.nus.microservice.event_manager.dto.EventDetailResponse;
import edu.nus.microservice.event_manager.dto.EventRequest;
import edu.nus.microservice.event_manager.dto.EventResponse;
import edu.nus.microservice.event_manager.model.Event;
import edu.nus.microservice.event_manager.model.EventRegistration;
import edu.nus.microservice.event_manager.repository.EventRegisterRepository;
import edu.nus.microservice.event_manager.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventRegisterRepository eventRegisterRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private EventService eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllEvents_ShouldReturnAllEvents() {
        // Arrange
        UUID userId = UUID.randomUUID();
        List<Event> events = Arrays.asList(new Event(), new Event());
        List<EventRegistration> registrations = Arrays.asList(new EventRegistration(), new EventRegistration());
        when(eventRepository.findAll()).thenReturn(events);
        when(eventRegisterRepository.findAll()).thenReturn(registrations);
        when(modelMapper.map(any(Event.class), eq(EventResponse.class))).thenReturn(new EventResponse());

        // Act
        List<EventResponse> result = eventService.getAllEvents(userId);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(eventRepository).findAll();
        verify(eventRegisterRepository).findAll();
    }

    @Test
    void getAllEvents_WithNoEvents_ShouldReturnEmptyList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(eventRepository.findAll()).thenReturn(Collections.emptyList());
        when(eventRegisterRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<EventResponse> result = eventService.getAllEvents(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void createEvent_ShouldCreateAndReturnEvent() {
        // Arrange
        EventRequest request = new EventRequest();
        request.setEventTitle("Test Event");
        Event event = new Event();
        EventResponse expectedResponse = new EventResponse();
        when(modelMapper.map(any(Event.class), eq(EventResponse.class))).thenReturn(expectedResponse);
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        // Act
        EventResponse result = eventService.createEvent(request);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void createEvent_WithNullRequest_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(null);
        });
    }

    @Test
    void deleteEventById_ShouldDeleteEvent() {
        // Arrange
        UUID eventId = UUID.randomUUID();

        // Act
        eventService.deleteEventbyId(eventId);

        // Assert
        verify(eventRepository).deleteById(eventId);
    }

    @Test
    void deleteEventById_WithNullId_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.deleteEventbyId(null);
        });
    }

    @Test
    void searchEventByTitle_ShouldReturnEvent() {
        // Arrange
        String title = "Test Event";
        Event event = new Event();
        EventResponse expectedResponse = new EventResponse();
        when(eventRepository.SearchEventByTitle(title)).thenReturn(event);
        when(modelMapper.map(event, EventResponse.class)).thenReturn(expectedResponse);

        // Act
        EventResponse result = eventService.searchEventByTitle(title);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(eventRepository).SearchEventByTitle(title);
    }

    @Test
    void searchEventByTitle_WithEmptyTitle_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.searchEventByTitle("");
        });
    }

    @Test
    void searchEventById_ShouldReturnEventDetail() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        Event event = new Event();
        List<EventRegistration> registrations = Arrays.asList(new EventRegistration());
        EventDetailResponse expectedResponse = new EventDetailResponse();
        when(eventRepository.QueryEventById(eventId)).thenReturn(event);
        when(eventRegisterRepository.SearchEventRegister(eventId)).thenReturn(registrations);
        when(modelMapper.map(event, EventDetailResponse.class)).thenReturn(expectedResponse);

        // Act
        EventDetailResponse result = eventService.searchEventById(eventId);

        // Assert
        assertNotNull(result);
        assertEquals(expectedResponse, result);
        verify(eventRepository).QueryEventById(eventId);
        verify(eventRegisterRepository).SearchEventRegister(eventId);
    }

    @Test
    void searchEventById_WithNullId_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.searchEventById(null);
        });
    }

    @Test
    void updateEvent_ShouldUpdateEvent() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        String title = "Updated Event";
        String desc = "Updated Description";
        String cover = "cover.jpg";
        String place = "Updated Place";
        Date startDt = new Date();
        Date endDt = new Date();
        int capacity = 100;
        when(eventRepository.UpdateEvent(eventId, title, desc, cover, place, startDt, endDt, capacity))
                .thenReturn(1);

        // Act
        int result = eventService.UpdateEvent(eventId, title, desc, cover, place, startDt, endDt, capacity);

        // Assert
        assertEquals(1, result);
        verify(eventRepository).UpdateEvent(eventId, title, desc, cover, place, startDt, endDt, capacity);
    }

    @Test
    void updateEvent_WithNullId_ShouldThrowException() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.UpdateEvent(null, "title", "desc", "cover", "place", new Date(), new Date(), 100);
        });
    }
} 