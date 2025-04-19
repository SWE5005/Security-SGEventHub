package edu.nus.microservice.auth_manager.service;


import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;

import java.util.List;
import java.util.Optional;

public interface ManageUserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserDetails(String userId);
    Optional<UserInfoEntity> findByEmail(String emailAddress);
    UserResponse createUser(CreateUserRequest userRequest);
    void saveUser(UserInfoEntity userInfo);
    void deleteUser(String userId);
    String updateUser(ManageUserRequest userRequest);
}
