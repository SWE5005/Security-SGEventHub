package edu.nus.microservice.auth_manager.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class SpringSecurityConfigTest {
    @Test
    void testPasswordEncoderBean() {
        PasswordEncoder encoder = SpringSecurityConfig.passwordEncoder();
        assertNotNull(encoder);
        assertTrue(encoder.matches("test", encoder.encode("test")));
    }
} 