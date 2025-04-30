package edu.nus.microservice.event_manager.model;

import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class EventTest {

    @Test
    void testEventBuilder() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        String title = "Test Event";
        String desc = "Test Description";
        String cover = "cover.jpg";
        String place = "Test Place";
        Date startDt = new Date();
        Date endDt = new Date();
        Date createDt = new Date();
        String status = "open";
        int capacity = 100;

        // Act
        Event event = Event.builder()
                .eventId(eventId)
                .eventTitle(title)
                .eventDesc(desc)
                .eventCover(cover)
                .eventPlace(place)
                .eventStartDt(startDt)
                .eventEndDt(endDt)
                .eventCreateDt(createDt)
                .eventStatus(status)
                .eventCapacity(capacity)
                .build();

        // Assert
        assertNotNull(event);
        assertEquals(eventId, event.getEventId());
        assertEquals(title, event.getEventTitle());
        assertEquals(desc, event.getEventDesc());
        assertEquals(cover, event.getEventCover());
        assertEquals(place, event.getEventPlace());
        assertEquals(startDt, event.getEventStartDt());
        assertEquals(endDt, event.getEventEndDt());
        assertEquals(createDt, event.getEventCreateDt());
        assertEquals(status, event.getEventStatus());
        assertEquals(capacity, event.getEventCapacity());
    }

    @Test
    void testEventSettersAndGetters() {
        // Arrange
        Event event = new Event();
        UUID eventId = UUID.randomUUID();
        String title = "Test Event";
        String desc = "Test Description";
        String cover = "cover.jpg";
        String place = "Test Place";
        Date startDt = new Date();
        Date endDt = new Date();
        Date createDt = new Date();
        String status = "open";
        int capacity = 100;

        // Act
        event.setEventId(eventId);
        event.setEventTitle(title);
        event.setEventDesc(desc);
        event.setEventCover(cover);
        event.setEventPlace(place);
        event.setEventStartDt(startDt);
        event.setEventEndDt(endDt);
        event.setEventCreateDt(createDt);
        event.setEventStatus(status);
        event.setEventCapacity(capacity);

        // Assert
        assertEquals(eventId, event.getEventId());
        assertEquals(title, event.getEventTitle());
        assertEquals(desc, event.getEventDesc());
        assertEquals(cover, event.getEventCover());
        assertEquals(place, event.getEventPlace());
        assertEquals(startDt, event.getEventStartDt());
        assertEquals(endDt, event.getEventEndDt());
        assertEquals(createDt, event.getEventCreateDt());
        assertEquals(status, event.getEventStatus());
        assertEquals(capacity, event.getEventCapacity());
    }

    @Test
    void testEventEqualsAndHashCode() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        Event event1 = Event.builder()
                .eventId(eventId)
                .eventTitle("Test Event")
                .build();

        Event event2 = Event.builder()
                .eventId(eventId)
                .eventTitle("Test Event")
                .build();

        Event event3 = Event.builder()
                .eventId(UUID.randomUUID())
                .eventTitle("Different Event")
                .build();

        // Assert
        assertEquals(event1, event2);
        assertNotEquals(event1, event3);
        assertEquals(event1.hashCode(), event2.hashCode());
        assertNotEquals(event1.hashCode(), event3.hashCode());
    }

    @Test
    void testEventToString() {
        // Arrange
        Event event = Event.builder()
                .eventId(UUID.randomUUID())
                .eventTitle("Test Event")
                .build();

        // Act
        String toString = event.toString();

        // Assert
        assertTrue(toString.contains("Test Event"));
        assertTrue(toString.contains("eventId"));
    }
} 