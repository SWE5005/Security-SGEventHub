package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.model.UserDetailModel;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.impl.UserInfoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserInfoServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserInfoServiceImpl userInfoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loadUserByUsername_Success() {
        // Arrange
        String email = "test@example.com";
        UserInfoEntity userInfoEntity = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .emailAddress(email)
                .password("password")
                .roles("USER")
                .build();

        when(userRepository.findByEmailAddress(email)).thenReturn(Optional.of(userInfoEntity));

        // Act
        UserDetails userDetails = userInfoService.loadUserByUsername(email);

        // Assert
        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_UserNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        when(userRepository.findByEmailAddress(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userInfoService.loadUserByUsername(email));
    }

    @Test
    void loadUserByUsername_Exception() {
        // Arrange
        String email = "test@example.com";
        when(userRepository.findByEmailAddress(email)).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userInfoService.loadUserByUsername(email));
    }

    @Test
    void loadUserByUsername_NullEmail() {
        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userInfoService.loadUserByUsername(null));
    }

    @Test
    void loadUserByUsername_EmptyEmail() {
        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userInfoService.loadUserByUsername(""));
    }
} 