package edu.nus.microservice.auth_manager.service;


import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;

import java.util.List;

public interface EventService {
    List<EventListResponse> getAllEvents(String userEmail);
    EventEntity createEvent(EventRequest eventRequest, String userId);
}
