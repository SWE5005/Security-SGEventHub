package edu.nus.microservice.auth_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest
{
    private String username;
    private String emailAddress;
    private String mobileNumber;
}
