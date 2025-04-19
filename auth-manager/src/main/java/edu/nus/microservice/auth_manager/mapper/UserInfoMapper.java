package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.CreateUserRequest;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.dto.UserResponse;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.enums.UserStatus;
import edu.nus.microservice.auth_manager.enums.UserRoles;
import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserInfoMapper {

    private final PasswordEncoder passwordEncoder;

    public UserInfoEntity mapUserRegistrationToUserInfoEntity(UserRegistrationRequest userRegistrationRequest) {
        UserInfoEntity userInfoEntity = new UserInfoEntity();
        userInfoEntity.setId(UUID.randomUUID());
        userInfoEntity.setUsername(userRegistrationRequest.getUserName());
        userInfoEntity.setEmailAddress(userRegistrationRequest.getUserEmail());
        userInfoEntity.setMobileNumber(userRegistrationRequest.getUserMobileNo());
        userInfoEntity.setRoles(userRegistrationRequest.getUserRole());
        userInfoEntity.setCreateDatetime(LocalDateTime.now());
        userInfoEntity.setActiveStatus("ACTIVE");
        userInfoEntity.setPassword(passwordEncoder.encode(userRegistrationRequest.getUserPassword()));
        return userInfoEntity;
    }


    public UserResponse convertToUserResponse(UserInfoEntity userInfo){
        return UserResponse.builder()
                .userId(userInfo.getId())
                .userName(userInfo.getUsername())
                .activeStatus(userInfo.getActiveStatus())
                .roles(userInfo.getRoles())
                .emailAddress(userInfo.getEmailAddress())
                .createDatetime(userInfo.getCreateDatetime())
                .build();

    }

    public UserInfoEntity mapUserRequestToUserInfoEntity(CreateUserRequest userRequest){
        UserInfoEntity userInfoEntity = new UserInfoEntity();
        userInfoEntity.setId(UUID.randomUUID());
        userInfoEntity.setUsername(userRequest.getUsername());
        userInfoEntity.setEmailAddress(userRequest.getEmailAddress());
        userInfoEntity.setMobileNumber(userRequest.getMobileNumber());
        userInfoEntity.setRoles(UserRoles.END_USER.name());
        userInfoEntity.setCreateDatetime(LocalDateTime.now());
        userInfoEntity.setActiveStatus("ACTIVE");
        userInfoEntity.setPassword(passwordEncoder.encode("p@ssword123"));
        return userInfoEntity;
    }

    public UserInfoEntity mapGoogleUserToUserInfoEntity(String email, String name ){
        UserInfoEntity userInfoEntity = new UserInfoEntity();
        userInfoEntity.setId(UUID.randomUUID());
        userInfoEntity.setUsername(name);
        userInfoEntity.setEmailAddress(email);
        userInfoEntity.setMobileNumber("00000000");
        userInfoEntity.setRoles(UserRoles.END_USER.name());
        userInfoEntity.setCreateDatetime(LocalDateTime.now());
        userInfoEntity.setActiveStatus(UserStatus.ACTIVE.name());
        userInfoEntity.setPassword(passwordEncoder.encode("p@ssword123"));
        return userInfoEntity;
    }
}