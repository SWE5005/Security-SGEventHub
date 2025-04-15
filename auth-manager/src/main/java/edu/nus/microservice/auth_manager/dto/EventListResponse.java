package edu.nus.microservice.auth_manager.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventListResponse {
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
}
