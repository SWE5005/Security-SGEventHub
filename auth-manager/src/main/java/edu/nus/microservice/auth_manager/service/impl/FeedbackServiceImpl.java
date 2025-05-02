package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.dto.FeedbackDetailResponse;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.entity.FeedbackEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.FeedbackMapper;
import edu.nus.microservice.auth_manager.repository.FeedbackRepository;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

  @Autowired
  private final FeedbackRepository feedbackRepository;

  @Autowired final UserRepository userRepository;

  private final FeedbackMapper feedbackMapper;

  public String createFeedback(FeedbackRequest request, String userId){
    try {
      Optional<UserInfoEntity> user = userRepository.findById(UUID.fromString(userId));
      FeedbackEntity feedback = feedbackMapper.convertToFeedbackEntity(request,user.get());
      feedbackRepository.save(feedback);
      return "Create feedback successfully.";
    }catch (Exception e){
      log.error("[FeedbackService:createFeedback]:Failed to create feedback.", e);
      throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, "Error:" + e);
    }
  }

  public List<FeedbackDetailResponse> getFeedbackByEventId(String eventId) {
    UUID id = UUID.fromString(eventId);
    List<FeedbackEntity> feedbackList = feedbackRepository.findByEventId(id);
    return feedbackList.stream().map(feedbackMapper::convertToFeedbackResponse).toList();
  }

}
