package edu.nus.microservice.auth_manager.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDetailResponse {

  private UUID id;
  private UUID eventId;
  private int rating;
  private LocalDateTime createDatetime;
  private String comment;
  private EventDetailUser user;
}
