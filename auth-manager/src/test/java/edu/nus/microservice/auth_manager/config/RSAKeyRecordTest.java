package edu.nus.microservice.auth_manager.config;

import org.junit.jupiter.api.Test;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class RSAKeyRecordTest {
    @Test
    void testConstructorAndGetters() {
        RSAPublicKey pub = mock(RSAPublicKey.class);
        RSAPrivateKey priv = mock(RSAPrivateKey.class);
        RSAKeyRecord record = new RSAKeyRecord(pub, priv);
        assertEquals(pub, record.rsaPublicKey());
        assertEquals(priv, record.rsaPrivateKey());
    }
} 