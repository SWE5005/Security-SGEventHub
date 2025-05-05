package edu.nus.microservice.auth_manager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    private String userName;

    @NotEmpty(message = "Mobile number is required")
    @Size(min = 8, max = 15, message = "Mobile number must be between 8 and 15 digits")
    @Pattern(regexp = "^[0-9]+$", message = "Mobile number must contain only digits")
    private String userMobileNo;

    @NotEmpty(message = "User email is required")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotEmpty(message = "User password is required")
    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$", message = "Invalid password, your password must be: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
    private String userPassword;

    @NotEmpty(message = "User role is required")
    private String userRole;
}

