package edu.nus.microservice.event_manager.repository;

import edu.nus.microservice.event_manager.model.Event;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class EventRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private EventRepository eventRepository;

    @Test
    void whenFindByTitle_thenReturnEvent() {
        // Arrange
        Event event = new Event();
        event.setEventId(UUID.randomUUID());
        event.setEventTitle("Test Event");
        event.setEventDesc("Test Description");
        event.setEventCreateDt(new Date());
        entityManager.persist(event);
        entityManager.flush();

        // Act
        Event found = eventRepository.SearchEventByTitle("Test Event");

        // Assert
        assertNotNull(found);
        assertEquals("Test Event", found.getEventTitle());
    }

    @Test
    void whenFindById_thenReturnEvent() {
        // Arrange
        Event event = new Event();
        UUID eventId = UUID.randomUUID();
        event.setEventId(eventId);
        event.setEventTitle("Test Event");
        event.setEventDesc("Test Description");
        event.setEventCreateDt(new Date());
        entityManager.persist(event);
        entityManager.flush();

        // Act
        Event found = eventRepository.QueryEventById(eventId);

        // Assert
        assertNotNull(found);
        assertEquals(eventId, found.getEventId());
    }

    @Test
    void whenSave_thenReturnSavedEvent() {
        // Arrange
        Event event = new Event();
        event.setEventId(UUID.randomUUID());
        event.setEventTitle("Test Event");
        event.setEventDesc("Test Description");
        event.setEventCreateDt(new Date());

        // Act
        Event saved = eventRepository.save(event);

        // Assert
        assertNotNull(saved);
        assertNotNull(saved.getEventId());
        assertEquals("Test Event", saved.getEventTitle());
    }

    @Test
    void whenUpdate_thenReturnUpdatedEvent() {
        // Arrange
        Event event = new Event();
        UUID eventId = UUID.randomUUID();
        event.setEventId(eventId);
        event.setEventTitle("Original Title");
        event.setEventDesc("Original Description");
        event.setEventCreateDt(new Date());
        entityManager.persist(event);
        entityManager.flush();

        // Act
        int result = eventRepository.UpdateEvent(
                eventId,
                "Updated Title",
                "Updated Description",
                "cover.jpg",
                "Updated Place",
                new Date(),
                new Date(),
                100
        );

        // Assert
        assertEquals(1, result);
        Event updated = eventRepository.QueryEventById(eventId);
        assertEquals("Updated Title", updated.getEventTitle());
        assertEquals("Updated Description", updated.getEventDesc());
    }

    @Test
    void whenDelete_thenEventShouldNotExist() {
        // Arrange
        Event event = new Event();
        UUID eventId = UUID.randomUUID();
        event.setEventId(eventId);
        event.setEventTitle("Test Event");
        event.setEventDesc("Test Description");
        event.setEventCreateDt(new Date());
        entityManager.persist(event);
        entityManager.flush();

        // Act
        eventRepository.deleteById(eventId);

        // Assert
        Event found = eventRepository.QueryEventById(eventId);
        assertNull(found);
    }
} 