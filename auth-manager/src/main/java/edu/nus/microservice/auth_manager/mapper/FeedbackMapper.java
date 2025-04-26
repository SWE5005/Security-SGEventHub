package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.EventDetailUser;
import edu.nus.microservice.auth_manager.dto.FeedbackDetailResponse;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.entity.FeedbackEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FeedbackMapper {

  public FeedbackEntity convertToFeedbackEntity(
    FeedbackRequest feedback,
    UserInfoEntity userInfo
  ) {
    return FeedbackEntity
      .builder()
      .id(UUID.randomUUID())
      .rating(feedback.getRating())
      .comment(feedback.getComment())
      .createDatetime(LocalDateTime.now())
      .eventId(UUID.fromString(feedback.getEventId()))
      .user(userInfo)
      .build();
  }

  public FeedbackDetailResponse convertToFeedbackResponse(
    FeedbackEntity feedback
  ) {
    return FeedbackDetailResponse
      .builder()
      .id(feedback.getId())
      .rating(feedback.getRating())
      .comment(feedback.getComment())
      .createDatetime(feedback.getCreateDatetime())
      .eventId(feedback.getEventId())
      .user(convertToEventDetailUser(feedback.getUser()))
      .build();
  }

  public static EventDetailUser convertToEventDetailUser(
    UserInfoEntity userInfo
  ) {
    return EventDetailUser
      .builder()
      .userId(userInfo.getId())
      .emailAddress(userInfo.getEmailAddress())
      .build();
  }
}
