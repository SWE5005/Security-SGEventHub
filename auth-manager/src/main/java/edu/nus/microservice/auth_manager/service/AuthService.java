package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import org.springframework.security.core.Authentication;

public interface AuthService {
    AuthResponse getJwtTokensAfterAuthentication(Authentication authentication);
    AuthResponse registerUser(UserRegistrationRequest userRegistrationRequest);
}
