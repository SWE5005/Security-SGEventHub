package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class EventMapperTest {
    private EventMapper eventMapper;

    @BeforeEach
    void setUp() {
        eventMapper = new EventMapper();
    }

    @Test
    void convertToEventListResponse_ShouldMapFields() {
        edu.nus.microservice.auth_manager.entity.UserInfoEntity owner = edu.nus.microservice.auth_manager.entity.UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .emailAddress("owner@example.com")
                .build();
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .registration(new java.util.ArrayList<>())
                .owner(owner)
                .build();
        EventListResponse response = eventMapper.convertToEventListResponse(event, UUID.randomUUID());
        assertNotNull(response);
        assertEquals(event.getId(), response.getId());
        assertEquals("Test Event", response.getTitle());
    }

    @Test
    void convertToEventListResponse_ShouldHandleNullRegistration() {
        edu.nus.microservice.auth_manager.entity.UserInfoEntity owner = edu.nus.microservice.auth_manager.entity.UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .emailAddress("owner@example.com")
                .build();
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .registration(null)
                .owner(owner)
                .build();
        assertThrows(NullPointerException.class, () -> eventMapper.convertToEventListResponse(event, UUID.randomUUID()));
    }

    @Test
    void convertToEventListResponse_ShouldHandleNullOwner() {
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .registration(new java.util.ArrayList<>())
                .owner(null)
                .build();
        assertThrows(NullPointerException.class, () -> eventMapper.convertToEventListResponse(event, UUID.randomUUID()));
    }

    @Test
    void convertToEventListResponse_ShouldHandleNullEvent() {
        assertThrows(NullPointerException.class, () -> eventMapper.convertToEventListResponse(null, UUID.randomUUID()));
    }

    @Test
    void convertToEventListResponse_ShouldHandleMultipleRegistrations() {
        edu.nus.microservice.auth_manager.entity.UserInfoEntity owner = edu.nus.microservice.auth_manager.entity.UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .emailAddress("owner@example.com")
                .build();
        java.util.List<edu.nus.microservice.auth_manager.entity.EventRegistrationEntity> registrations = new java.util.ArrayList<>();
        registrations.add(null);
        registrations.add(edu.nus.microservice.auth_manager.entity.EventRegistrationEntity.builder().id(UUID.randomUUID()).build());
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .registration(registrations)
                .owner(owner)
                .build();
        assertThrows(NullPointerException.class, () -> eventMapper.convertToEventListResponse(event, UUID.randomUUID()));
    }

    @Test
    void convertToEventListResponse_ShouldHandleNullTitleAndDescription() {
        edu.nus.microservice.auth_manager.entity.UserInfoEntity owner = edu.nus.microservice.auth_manager.entity.UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .emailAddress("owner@example.com")
                .build();
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title(null)
                .description(null)
                .registration(new java.util.ArrayList<>())
                .owner(owner)
                .build();
        assertDoesNotThrow(() -> eventMapper.convertToEventListResponse(event, UUID.randomUUID()));
    }

    @Test
    void convertToEventListResponse_ShouldHandleOwnerWithNullEmail() {
        edu.nus.microservice.auth_manager.entity.UserInfoEntity owner = edu.nus.microservice.auth_manager.entity.UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .emailAddress(null)
                .build();
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .registration(new java.util.ArrayList<>())
                .owner(owner)
                .build();
        assertDoesNotThrow(() -> eventMapper.convertToEventListResponse(event, UUID.randomUUID()));
    }

    @Test
    void convertToEventListResponse_ShouldHandleRegistrationWithNullElement() {
        edu.nus.microservice.auth_manager.entity.UserInfoEntity owner = edu.nus.microservice.auth_manager.entity.UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("owner")
                .emailAddress("owner@example.com")
                .build();
        java.util.List<edu.nus.microservice.auth_manager.entity.EventRegistrationEntity> registrations = new java.util.ArrayList<>();
        registrations.add(null);
        EventEntity event = EventEntity.builder()
                .id(UUID.randomUUID())
                .title("Test Event")
                .description("desc")
                .registration(registrations)
                .owner(owner)
                .build();
        assertThrows(NullPointerException.class, () -> eventMapper.convertToEventListResponse(event, UUID.randomUUID()));
    }
} 