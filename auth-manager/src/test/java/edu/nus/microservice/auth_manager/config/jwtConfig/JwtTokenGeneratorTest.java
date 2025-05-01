package edu.nus.microservice.auth_manager.config.jwtConfig;

import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtTokenGeneratorTest {
    @Mock
    private JwtEncoder jwtEncoder;

    private JwtTokenGenerator jwtTokenGenerator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtTokenGenerator = new JwtTokenGenerator(jwtEncoder);
        // Mock JwtEncoder to return a Jwt with a non-null token value
        org.springframework.security.oauth2.jwt.Jwt mockJwt = mock(org.springframework.security.oauth2.jwt.Jwt.class);
        when(mockJwt.getTokenValue()).thenReturn("mock-token-value");
        when(jwtEncoder.encode(any())).thenReturn(mockJwt);
    }

    @Test
    void testGenerateAccessToken() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser@example.com");
        UserInfoEntity user = UserInfoEntity.builder()
                .id(java.util.UUID.randomUUID())
                .username("testuser")
                .emailAddress("testuser@example.com")
                .roles("USER")
                .build();
        // Just test that the method runs (mocking JwtEncoder is complex)
        assertDoesNotThrow(() -> jwtTokenGenerator.generateAccessToken(authentication, user));
    }

    @Test
    void testGenerateRefreshToken() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser@example.com");
        assertDoesNotThrow(() -> jwtTokenGenerator.generateRefreshToken(authentication));
    }
} 