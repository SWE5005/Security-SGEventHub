package edu.nus.microservice.auth_manager.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private UUID userId;
    private String userName;
    private String emailAddress;
    private String activeStatus;
    private String roles;
    private LocalDateTime createDatetime;
}
