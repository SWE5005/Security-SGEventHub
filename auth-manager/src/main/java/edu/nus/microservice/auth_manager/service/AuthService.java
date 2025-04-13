package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public interface AuthService {
    AuthResponse getJwtTokensAfterAuthentication(Authentication authentication, HttpServletResponse response);
    AuthResponse registerUser(UserRegistrationRequest userRegistrationRequest);
}
