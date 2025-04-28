package edu.nus.microservice.auth_manager.config.jwtConfig;

import edu.nus.microservice.auth_manager.config.RSAKeyRecord;
import edu.nus.microservice.auth_manager.repository.RefreshTokenRepo;
import edu.nus.microservice.auth_manager.utils.JwtTokenUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.io.IOException;
import java.security.interfaces.RSAPublicKey;

class JwtRefreshTokenFilterTest {
    @Test
    void testClassExists() {
        RSAKeyRecord rsaKeyRecord = mock(RSAKeyRecord.class);
        JwtTokenUtils jwtTokenUtils = mock(JwtTokenUtils.class);
        RefreshTokenRepo refreshTokenRepo = mock(RefreshTokenRepo.class);
        JwtRefreshTokenFilter filter = new JwtRefreshTokenFilter(rsaKeyRecord, jwtTokenUtils, refreshTokenRepo);
        assertNotNull(filter);
    }

    @Test
    void doFilterInternal_shouldHandleMissingToken() throws ServletException, IOException {
        RSAKeyRecord rsaKeyRecord = mock(RSAKeyRecord.class);
        RSAPublicKey mockKey = mock(RSAPublicKey.class);
        when(rsaKeyRecord.rsaPublicKey()).thenReturn(mockKey);
        JwtTokenUtils jwtTokenUtils = mock(JwtTokenUtils.class);
        RefreshTokenRepo refreshTokenRepo = mock(RefreshTokenRepo.class);
        JwtRefreshTokenFilter filter = new JwtRefreshTokenFilter(rsaKeyRecord, jwtTokenUtils, refreshTokenRepo);
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        when(request.getCookies()).thenReturn(null);
        filter.doFilterInternal(request, response, chain);
        verify(chain, times(1)).doFilter(request, response);
    }
} 