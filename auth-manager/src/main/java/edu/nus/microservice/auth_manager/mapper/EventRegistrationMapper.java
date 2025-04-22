package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.EventDetailUser;
import edu.nus.microservice.auth_manager.entity.EventEntity;
import edu.nus.microservice.auth_manager.entity.EventRegistrationEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventRegistrationMapper {

  public EventRegistrationEntity convertToEventRegistration(
    EventEntity event,
    UserInfoEntity user
  ) {
    return EventRegistrationEntity
      .builder()
      .id(UUID.randomUUID())
      .event(event)
      .user(user)
      .registerDatetime(LocalDateTime.now())
      .build();
  }

  public static EventDetailUser convertToEventDetailUser(
    EventRegistrationEntity registration
  ) {
    return EventDetailUser
      .builder()
      .userId(registration.user.getId())
      .emailAddress(registration.user.getEmailAddress())
      .build();
  }
}
