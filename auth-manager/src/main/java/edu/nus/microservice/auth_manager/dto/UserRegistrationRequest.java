package edu.nus.microservice.auth_manager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationRequest {
    @NotEmpty(message = "User Name is required")
    String userName;

    String userMobileNo;

    @NotEmpty(message = "User email is required")
    @Email(message = "Invalid email format")
    String userEmail;

    @NotEmpty(message = "User password is required")
    String userPassword;

    @NotEmpty(message = "User role is required")
    String userRole;
}

