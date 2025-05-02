package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.ManageUserRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.ManageUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ManageUserServiceImpl implements ManageUserService {

    private final UserRepository userRepository;
    private final UserInfoMapper userInfoMapper;

    public List<UserResponse> getAllUsers() {
        List<UserInfoEntity> userList = userRepository.findAll();
        return userList.stream().map(userInfoMapper::convertToUserResponse).toList();
    }

    public UserResponse createUser(CreateUserRequest userRequest) {
        try {
            UserInfoEntity userEntity = userInfoMapper.mapUserRequestToUserInfoEntity(userRequest);

            UserInfoEntity user = userRepository.save(userEntity);
            return userInfoMapper.convertToUserResponse(user);
        } catch (Exception e) {
            log.error("[UserService:createUser]Failed to create user: ", e);
            throw new RuntimeException(e);
        }
    }

    public UserResponse getUserDetails(String userId) {
        try {
            UUID id = UUID.fromString(userId);
            Optional<UserInfoEntity> userInfo = userRepository.findById(id);

            UserInfoEntity user = userInfo.get();
            return userInfoMapper.convertToUserResponse(user);
        } catch (Exception e) {
            log.error("[UserService:getUserDetails]Failed to get user details: ", e);
            throw new RuntimeException(e);
        }
    }

    public Optional<UserInfoEntity> findByEmail(String emailAddress) {
        try {
            return userRepository.findByEmailAddress(emailAddress);
        } catch (Exception e) {
            log.error("[UserService:findByEmail]Failed to find user: ", e);
            throw new RuntimeException(e);
        }
    }

    public void saveUser(UserInfoEntity userInfo) {
        try {
            userRepository.save(userInfo);
        } catch (Exception e) {
            log.error("[UserService:saveUser]Failed to save user: ", e);
            throw new RuntimeException(e);
        }
    }

    public String updateUser(ManageUserRequest userRequest) {
        try {
            UUID id = UUID.fromString(userRequest.getUserId());
            Integer result = userRepository.updateUser(id, userRequest.getUserName(), userRequest.getMobileNumber(),
                    userRequest.getRoles(), userRequest.getActiveStatus());
            if (result == 0)
                return "Failed to update user.";
            return "Update user successfully.";
        } catch (Exception e) {
            log.error("[UserService:updateUser]Failed to update user details: ", e);
            throw new RuntimeException(e);
        }
    }

    public void deleteUser(String userId) {
        try {
            UUID id = UUID.fromString(userId);
            userRepository.deleteById(id);
        } catch (Exception e) {
            log.error("[UserService:deleteUser]Failed to delete user: ", e);
            throw new RuntimeException(e);
        }
    }
}