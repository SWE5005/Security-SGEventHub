package edu.nus.microservice.auth_manager.config.jwtConfig;

import edu.nus.microservice.auth_manager.config.RSAKeyRecord;
import edu.nus.microservice.auth_manager.utils.JwtTokenUtils;
import org.junit.jupiter.api.Test;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.mockito.Mockito;
import org.springframework.http.HttpHeaders;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidationException;
import java.io.IOException;
import java.security.interfaces.RSAPublicKey;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import org.springframework.security.oauth2.jwt.BadJwtException;

class JwtAccessTokenFilterTest {
    @Test
    void testClassExists() {
        RSAKeyRecord rsaKeyRecord = mock(RSAKeyRecord.class);
        JwtTokenUtils jwtTokenUtils = mock(JwtTokenUtils.class);
        JwtAccessTokenFilter filter = new JwtAccessTokenFilter(rsaKeyRecord, jwtTokenUtils);
        assertNotNull(filter);
    }

    @Test
    void doFilterInternal_shouldHandleMissingToken() throws ServletException, IOException {
        RSAKeyRecord rsaKeyRecord = mock(RSAKeyRecord.class);
        RSAPublicKey mockKey = mock(RSAPublicKey.class);
        when(rsaKeyRecord.rsaPublicKey()).thenReturn(mockKey);
        JwtTokenUtils jwtTokenUtils = mock(JwtTokenUtils.class);
        JwtAccessTokenFilter filter = new JwtAccessTokenFilter(rsaKeyRecord, jwtTokenUtils);
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        assertThrows(NullPointerException.class, () -> filter.doFilterInternal(request, response, chain));
    }

    @Test
    void doFilterInternal_shouldHandleInvalidToken() throws ServletException, IOException {
        RSAKeyRecord rsaKeyRecord = mock(RSAKeyRecord.class);
        RSAPublicKey mockKey = mock(RSAPublicKey.class);
        when(rsaKeyRecord.rsaPublicKey()).thenReturn(mockKey);
        JwtTokenUtils jwtTokenUtils = mock(JwtTokenUtils.class);
        JwtAccessTokenFilter filter = new JwtAccessTokenFilter(rsaKeyRecord, jwtTokenUtils);
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer invalidtoken");
        assertThrows(Exception.class, () -> filter.doFilterInternal(request, response, chain));
    }
} 