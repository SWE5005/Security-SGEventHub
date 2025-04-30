package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.TokenType;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.service.impl.AuthServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AuthControllerTest {

    @Mock
    private AuthServiceImpl authService;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletResponse response;

    @Mock
    private HttpServletRequest request;

    @Mock
    private BindingResult bindingResult;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void signIn_ShouldReturnTokens_WhenAuthenticationIsValid() {
        // Arrange
        when(authentication.getName()).thenReturn("test@example.com");
        AuthResponse mockResponse = AuthResponse.builder()
            .accessToken("mock-access-token")
            .accessTokenExpiry(300)
            .userName("testuser")
            .emailAddress("test@example.com")
            .userRole("USER")
            .tokenType(TokenType.Bearer)
            .build();
        when(authService.getJwtTokensAfterAuthentication(any(), any()))
            .thenReturn(mockResponse);

        // Act
        ResponseEntity<?> response = authController.authenticateUser(authentication, this.response);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        verify(authService, times(1)).getJwtTokensAfterAuthentication(any(), any());
    }

    @Test
    void registerUser_ShouldReturnSuccess_WhenRequestIsValid() {
        // Arrange
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUserEmail("test@example.com");
        when(bindingResult.hasErrors()).thenReturn(false);
        AuthResponse mockResponse = AuthResponse.builder()
            .accessToken("mock-access-token")
            .accessTokenExpiry(1800)
            .userName("testuser")
            .emailAddress("test@example.com")
            .userRole("USER")
            .tokenType(TokenType.Bearer)
            .build();
        when(authService.registerUser(any())).thenReturn(mockResponse);

        // Act
        ResponseEntity<?> response = authController.registerUser(request, bindingResult);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        verify(authService, times(1)).registerUser(any());
    }

    @Test
    void registerUser_ShouldReturnBadRequest_WhenRequestIsInvalid() {
        // Arrange
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUserEmail("test@example.com");
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getAllErrors()).thenReturn(List.of());

        // Act
        ResponseEntity<?> response = authController.registerUser(request, bindingResult);

        // Assert
        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
        verify(authService, never()).registerUser(any());
    }

    @Test
    void refreshToken_ShouldReturnNewToken_WhenRefreshTokenIsValid() {
        // Arrange
        Cookie refreshTokenCookie = new Cookie("refresh_token", "valid-refresh-token");
        when(request.getCookies()).thenReturn(new Cookie[]{refreshTokenCookie});
        AuthResponse mockResponse = AuthResponse.builder()
            .accessToken("mock-access-token")
            .accessTokenExpiry(300)
            .userName("testuser")
            .emailAddress("test@example.com")
            .userRole("USER")
            .tokenType(TokenType.Bearer)
            .build();
        when(authService.getAccessTokenUsingRefreshToken(any())).thenReturn(mockResponse);

        // Act
        ResponseEntity<?> response = authController.getAccessToken(request);

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        verify(authService, times(1)).getAccessTokenUsingRefreshToken(any());
    }

    @Test
    void testAuthenticateUser() {
        when(authService.getJwtTokensAfterAuthentication(any(Authentication.class), any(HttpServletResponse.class)))
                .thenReturn(AuthResponse.builder().accessToken("mock-token").build());
        ResponseEntity<?> result = authController.authenticateUser(authentication, response);
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    void testAuthenticateGoogleUser() {
        when(authService.getJwtTokensAfterAuthentication(any(Authentication.class), any(HttpServletResponse.class)))
                .thenReturn(AuthResponse.builder().accessToken("mock-token").build());
        ResponseEntity<?> result = authController.authenticateGoogleUser(authentication, response);
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    void testRegisterUser_Valid() {
        UserRegistrationRequest req = new UserRegistrationRequest();
        when(bindingResult.hasErrors()).thenReturn(false);
        when(authService.registerUser(any(UserRegistrationRequest.class))).thenReturn(AuthResponse.builder().accessToken("mock-register").build());
        ResponseEntity<?> result = authController.registerUser(req, bindingResult);
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
    }

    @Test
    void testRegisterUser_Invalid() {
        UserRegistrationRequest req = new UserRegistrationRequest();
        when(bindingResult.hasErrors()).thenReturn(true);
        ResponseEntity<?> result = authController.registerUser(req, bindingResult);
        assertEquals(400, result.getStatusCodeValue());
    }

    @Test
    void testGetAccessToken() {
        when(request.getCookies()).thenReturn(null);
        when(authService.getAccessTokenUsingRefreshToken(any())).thenReturn(AuthResponse.builder().accessToken("mock-access").build());
        ResponseEntity<?> result = authController.getAccessToken(request);
        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
    }
} 