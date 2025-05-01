package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.service.ManageUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ManageUserControllerTest {
    @Mock
    private ManageUserService manageUserService;
    @Mock
    private Principal principal;
    @InjectMocks
    private ManageUserController manageUserController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllEventUsers_ShouldReturnOk() {
        when(principal.getName()).thenReturn("testuser");
        when(manageUserService.getAllUsers()).thenReturn(java.util.Collections.emptyList());
        ResponseEntity<?> response = manageUserController.getAllEventUsers(principal);
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void getAllEventUsers_ShouldReturnError() {
        when(principal.getName()).thenReturn("testuser");
        when(manageUserService.getAllUsers()).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = manageUserController.getAllEventUsers(principal);
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void createUser_ShouldReturnOk() {
        CreateUserRequest req = new CreateUserRequest();
        UserResponse userResponse = UserResponse.builder()
                .userId(UUID.randomUUID())
                .userName("testuser")
                .emailAddress("test@example.com")
                .build();
        when(manageUserService.createUser(any())).thenReturn(userResponse);
        ResponseEntity<?> response = manageUserController.createUser(req);
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void createUser_ShouldReturnError() {
        CreateUserRequest req = new CreateUserRequest();
        when(manageUserService.createUser(any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = manageUserController.createUser(req);
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void getUserDetails_ShouldReturnOk() {
        when(principal.getName()).thenReturn("testuser");
        UserResponse userResponse = UserResponse.builder()
                .userId(UUID.randomUUID())
                .userName("testuser")
                .emailAddress("test@example.com")
                .build();
        when(manageUserService.getUserDetails(any())).thenReturn(userResponse);
        ResponseEntity<?> response = manageUserController.getUserDetails(principal, "userId");
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void getUserDetails_ShouldReturnError() {
        when(principal.getName()).thenReturn("testuser");
        when(manageUserService.getUserDetails(any())).thenThrow(new RuntimeException("fail"));
        ResponseEntity<?> response = manageUserController.getUserDetails(principal, "userId");
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void updateUser_ShouldReturnOk() {
        when(principal.getName()).thenReturn("testuser");
        when(manageUserService.updateUser(any())).thenReturn("ok");
        ManageUserRequest req = new ManageUserRequest();
        ResponseEntity<?> response = manageUserController.updateUser(principal, req);
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void updateUser_ShouldReturnError() {
        when(principal.getName()).thenReturn("testuser");
        when(manageUserService.updateUser(any())).thenThrow(new RuntimeException("fail"));
        ManageUserRequest req = new ManageUserRequest();
        ResponseEntity<?> response = manageUserController.updateUser(principal, req);
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }

    @Test
    void deleteUser_ShouldReturnOk() {
        doNothing().when(manageUserService).deleteUser(any());
        ResponseEntity<?> response = manageUserController.deleteUser("userId");
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void deleteUser_ShouldReturnError() {
        doThrow(new RuntimeException("fail")).when(manageUserService).deleteUser(any());
        ResponseEntity<?> response = manageUserController.deleteUser("userId");
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getStatusCodeValue());
    }
} 