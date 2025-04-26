package edu.nus.microservice.event_manager.dto;

import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class EventRequestTest {

    @Test
    void testEventRequestBuilder() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        String title = "Test Event";
        String desc = "Test Description";
        String cover = "cover.jpg";
        String place = "Test Place";
        Date startDt = new Date();
        Date endDt = new Date();
        String status = "open";
        int capacity = 100;

        // Act
        EventRequest request = EventRequest.builder()
                .eventId(eventId)
                .eventTitle(title)
                .eventDesc(desc)
                .eventCover(cover)
                .eventPlace(place)
                .eventStartDt(startDt)
                .eventEndDt(endDt)
                .eventStatus(status)
                .eventCapacity(capacity)
                .build();

        // Assert
        assertNotNull(request);
        assertEquals(eventId, request.getEventId());
        assertEquals(title, request.getEventTitle());
        assertEquals(desc, request.getEventDesc());
        assertEquals(cover, request.getEventCover());
        assertEquals(place, request.getEventPlace());
        assertEquals(startDt, request.getEventStartDt());
        assertEquals(endDt, request.getEventEndDt());
        assertEquals(status, request.getEventStatus());
        assertEquals(capacity, request.getEventCapacity());
    }

    @Test
    void testEventRequestSettersAndGetters() {
        // Arrange
        EventRequest request = new EventRequest();
        UUID eventId = UUID.randomUUID();
        String title = "Test Event";
        String desc = "Test Description";
        String cover = "cover.jpg";
        String place = "Test Place";
        Date startDt = new Date();
        Date endDt = new Date();
        String status = "open";
        int capacity = 100;

        // Act
        request.setEventId(eventId);
        request.setEventTitle(title);
        request.setEventDesc(desc);
        request.setEventCover(cover);
        request.setEventPlace(place);
        request.setEventStartDt(startDt);
        request.setEventEndDt(endDt);
        request.setEventStatus(status);
        request.setEventCapacity(capacity);

        // Assert
        assertEquals(eventId, request.getEventId());
        assertEquals(title, request.getEventTitle());
        assertEquals(desc, request.getEventDesc());
        assertEquals(cover, request.getEventCover());
        assertEquals(place, request.getEventPlace());
        assertEquals(startDt, request.getEventStartDt());
        assertEquals(endDt, request.getEventEndDt());
        assertEquals(status, request.getEventStatus());
        assertEquals(capacity, request.getEventCapacity());
    }

    @Test
    void testEventRequestEqualsAndHashCode() {
        // Arrange
        UUID eventId = UUID.randomUUID();
        EventRequest request1 = EventRequest.builder()
                .eventId(eventId)
                .eventTitle("Test Event")
                .build();

        EventRequest request2 = EventRequest.builder()
                .eventId(eventId)
                .eventTitle("Test Event")
                .build();

        EventRequest request3 = EventRequest.builder()
                .eventId(UUID.randomUUID())
                .eventTitle("Different Event")
                .build();

        // Assert
        assertEquals(request1, request2);
        assertNotEquals(request1, request3);
        assertEquals(request1.hashCode(), request2.hashCode());
        assertNotEquals(request1.hashCode(), request3.hashCode());
    }

    @Test
    void testEventRequestToString() {
        // Arrange
        EventRequest request = EventRequest.builder()
                .eventId(UUID.randomUUID())
                .eventTitle("Test Event")
                .build();

        // Act
        String toString = request.toString();

        // Assert
        assertTrue(toString.contains("Test Event"));
        assertTrue(toString.contains("eventId"));
    }
} 