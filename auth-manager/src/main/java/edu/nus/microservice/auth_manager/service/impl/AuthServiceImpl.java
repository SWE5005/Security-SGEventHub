package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.dto.AuthResponse;
import edu.nus.microservice.auth_manager.dto.TokenType;
import edu.nus.microservice.auth_manager.config.jwtConfig.JwtTokenGenerator;
import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.entity.RefreshTokenEntity;
import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.repository.RefreshTokenRepo;
import edu.nus.microservice.auth_manager.repository.UserRepository;
import edu.nus.microservice.auth_manager.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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

import java.util.*;


@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class AuthServiceImpl implements  AuthService {

    @Autowired private final UserRepository userRepository;
    private final JwtTokenGenerator jwtTokenGenerator;
    private final UserInfoMapper userInfoMapper;
    private final RefreshTokenRepo refreshTokenRepo;

    public AuthResponse getJwtTokensAfterAuthentication(Authentication authentication, HttpServletResponse response) {
        try
        {
            UserInfoEntity userInfoEntity = userRepository.findByEmailAddress(authentication.getName())
                    .orElseThrow(()->{
                        log.error("[AuthService:userSignInAuth] User :{} not found",authentication.getName());
                        return new ResponseStatusException(HttpStatus.NOT_FOUND,"USER NOT FOUND ");});

            String accessToken = jwtTokenGenerator.generateAccessToken(authentication, userInfoEntity);
            String refreshToken = jwtTokenGenerator.generateRefreshToken(authentication);

            creatRefreshTokenCookie(response,refreshToken);

            //save refresh token
            saveUserRefreshToken(userInfoEntity,refreshToken);

            log.info("[AuthService:userSignInAuth] Access token for user:{}, has been generated",userInfoEntity.getUsername());
            return  AuthResponse.builder()
                    .accessToken(accessToken)
                    .accessTokenExpiry(5 * 60)
                    .userName(userInfoEntity.getUsername())
                    .emailAddress(userInfoEntity.getEmailAddress())
                    .tokenType(TokenType.Bearer)
                    .build();


        }catch (Exception e){
            log.error("[AuthService:userSignInAuth]Exception while authenticating the user due to :"+e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Please Try Again");
        }
    }

    private Authentication createAuthenticationObject(UserInfoEntity userInfoEntity) {
        // Extract user details from UserInfoEntity
        String roleText = "ROLE_";
        String username = userInfoEntity.getEmailAddress();
        String password = userInfoEntity.getPassword();
        String roles = userInfoEntity.getRoles();
        // Extract authorities from roles (comma-separated)
        String[] roleArray = (roleText + roles).split(",");
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
            String accessToken = jwtTokenGenerator.generateAccessToken(authentication, userDetailsEntity);

            UserInfoEntity savedUserDetails = userRepository.save(userDetailsEntity);

            log.info("[AuthService:registerUser] User:{} Successfully registered",savedUserDetails.getUsername());
            return   AuthResponse.builder()
                    .accessToken(accessToken)
                    .accessTokenExpiry(30 * 60)
                    .userName(savedUserDetails.getUsername())
                    .emailAddress(savedUserDetails.getEmailAddress())
                    .tokenType(TokenType.Bearer)
                    .build();


        }catch (Exception e){
            log.error("[AuthService:registerUser]Exception while registering the user:"+e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e.getMessage());
        }

    }

    public Object getAccessTokenUsingRefreshToken(String authorizationHeader) {

        if(!authorizationHeader.startsWith(TokenType.Bearer.name())){
            return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Please verify your token type");
        }

        final String refreshToken = authorizationHeader.substring(7);

        //Find refreshToken from database and should not be revoked : Same thing can be done through filter.
        var refreshTokenEntity = refreshTokenRepo.findByRefreshToken(refreshToken)
                .filter(tokens-> !tokens.isRevoked())
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Refresh token revoked"));

        UserInfoEntity userInfoEntity = refreshTokenEntity.getUser();

        //Now create the Authentication object
        Authentication authentication =  createAuthenticationObject(userInfoEntity);

        //Use the authentication object to generate new accessToken as the Authentication object that we will have may not contain correct role.
        String accessToken = jwtTokenGenerator.generateAccessToken(authentication, userInfoEntity);

        return  AuthResponse.builder()
                .accessToken(accessToken)
                .accessTokenExpiry(5 * 60)
                .userName(userInfoEntity.getUsername())
                .emailAddress(userInfoEntity.getEmailAddress())
                .tokenType(TokenType.Bearer)
                .build();
    }

    private void saveUserRefreshToken(UserInfoEntity userInfoEntity, String refreshToken) {
        var refreshTokenEntity = RefreshTokenEntity.builder()
                .user(userInfoEntity)
                .refreshToken(refreshToken)
                .revoked(false)
                .build();
        refreshTokenRepo.save(refreshTokenEntity);
    }

    private Cookie creatRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie refreshTokenCookie = new Cookie("refresh_token",refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setMaxAge(15 * 24 * 60 * 60 ); // in seconds
        response.addCookie(refreshTokenCookie);
        return refreshTokenCookie;
    }

}
