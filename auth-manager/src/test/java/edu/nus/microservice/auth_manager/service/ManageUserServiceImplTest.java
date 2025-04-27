package edu.nus.microservice.auth_manager.service;

import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.repository.UserInfoRepository;
import edu.nus.microservice.auth_manager.service.impl.ManageUserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ManageUserServiceImplTest {

    @Mock
    private UserInfoRepository userInfoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ManageUserServiceImpl manageUserService;

    private UserInfoEntity mockUser;
    private CreateUserRequest createUserRequest;
    private ManageUserRequest manageUserRequest;

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

        // Setup create user request
        createUserRequest = new CreateUserRequest();
        createUserRequest.setUsername("newUser");
        createUserRequest.setPassword("password123");
        createUserRequest.setEmailAddress("new@example.com");
        createUserRequest.setMobileNumber("9876543210");
        createUserRequest.setRoles("USER");

        // Setup manage user request
        manageUserRequest = new ManageUserRequest();
        manageUserRequest.setUserId(mockUser.getId().toString());
        manageUserRequest.setUsername("updatedUser");
        manageUserRequest.setEmailAddress("updated@example.com");
        manageUserRequest.setMobileNumber("5555555555");
        manageUserRequest.setRoles("ADMIN");
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        when(userInfoRepository.findAll()).thenReturn(Arrays.asList(mockUser));

        List<UserResponse> result = manageUserService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(mockUser.getUsername(), result.get(0).getUsername());
        verify(userInfoRepository, times(1)).findAll();
    }

    @Test
    void getUserDetails_ShouldReturnUserWhenExists() {
        when(userInfoRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));

        UserResponse result = manageUserService.getUserDetails(mockUser.getId().toString());

        assertNotNull(result);
        assertEquals(mockUser.getUsername(), result.getUsername());
        verify(userInfoRepository, times(1)).findById(any(UUID.class));
    }

    @Test
    void getUserDetails_ShouldThrowExceptionWhenUserNotFound() {
        when(userInfoRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            manageUserService.getUserDetails(mockUser.getId().toString())
        );
    }

    @Test
    void findByEmail_ShouldReturnUserWhenExists() {
        when(userInfoRepository.findByEmailAddress(anyString())).thenReturn(Optional.of(mockUser));

        Optional<UserInfoEntity> result = manageUserService.findByEmail(mockUser.getEmailAddress());

        assertTrue(result.isPresent());
        assertEquals(mockUser.getEmailAddress(), result.get().getEmailAddress());
        verify(userInfoRepository, times(1)).findByEmailAddress(anyString());
    }

    @Test
    void createUser_ShouldCreateNewUser() {
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userInfoRepository.save(any(UserInfoEntity.class))).thenReturn(mockUser);

        UserResponse result = manageUserService.createUser(createUserRequest);

        assertNotNull(result);
        assertEquals(createUserRequest.getUsername(), result.getUsername());
        verify(passwordEncoder, times(1)).encode(anyString());
        verify(userInfoRepository, times(1)).save(any(UserInfoEntity.class));
    }

    @Test
    void updateUser_ShouldUpdateExistingUser() {
        when(userInfoRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));
        when(userInfoRepository.save(any(UserInfoEntity.class))).thenReturn(mockUser);

        String result = manageUserService.updateUser(manageUserRequest);

        assertNotNull(result);
        assertEquals(mockUser.getId().toString(), result);
        verify(userInfoRepository, times(1)).findById(any(UUID.class));
        verify(userInfoRepository, times(1)).save(any(UserInfoEntity.class));
    }

    @Test
    void deleteUser_ShouldDeleteExistingUser() {
        when(userInfoRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockUser));
        doNothing().when(userInfoRepository).deleteById(any(UUID.class));

        manageUserService.deleteUser(mockUser.getId().toString());

        verify(userInfoRepository, times(1)).findById(any(UUID.class));
        verify(userInfoRepository, times(1)).deleteById(any(UUID.class));
    }
} 