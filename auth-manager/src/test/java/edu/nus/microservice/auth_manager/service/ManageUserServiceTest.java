package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.impl.ManageUserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ManageUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserInfoMapper userInfoMapper;

    @InjectMocks
    private ManageUserServiceImpl manageUserService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers_Success() {
        // Arrange
        UUID userId1 = UUID.randomUUID();
        UUID userId2 = UUID.randomUUID();
        UserInfoEntity user1 = UserInfoEntity.builder()
                .id(userId1)
                .username("user1")
                .emailAddress("user1@example.com")
                .build();
        UserInfoEntity user2 = UserInfoEntity.builder()
                .id(userId2)
                .username("user2")
                .emailAddress("user2@example.com")
                .build();

        UserResponse response1 = UserResponse.builder()
                .userId(userId1)
                .userName(user1.getUsername())
                .emailAddress(user1.getEmailAddress())
                .build();
        UserResponse response2 = UserResponse.builder()
                .userId(userId2)
                .userName(user2.getUsername())
                .emailAddress(user2.getEmailAddress())
                .build();

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));
        when(userInfoMapper.convertToUserResponse(user1)).thenReturn(response1);
        when(userInfoMapper.convertToUserResponse(user2)).thenReturn(response2);

        // Act
        List<UserResponse> result = manageUserService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(userId1, result.get(0).getUserId());
        assertEquals(userId2, result.get(1).getUserId());
    }

    @Test
    void getAllUsers_EmptyList() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<UserResponse> result = manageUserService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void createUser_Success() {
        // Arrange
        CreateUserRequest request = CreateUserRequest.builder()
                .userName("newuser")
                .emailAddress("newuser@example.com")
                .mobileNumber("1234567890")
                .build();

        UUID userId = UUID.randomUUID();
        UserInfoEntity userEntity = UserInfoEntity.builder()
                .id(userId)
                .username(request.getUserName())
                .emailAddress(request.getEmailAddress())
                .build();

        UserResponse expectedResponse = UserResponse.builder()
                .userId(userId)
                .userName(userEntity.getUsername())
                .emailAddress(userEntity.getEmailAddress())
                .build();

        when(userInfoMapper.mapUserRequestToUserInfoEntity(request)).thenReturn(userEntity);
        when(userRepository.save(userEntity)).thenReturn(userEntity);
        when(userInfoMapper.convertToUserResponse(userEntity)).thenReturn(expectedResponse);

        // Act
        UserResponse result = manageUserService.createUser(request);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(userEntity.getUsername(), result.getUserName());
        assertEquals(userEntity.getEmailAddress(), result.getEmailAddress());
    }

    @Test
    void createUser_Exception() {
        // Arrange
        CreateUserRequest request = CreateUserRequest.builder()
                .userName("newuser")
                .emailAddress("newuser@example.com")
                .mobileNumber("1234567890")
                .build();

        when(userInfoMapper.mapUserRequestToUserInfoEntity(request)).thenThrow(new RuntimeException("Mapping error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> manageUserService.createUser(request));
    }

    @Test
    void getUserDetails_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UserInfoEntity userEntity = UserInfoEntity.builder()
                .id(userId)
                .username("testuser")
                .emailAddress("test@example.com")
                .roles("USER")
                .build();

        UserResponse expectedResponse = UserResponse.builder()
                .userId(userId)
                .userName(userEntity.getUsername())
                .emailAddress(userEntity.getEmailAddress())
                .roles(userEntity.getRoles())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(userEntity));
        when(userInfoMapper.convertToUserResponse(userEntity)).thenReturn(expectedResponse);

        // Act
        UserResponse result = manageUserService.getUserDetails(userId.toString());

        // Assert
        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(userEntity.getUsername(), result.getUserName());
        assertEquals(userEntity.getEmailAddress(), result.getEmailAddress());
        assertEquals(userEntity.getRoles(), result.getRoles());
    }

    @Test
    void getUserDetails_UserNotFound() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> manageUserService.getUserDetails(userId.toString()));
    }

    @Test
    void findByEmail_Success() {
        // Arrange
        String email = "test@example.com";
        UserInfoEntity userEntity = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .emailAddress(email)
                .build();

        when(userRepository.findByEmailAddress(email)).thenReturn(Optional.of(userEntity));

        // Act
        Optional<UserInfoEntity> result = manageUserService.findByEmail(email);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmailAddress());
    }

    @Test
    void findByEmail_UserNotFound() {
        // Arrange
        String email = "nonexistent@example.com";
        when(userRepository.findByEmailAddress(email)).thenReturn(Optional.empty());

        // Act
        Optional<UserInfoEntity> result = manageUserService.findByEmail(email);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void saveUser_Success() {
        // Arrange
        UserInfoEntity userEntity = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .emailAddress("test@example.com")
                .build();

        when(userRepository.save(userEntity)).thenReturn(userEntity);

        // Act & Assert
        assertDoesNotThrow(() -> manageUserService.saveUser(userEntity));
        verify(userRepository).save(userEntity);
    }

    @Test
    void saveUser_Exception() {
        // Arrange
        UserInfoEntity userEntity = UserInfoEntity.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .emailAddress("test@example.com")
                .build();

        when(userRepository.save(userEntity)).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> manageUserService.saveUser(userEntity));
    }

    @Test
    void updateUser_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        ManageUserRequest request = ManageUserRequest.builder()
                .userId(userId.toString())
                .userName("updateduser")
                .mobileNumber("1234567890")
                .roles("ADMIN")
                .activeStatus("true")
                .build();

        when(userRepository.updateUser(userId, request.getUserName(), request.getMobileNumber(), 
                request.getRoles(), request.getActiveStatus())).thenReturn(1);

        // Act
        String result = manageUserService.updateUser(request);

        // Assert
        assertEquals("Update user successfully.", result);
    }

    @Test
    void updateUser_Failure() {
        // Arrange
        UUID userId = UUID.randomUUID();
        ManageUserRequest request = ManageUserRequest.builder()
                .userId(userId.toString())
                .userName("updateduser")
                .mobileNumber("1234567890")
                .roles("ADMIN")
                .activeStatus("true")
                .build();

        when(userRepository.updateUser(userId, request.getUserName(), request.getMobileNumber(), 
                request.getRoles(), request.getActiveStatus())).thenReturn(0);

        // Act
        String result = manageUserService.updateUser(request);

        // Assert
        assertEquals("Failed to update user.", result);
    }

    @Test
    void updateUser_Exception() {
        // Arrange
        UUID userId = UUID.randomUUID();
        ManageUserRequest request = ManageUserRequest.builder()
                .userId(userId.toString())
                .userName("updateduser")
                .mobileNumber("1234567890")
                .roles("ADMIN")
                .activeStatus("true")
                .build();

        when(userRepository.updateUser(userId, request.getUserName(), request.getMobileNumber(), 
                request.getRoles(), request.getActiveStatus())).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> manageUserService.updateUser(request));
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        UUID userId = UUID.randomUUID();
        doNothing().when(userRepository).deleteById(userId);

        // Act & Assert
        assertDoesNotThrow(() -> manageUserService.deleteUser(userId.toString()));
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUser_Exception() {
        // Arrange
        UUID userId = UUID.randomUUID();
        doThrow(new RuntimeException("Database error")).when(userRepository).deleteById(userId);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> manageUserService.deleteUser(userId.toString()));
    }
} 