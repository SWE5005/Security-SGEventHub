package edu.nus.microservice.auth_manager.mapper;

import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class UserInfoMapper {

    private final PasswordEncoder passwordEncoder;

    public UserInfoEntity mapUserRegistrationToUserInfoEntity(UserRegistrationRequest userRegistrationRequest) {
        UserInfoEntity userInfoEntity = new UserInfoEntity();
        userInfoEntity.setUsername(userRegistrationRequest.getUserName());
        userInfoEntity.setEmailAddress(userRegistrationRequest.getUserEmail());
        userInfoEntity.setMobileNumber(userRegistrationRequest.getUserMobileNo());
        userInfoEntity.setRoles(userRegistrationRequest.getUserRole());
        userInfoEntity.setCreateDateTime(LocalDateTime.now());
        userInfoEntity.setActiveStatus("ACTIVE");
        userInfoEntity.setPassword(passwordEncoder.encode(userRegistrationRequest.getUserPassword()));
        return userInfoEntity;
    }
}