package edu.nus.microservice.auth_manager.config;

import org.junit.jupiter.api.Test;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RSAKeyRecordTest {
    @Test
    void testConstructorAndGetters() {
        RSAPublicKey pub = mock(RSAPublicKey.class);
        RSAPrivateKey priv = mock(RSAPrivateKey.class);
        RSAKeyRecord record = new RSAKeyRecord(pub, priv);
        assertEquals(pub, record.rsaPublicKey());
        assertEquals(priv, record.rsaPrivateKey());
    }

    @Test
    void testRSAKeyRecordGetters() {
        RSAPublicKey publicKey = mock(RSAPublicKey.class);
        RSAPrivateKey privateKey = mock(RSAPrivateKey.class);
        RSAKeyRecord record = new RSAKeyRecord(publicKey, privateKey);
        assertEquals(publicKey, record.rsaPublicKey());
        assertEquals(privateKey, record.rsaPrivateKey());
    }
} 