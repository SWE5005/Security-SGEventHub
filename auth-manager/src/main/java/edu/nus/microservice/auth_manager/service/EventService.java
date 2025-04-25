package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.EventDetailResponse;
import edu.nus.microservice.auth_manager.dto.EventListResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import java.util.List;

public interface EventService {
  List<EventListResponse> getAllEvents(String userEmail);
  EventDetailResponse getEventDetails(String eventId, String userId);
  EventDetailResponse createEvent(EventRequest eventRequest, String userId);
  String registerEvent(String eventId, String userId);
}
