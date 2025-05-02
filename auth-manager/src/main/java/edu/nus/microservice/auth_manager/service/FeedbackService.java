package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.FeedbackDetailResponse;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;

import java.util.List;

public interface FeedbackService {
  String createFeedback(FeedbackRequest request, String userId);
  List<FeedbackDetailResponse> getFeedbackByEventId(String eventId);
}
