package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.EventDetailResponse;
import edu.nus.microservice.auth_manager.dto.EventDetailUser;
import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.enums.RegistrationTypes;
import edu.nus.microservice.auth_manager.mapper.EventMapper;
import edu.nus.microservice.auth_manager.mapper.EventRegistrationMapper;
import edu.nus.microservice.auth_manager.repository.EventRegistrationRepository;
import edu.nus.microservice.auth_manager.repository.EventRepository;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.impl.EventServiceImpl;
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

class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EventRegistrationRepository eventRegistrationRepo;

    @Mock
    private EventMapper eventMapper;

    @Mock
    private EventRegistrationMapper eventRegistrationMapper;

    @InjectMocks
    private EventServiceImpl eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllEvents_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        EventEntity event1 = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Event 1")
                .build();
        EventEntity event2 = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Event 2")
                .build();

        EventListResponse response1 = EventListResponse.builder()
                .id(event1.getId())
                .title(event1.getTitle())
                .build();
        EventListResponse response2 = EventListResponse.builder()
                .id(event2.getId())
                .title(event2.getTitle())
                .build();

        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));
        when(eventMapper.convertToEventListResponse(event1, userId)).thenReturn(response1);
        when(eventMapper.convertToEventListResponse(event2, userId)).thenReturn(response2);

        // Act
        List<EventListResponse> result = eventService.getAllEvents(userId.toString());

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(event1.getId(), result.get(0).getId());
        assertEquals(event2.getId(), result.get(1).getId());
    }

    @Test
    void getAllEvents_EmptyList() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(eventRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<EventListResponse> result = eventService.getAllEvents(userId.toString());

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getEventDetails_Success() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        EventEntity event = EventEntity.builder()
                .id(eventId)
                .title("Test Event")
                .description("Test Description")
                .build();

        EventDetailResponse expectedResponse = EventDetailResponse.builder()
                .id(eventId)
                .title(event.getTitle())
                .description(event.getDescription())
                .build();

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(eventMapper.convertToEventDetails(event, userId)).thenReturn(expectedResponse);

        // Act
        EventDetailResponse result = eventService.getEventDetails(eventId.toString(), userId.toString());

        // Assert
        assertNotNull(result);
        assertEquals(eventId, result.getId());
        assertEquals(event.getTitle(), result.getTitle());
        assertEquals(event.getDescription(), result.getDescription());
    }

    @Test
    void getEventDetails_EventNotFound() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> eventService.getEventDetails(eventId.toString(), userId.toString()));
    }

    @Test
    void registerEvent_Success() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        EventEntity event = EventEntity.builder()
                .id(eventId)
                .title("Test Event")
                .build();
        UserInfoEntity user = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .build();

        EventRegistrationEntity registration = EventRegistrationEntity.builder()
                .id(UUID.randomUUID())
                .event(event)
                .user(user)
                .build();

        when(eventRegistrationRepo.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.empty());
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventRegistrationMapper.convertToEventRegistration(event, user)).thenReturn(registration);
        when(eventRegistrationRepo.save(any(EventRegistrationEntity.class))).thenReturn(registration);

        // Act
        String result = eventService.registerEvent(eventId.toString(), userId.toString(), RegistrationTypes.REGISTER.name());

        // Assert
        assertEquals("User has been registered to the targeted event", result);
        verify(eventRegistrationRepo).save(any(EventRegistrationEntity.class));
    }

    @Test
    void unregisterEvent_Success() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        EventRegistrationEntity registration = EventRegistrationEntity.builder()
                .id(UUID.randomUUID())
                .build();

        when(eventRegistrationRepo.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.of(registration));
        doNothing().when(eventRegistrationRepo).deleteById(registration.getId());

        // Act
        String result = eventService.registerEvent(eventId.toString(), userId.toString(), RegistrationTypes.UNREGISTER.name());

        // Assert
        assertEquals("User has been unregistered from the targeted event", result);
        verify(eventRegistrationRepo).deleteById(registration.getId());
    }

    @Test
    void createEvent_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        EventRequest request = EventRequest.builder()
                .title("New Event")
                .description("New Description")
                .startDatetime("2024-03-20T10:00:00")
                .endDatetime("2024-03-20T12:00:00")
                .location("Test Location")
                .capacity(100)
                .status("ACTIVE")
                .build();

        UserInfoEntity user = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .build();

        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title(request.getTitle())
                .description(request.getDescription())
                .build();

        EventDetailResponse expectedResponse = EventDetailResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventMapper.convertToEventEntity(request, user)).thenReturn(event);
        when(eventRepository.save(event)).thenReturn(event);
        when(eventMapper.convertToEventDetails(event, userId)).thenReturn(expectedResponse);

        // Act
        EventDetailResponse result = eventService.createEvent(request, userId.toString());

        // Assert
        assertNotNull(result);
        assertEquals(event.getId(), result.getId());
        assertEquals(event.getTitle(), result.getTitle());
        assertEquals(event.getDescription(), result.getDescription());
    }

    @Test
    void createEvent_UserNotFound() {
        // Arrange
        UUID userId = UUID.randomUUID();
        EventRequest request = EventRequest.builder()
                .title("New Event")
                .description("New Description")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> eventService.createEvent(request, userId.toString()));
    }

    @Test
    void createEvent_Exception() {
        // Arrange
        UUID userId = UUID.randomUUID();
        EventRequest request = EventRequest.builder()
                .title("New Event")
                .description("New Description")
                .build();

        UserInfoEntity user = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(eventMapper.convertToEventEntity(request, user)).thenThrow(new RuntimeException("Mapping error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> eventService.createEvent(request, userId.toString()));
    }

    @Test
    void deleteEvent_Success() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        doNothing().when(eventRepository).deleteById(eventId);

        // Act
        String result = eventService.deleteEvent(eventId.toString());

        // Assert
        assertEquals("Success: Delete Event successfully.", result);
        verify(eventRepository).deleteById(eventId);
    }

    @Test
    void deleteEvent_Exception() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        doThrow(new RuntimeException("Database error")).when(eventRepository).deleteById(eventId);

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> eventService.deleteEvent(eventId.toString()));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }

    @Test
    void registerEvent_AlreadyRegistered() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        EventRegistrationEntity registration = EventRegistrationEntity.builder()
                .id(UUID.randomUUID())
                .build();

        when(eventRegistrationRepo.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.of(registration));

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> eventService.registerEvent(eventId.toString(), userId.toString(), RegistrationTypes.REGISTER.name()));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }

    @Test
    void registerEvent_InvalidRegistrationType() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> eventService.registerEvent(eventId.toString(), userId.toString(), "INVALID_TYPE"));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }

    @Test
    void registerEvent_EventNotFound() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        when(eventRegistrationRepo.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.empty());
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> eventService.registerEvent(eventId.toString(), userId.toString(), RegistrationTypes.REGISTER.name()));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }

    @Test
    void registerEvent_UserNotFound() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        EventEntity event = EventEntity.builder()
                .id(eventId)
                .title("Test Event")
                .build();

        when(eventRegistrationRepo.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.empty());
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        HttpClientErrorException exception = assertThrows(HttpClientErrorException.class,
                () -> eventService.registerEvent(eventId.toString(), userId.toString(), RegistrationTypes.REGISTER.name()));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
    }
} 