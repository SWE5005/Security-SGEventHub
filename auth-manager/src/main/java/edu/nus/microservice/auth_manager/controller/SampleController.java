package edu.nus.microservice.auth_manager.controller;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;

@RestController
//@RequestMapping("/welcome")
@RequiredArgsConstructor
public class SampleController {
//    @PreAuthorize("hasAuthority('SCOPE_USER')")
    @GetMapping("/admin")
    public String welcomeAdmin(Principal principal) {
        String userName = principal.getName();
        return "Spring Security Authentication Example - Welcome Admin:" + userName;
    }

//    @PreAuthorize("hasAuthority('SCOPE_EVENT')")
    @GetMapping("/event")
    public String welcomeEventManager(Principal principal) {
        String userName = principal.getName();
        return "Spring Security Authentication Example - Welcome EventManager:" + userName;
    }

//    @PreAuthorize("hasAuthority('SCOPE_READ')")
    @GetMapping("/user")
    public String welcomeUser(@AuthenticationPrincipal OAuth2User principal) {
        String userName = principal.getName();
        return "Spring Security Authentication Example - Welcome User:" + userName;
    }

}
