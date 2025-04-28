package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class EventRegistrationMapperTest {
    private EventRegistrationMapper eventRegistrationMapper;

    @BeforeEach
    void setUp() {
        eventRegistrationMapper = new EventRegistrationMapper();
    }

    @Test
    void convertToEventRegistration_ShouldMapFields() {
        EventEntity event = EventEntity.builder().id(UUID.randomUUID()).build();
        UserInfoEntity user = UserInfoEntity.builder().id(UUID.randomUUID()).build();
        EventRegistrationEntity entity = eventRegistrationMapper.convertToEventRegistration(event, user);
        assertNotNull(entity);
        assertEquals(event, entity.getEvent());
        assertEquals(user, entity.getUser());
    }
} 