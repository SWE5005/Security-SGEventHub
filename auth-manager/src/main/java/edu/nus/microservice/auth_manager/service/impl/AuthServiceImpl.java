package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.TokenType;
import edu.nus.microservice.auth_manager.config.jwtConfig.JwtTokenGenerator;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Optional;


@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    @Autowired private final UserRepository userRepository;
    private final JwtTokenGenerator jwtTokenGenerator;
    private final UserInfoMapper userInfoMapper;

    public AuthResponse getJwtTokensAfterAuthentication(Authentication authentication) {
        try
        {
            var userInfoEntity = userRepository.findByEmailAddress(authentication.getName())
                    .orElseThrow(()->{
                        log.error("[AuthService:userSignInAuth] User :{} not found",authentication.getName());
                        return new ResponseStatusException(HttpStatus.NOT_FOUND,"USER NOT FOUND ");});


            String accessToken = jwtTokenGenerator.generateAccessToken(authentication);

            log.info("[AuthService:userSignInAuth] Access token for user:{}, has been generated",userInfoEntity.getUsername());
            return  AuthResponse.builder()
                    .accessToken(accessToken)
                    .accessTokenExpiry(30 * 60)
                    .userName(userInfoEntity.getUsername())
                    .tokenType(TokenType.Bearer)
                    .build();


        }catch (Exception e){
            log.error("[AuthService:userSignInAuth]Exception while authenticating the user due to :"+e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Please Try Again");
        }
    }

    private static Authentication createAuthenticationObject(UserInfoEntity userInfoEntity) {
        // Extract user details from UserInfoEntity
        String username = userInfoEntity.getEmailAddress();
        String password = userInfoEntity.getPassword();
        String roles = userInfoEntity.getRoles();

        // Extract authorities from roles (comma-separated)
        String[] roleArray = roles.split(",");
        GrantedAuthority[] authorities = Arrays.stream(roleArray)
                .map(role -> (GrantedAuthority) role::trim)
                .toArray(GrantedAuthority[]::new);

        return new UsernamePasswordAuthenticationToken(username, password, Arrays.asList(authorities));
    }

    public AuthResponse registerUser(UserRegistrationRequest userRegistrationRequest){

        try{
            log.info("[AuthService:registerUser]User Registration Started with :::{}",userRegistrationRequest);

            Optional<UserInfoEntity> user = userRepository.findByEmailAddress(userRegistrationRequest.getUserEmail());
            if(user.isPresent()){
                throw new Exception("User Already Exist");
            }

            UserInfoEntity userDetailsEntity = userInfoMapper.mapUserRegistrationToUserInfoEntity(userRegistrationRequest);
            Authentication authentication = createAuthenticationObject(userDetailsEntity);

            // Generate a JWT token
            String accessToken = jwtTokenGenerator.generateAccessToken(authentication);

            UserInfoEntity savedUserDetails = userRepository.save(userDetailsEntity);

            log.info("[AuthService:registerUser] User:{} Successfully registered",savedUserDetails.getUsername());
            return   AuthResponse.builder()
                    .accessToken(accessToken)
                    .accessTokenExpiry(30 * 60)
                    .userName(savedUserDetails.getUsername())
                    .tokenType(TokenType.Bearer)
                    .build();


        }catch (Exception e){
            log.error("[AuthService:registerUser]Exception while registering the user:"+e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e.getMessage());
        }

    }
}
