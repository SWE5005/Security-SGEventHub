package edu.nus.microservice.auth_manager.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SampleControllerTest {
    @Mock
    private Principal principal;
    @Mock
    private OAuth2User oAuth2User;
    @InjectMocks
    private SampleController sampleController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void welcomeAdmin_ShouldReturnWelcomeMessage() {
        when(principal.getName()).thenReturn("adminUser");
        String result = sampleController.welcomeAdmin(principal);
        assertTrue(result.contains("Welcome Admin:adminUser"));
    }

    @Test
    void welcomeEventManager_ShouldReturnWelcomeMessage() {
        when(principal.getName()).thenReturn("eventManager");
        String result = sampleController.welcomeEventManager(principal);
        assertTrue(result.contains("Welcome EventManager:eventManager"));
    }

    @Test
    void welcomeUser_ShouldReturnWelcomeMessage() {
        when(oAuth2User.getName()).thenReturn("endUser");
        String result = sampleController.welcomeUser(oAuth2User);
        assertTrue(result.contains("Welcome User:endUser"));
    }
} 