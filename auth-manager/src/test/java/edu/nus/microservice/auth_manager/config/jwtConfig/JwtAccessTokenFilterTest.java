package edu.nus.microservice.auth_manager.config.jwtConfig;

import edu.nus.microservice.auth_manager.config.RSAKeyRecord;
import edu.nus.microservice.auth_manager.utils.JwtTokenUtils;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class JwtAccessTokenFilterTest {
    @Test
    void testClassExists() {
        RSAKeyRecord rsaKeyRecord = mock(RSAKeyRecord.class);
        JwtTokenUtils jwtTokenUtils = mock(JwtTokenUtils.class);
        JwtAccessTokenFilter filter = new JwtAccessTokenFilter(rsaKeyRecord, jwtTokenUtils);
        assertNotNull(filter);
    }
} 