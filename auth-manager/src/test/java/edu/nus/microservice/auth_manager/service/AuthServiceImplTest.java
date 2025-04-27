package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.LoginRequest;
import edu.nus.microservice.auth_manager.dto.LoginResponse;
import edu.nus.microservice.auth_manager.dto.RefreshTokenRequest;
import edu.nus.microservice.auth_manager.entity.RefreshTokenEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.repository.RefreshTokenRepository;
import edu.nus.microservice.auth_manager.repository.UserInfoRepository;
import edu.nus.microservice.auth_manager.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private UserInfoRepository userInfoRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    private UserInfoEntity mockUser;
    private RefreshTokenEntity mockRefreshToken;
    private LoginRequest loginRequest;
    private RefreshTokenRequest refreshTokenRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup mock user
        mockUser = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testUser")
                .password("encodedPassword")
                .emailAddress("test@example.com")
                .activeStatus("ACTIVE")
                .mobileNumber("1234567890")
                .roles("USER")
                .createDatetime(LocalDateTime.now())
                .build();

        // Setup mock refresh token
        mockRefreshToken = RefreshTokenEntity.builder()
                .id(1L)
                .user(mockUser)
                .refreshToken("mockRefreshToken")
                .revoked(false)
                .build();

        // Setup login request
        loginRequest = new LoginRequest();
        loginRequest.setEmailAddress("test@example.com");
        loginRequest.setPassword("password123");

        // Setup refresh token request
        refreshTokenRequest = new RefreshTokenRequest();
        refreshTokenRequest.setRefreshToken("mockRefreshToken");
    }

    @Test
    void login_ShouldReturnLoginResponseWhenCredentialsAreValid() {
        when(userInfoRepository.findByEmailAddress(anyString())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(refreshTokenRepository.save(any(RefreshTokenEntity.class))).thenReturn(mockRefreshToken);

        LoginResponse result = authService.login(loginRequest);

        assertNotNull(result);
        assertNotNull(result.getAccessToken());
        assertNotNull(result.getRefreshToken());
        assertEquals(mockUser.getUsername(), result.getUsername());
        assertEquals(mockUser.getRoles(), result.getRoles());
        verify(userInfoRepository, times(1)).findByEmailAddress(anyString());
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(refreshTokenRepository, times(1)).save(any(RefreshTokenEntity.class));
    }

    @Test
    void login_ShouldThrowExceptionWhenUserNotFound() {
        when(userInfoRepository.findByEmailAddress(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
        verify(userInfoRepository, times(1)).findByEmailAddress(anyString());
    }

    @Test
    void login_ShouldThrowExceptionWhenPasswordIsInvalid() {
        when(userInfoRepository.findByEmailAddress(anyString())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
        verify(userInfoRepository, times(1)).findByEmailAddress(anyString());
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
    }

    @Test
    void refreshToken_ShouldReturnNewTokensWhenRefreshTokenIsValid() {
        when(refreshTokenRepository.findByRefreshToken(anyString())).thenReturn(Optional.of(mockRefreshToken));
        when(refreshTokenRepository.save(any(RefreshTokenEntity.class))).thenReturn(mockRefreshToken);

        LoginResponse result = authService.refreshToken(refreshTokenRequest);

        assertNotNull(result);
        assertNotNull(result.getAccessToken());
        assertNotNull(result.getRefreshToken());
        assertEquals(mockUser.getUsername(), result.getUsername());
        assertEquals(mockUser.getRoles(), result.getRoles());
        verify(refreshTokenRepository, times(1)).findByRefreshToken(anyString());
        verify(refreshTokenRepository, times(1)).save(any(RefreshTokenEntity.class));
    }

    @Test
    void refreshToken_ShouldThrowExceptionWhenRefreshTokenNotFound() {
        when(refreshTokenRepository.findByRefreshToken(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.refreshToken(refreshTokenRequest));
        verify(refreshTokenRepository, times(1)).findByRefreshToken(anyString());
    }

    @Test
    void refreshToken_ShouldThrowExceptionWhenRefreshTokenIsRevoked() {
        mockRefreshToken.setRevoked(true);
        when(refreshTokenRepository.findByRefreshToken(anyString())).thenReturn(Optional.of(mockRefreshToken));

        assertThrows(RuntimeException.class, () -> authService.refreshToken(refreshTokenRequest));
        verify(refreshTokenRepository, times(1)).findByRefreshToken(anyString());
    }
} 