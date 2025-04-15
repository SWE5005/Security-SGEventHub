package edu.nus.microservice.auth_manager.service;


import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;

import java.util.List;

public interface ManageUserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserDetails(String userId);
    void deleteUser(String userId);
    String updateUser(ManageUserRequest userRequest);
}
