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
} 