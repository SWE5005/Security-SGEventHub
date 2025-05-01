package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.config.jwtConfig.JwtTokenGenerator;
import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.TokenType;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.entity.RefreshTokenEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.repository.RefreshTokenRepo;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepo refreshTokenRepo;

    @Mock
    private UserInfoMapper userInfoMapper;

    @Mock
    private JwtTokenGenerator jwtTokenGenerator;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private AuthServiceImpl authService;

    private UserInfoEntity testUser;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .emailAddress("test@example.com")
                .password("password")
                .roles("USER")
                .build();

        // Create test authentication
        authentication = new UsernamePasswordAuthenticationToken(
            testUser.getEmailAddress(),
            "password",
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + testUser.getRoles()))
        );
    }

    @Test
    void getJwtTokensAfterAuthentication_Success() {
        // Arrange
        when(userRepository.findByEmailAddress(anyString())).thenReturn(Optional.of(testUser));
        when(jwtTokenGenerator.generateAccessToken(any(Authentication.class), any(UserInfoEntity.class)))
                .thenReturn("test-access-token");
        when(jwtTokenGenerator.generateRefreshToken(any(Authentication.class)))
                .thenReturn("test-refresh-token");

        // Act
        AuthResponse response = authService.getJwtTokensAfterAuthentication(authentication, this.response);

        // Assert
        assertNotNull(response);
        assertEquals("test-access-token", response.getAccessToken());
        assertEquals(5 * 60, response.getAccessTokenExpiry());
        assertEquals(testUser.getUsername(), response.getUserName());
        assertEquals(testUser.getEmailAddress(), response.getEmailAddress());
        assertEquals(testUser.getRoles(), response.getUserRole());
        assertEquals(TokenType.Bearer, response.getTokenType());
    }

    @Test
    void getJwtTokensAfterAuthentication_UserNotFound() {
        // Arrange
        when(userRepository.findByEmailAddress(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.getJwtTokensAfterAuthentication(authentication, response));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void registerUser_Success() {
        // Arrange
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .userName("newuser")
                .userEmail("newuser@example.com")
                .userPassword("password")
                .userRole("USER")
                .build();

        when(userRepository.findByEmailAddress(anyString())).thenReturn(Optional.empty());
        when(userInfoMapper.mapUserRegistrationToUserInfoEntity(any())).thenReturn(testUser);
        when(userRepository.save(any(UserInfoEntity.class))).thenReturn(testUser);
        when(jwtTokenGenerator.generateAccessToken(any(Authentication.class), any(UserInfoEntity.class)))
                .thenReturn("test-access-token");

        // Act
        AuthResponse response = authService.registerUser(request);

        // Assert
        assertNotNull(response);
        assertEquals("test-access-token", response.getAccessToken());
        assertEquals(30 * 60, response.getAccessTokenExpiry());
        assertEquals(testUser.getUsername(), response.getUserName());
        assertEquals(testUser.getEmailAddress(), response.getEmailAddress());
        assertEquals(testUser.getRoles(), response.getUserRole());
        assertEquals(TokenType.Bearer, response.getTokenType());
    }

    @Test
    void registerUser_UserAlreadyExists() {
        // Arrange
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .userName("newuser")
                .userEmail("newuser@example.com")
                .userPassword("password")
                .userRole("USER")
                .build();

        when(userRepository.findByEmailAddress(anyString())).thenReturn(Optional.of(testUser));

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.registerUser(request));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void registerUser_InvalidPassword() {
        // Arrange
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .userName("newuser")
                .userEmail("newuser@example.com")
                .userPassword("short")  // Less than 8 characters
                .userRole("USER")
                .build();

        when(userInfoMapper.mapUserRegistrationToUserInfoEntity(any())).thenReturn(null);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.registerUser(request));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void registerUser_InvalidRole() {
        // Arrange
        UserRegistrationRequest request = UserRegistrationRequest.builder()
                .userName("newuser")
                .userEmail("newuser@example.com")
                .userPassword("validpassword123")
                .userRole("INVALID_ROLE")  // Invalid role
                .build();

        when(userInfoMapper.mapUserRegistrationToUserInfoEntity(any())).thenReturn(null);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.registerUser(request));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void getAccessTokenUsingRefreshToken_Success() {
        // Arrange
        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .refreshToken("test-refresh-token")
                .revoked(false)
                .user(testUser)
                .build();

        when(refreshTokenRepo.findByRefreshToken(anyString())).thenReturn(Optional.of(refreshToken));
        when(jwtTokenGenerator.generateAccessToken(any(Authentication.class), any(UserInfoEntity.class)))
                .thenReturn("new-access-token");

        // Act
        AuthResponse response = (AuthResponse) authService.getAccessTokenUsingRefreshToken("test-refresh-token");

        // Assert
        assertNotNull(response);
        assertEquals("new-access-token", response.getAccessToken());
        assertEquals(5 * 60, response.getAccessTokenExpiry());
        assertEquals(testUser.getUsername(), response.getUserName());
        assertEquals(testUser.getEmailAddress(), response.getEmailAddress());
        assertEquals(testUser.getRoles(), response.getUserRole());
        assertEquals(TokenType.Bearer, response.getTokenType());
    }

    @Test
    void getAccessTokenUsingRefreshToken_EmptyToken() {
        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.getAccessTokenUsingRefreshToken(""));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void getAccessTokenUsingRefreshToken_RevokedToken() {
        // Arrange
        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .refreshToken("test-refresh-token")
                .revoked(true)
                .user(testUser)
                .build();

        when(refreshTokenRepo.findByRefreshToken(anyString())).thenReturn(Optional.of(refreshToken));

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.getAccessTokenUsingRefreshToken("test-refresh-token"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void getAccessTokenUsingRefreshToken_TokenNotFound() {
        // Arrange
        when(refreshTokenRepo.findByRefreshToken(anyString())).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.getAccessTokenUsingRefreshToken("test-refresh-token"));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }
} 