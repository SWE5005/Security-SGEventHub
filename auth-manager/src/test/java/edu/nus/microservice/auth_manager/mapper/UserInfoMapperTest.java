package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserInfoMapperTest {
    private UserInfoMapper userInfoMapper;
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode(any())).thenReturn("encoded-password");
        userInfoMapper = new UserInfoMapper(passwordEncoder);
    }

    @Test
    void mapUserRegistrationToUserInfoEntity_ShouldMapFields() {
        UserRegistrationRequest req = UserRegistrationRequest.builder()
                .userName("testuser")
                .userEmail("test@example.com")
                .userPassword("password")
                .userRole("USER")
                .build();
        UserInfoEntity entity = userInfoMapper.mapUserRegistrationToUserInfoEntity(req);
        assertNotNull(entity);
        assertEquals("testuser", entity.getUsername());
        assertEquals("test@example.com", entity.getEmailAddress());
        assertEquals("USER", entity.getRoles());
        assertEquals("encoded-password", entity.getPassword());
    }

    @Test
    void mapUserRequestToUserInfoEntity_ShouldMapFields() {
        CreateUserRequest req = CreateUserRequest.builder()
                .userName("testuser")
                .emailAddress("test@example.com")
                .mobileNumber("1234567890")
                .build();
        UserInfoEntity entity = userInfoMapper.mapUserRequestToUserInfoEntity(req);
        assertNotNull(entity);
        assertEquals("testuser", entity.getUsername());
        assertEquals("test@example.com", entity.getEmailAddress());
        assertEquals("encoded-password", entity.getPassword());
    }

    @Test
    void mapGoogleUserToUserInfoEntity_ShouldMapFields() {
        UserInfoEntity entity = userInfoMapper.mapGoogleUserToUserInfoEntity("test@example.com", "testuser");
        assertNotNull(entity);
        assertEquals("testuser", entity.getUsername());
        assertEquals("test@example.com", entity.getEmailAddress());
        assertEquals("encoded-password", entity.getPassword());
    }

    @Test
    void convertToUserResponse_ShouldMapFields() {
        UserInfoEntity entity = UserInfoEntity.builder()
                .id(java.util.UUID.randomUUID())
                .username("testuser")
                .emailAddress("test@example.com")
                .mobileNumber("1234567890")
                .activeStatus("ACTIVE")
                .roles("USER")
                .build();
        UserResponse response = userInfoMapper.convertToUserResponse(entity);
        assertNotNull(response);
        assertEquals("testuser", response.getUserName());
        assertEquals("test@example.com", response.getEmailAddress());
        assertEquals("USER", response.getRoles());
        assertEquals("ACTIVE", response.getActiveStatus());
    }

    @Test
    void mapUserRegistrationToUserInfoEntity_ShouldHandleNullRequest() {
        assertThrows(NullPointerException.class, () -> userInfoMapper.mapUserRegistrationToUserInfoEntity(null));
    }

    @Test
    void mapUserRequestToUserInfoEntity_ShouldHandleNullRequest() {
        assertThrows(NullPointerException.class, () -> userInfoMapper.mapUserRequestToUserInfoEntity(null));
    }

    @Test
    void mapGoogleUserToUserInfoEntity_ShouldHandleNulls() {
        assertDoesNotThrow(() -> userInfoMapper.mapGoogleUserToUserInfoEntity(null, "name"));
        assertDoesNotThrow(() -> userInfoMapper.mapGoogleUserToUserInfoEntity("email", null));
    }

    @Test
    void convertToUserResponse_ShouldHandleNullEntity() {
        assertThrows(NullPointerException.class, () -> userInfoMapper.convertToUserResponse(null));
    }

    @Test
    void mapUserRegistrationToUserInfoEntity_ShouldHandlePartialNullFields() {
        UserRegistrationRequest req = UserRegistrationRequest.builder()
                .userName(null)
                .userEmail(null)
                .userPassword(null)
                .userRole(null)
                .userMobileNo(null)
                .build();
        assertDoesNotThrow(() -> userInfoMapper.mapUserRegistrationToUserInfoEntity(req));
    }

    @Test
    void mapUserRequestToUserInfoEntity_ShouldHandlePartialNullFields() {
        CreateUserRequest req = CreateUserRequest.builder()
                .userName(null)
                .emailAddress(null)
                .mobileNumber(null)
                .build();
        assertDoesNotThrow(() -> userInfoMapper.mapUserRequestToUserInfoEntity(req));
    }

    @Test
    void mapGoogleUserToUserInfoEntity_ShouldHandleEmptyStrings() {
        assertDoesNotThrow(() -> userInfoMapper.mapGoogleUserToUserInfoEntity("", ""));
    }

    @Test
    void convertToUserResponse_ShouldHandlePartialNullFields() {
        UserInfoEntity entity = UserInfoEntity.builder()
                .id(java.util.UUID.randomUUID())
                .username(null)
                .emailAddress(null)
                .mobileNumber(null)
                .activeStatus(null)
                .roles(null)
                .build();
        assertDoesNotThrow(() -> userInfoMapper.convertToUserResponse(entity));
    }
} 