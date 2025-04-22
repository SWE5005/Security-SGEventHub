package edu.nus.microservice.auth_manager.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventDetailResponse {

  private UUID id;
  private String title;
  private String description;
  private LocalDateTime createDatetime;
  private LocalDateTime startDatetime;
  private LocalDateTime endDatetime;
  private String location;
  private int capacity;
  private String owner;
  private String status;
  private String cover;
  private long registrationCount;
  private boolean isRegistered;
  private List<EventDetailUser> userList;
}
