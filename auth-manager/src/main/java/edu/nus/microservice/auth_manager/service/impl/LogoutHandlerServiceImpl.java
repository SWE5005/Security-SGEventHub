package edu.nus.microservice.auth_manager.service.impl;

import edu.nus.microservice.auth_manager.config.RSAKeyRecord;
import edu.nus.microservice.auth_manager.dto.TokenType;
import edu.nus.microservice.auth_manager.entity.RefreshTokenEntity;
import edu.nus.microservice.auth_manager.repository.RefreshTokenRepo;
import edu.nus.microservice.auth_manager.utils.JwtTokenUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class LogoutHandlerServiceImpl implements LogoutHandler {

    private final RefreshTokenRepo refreshTokenRepo;
    private final RSAKeyRecord rsaKeyRecord;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(!authHeader.startsWith(TokenType.Bearer.name())){
            return;
        }
        //get userid from jwt token
        JwtDecoder jwtDecoder = NimbusJwtDecoder
                .withPublicKey(rsaKeyRecord.rsaPublicKey())
                .build();

        String tokenStr = authHeader.substring(7);
        Jwt jwtToken = jwtDecoder.decode(tokenStr);

        String id = (String) jwtToken.getClaims().get("userid");

        UUID userId = UUID.fromString(id);

        List<RefreshTokenEntity> tokenList  = refreshTokenRepo.findAllByUserId(userId);
        //set refresh_token status to revoked
        tokenList.forEach(token -> {
            token.setRevoked(true);
            refreshTokenRepo.save(token);
        });
        // 👇 Remove the refresh_token cookie
        Cookie deleteCookie = new Cookie("refresh_token", null);
        deleteCookie.setHttpOnly(true);
        deleteCookie.setSecure(true);
        deleteCookie.setPath("/");
        deleteCookie.setMaxAge(0);
        response.addCookie(deleteCookie);
    }
}