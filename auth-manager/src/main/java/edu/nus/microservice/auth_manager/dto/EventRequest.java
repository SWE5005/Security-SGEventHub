package edu.nus.microservice.auth_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventRequest {
    private String title;
    private String description;
    private String startDatetime;
    private String endDatetime;
    private String location;
    private int capacity;
    private String status;
    private String cover;
}
