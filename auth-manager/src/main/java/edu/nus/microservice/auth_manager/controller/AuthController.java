package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.UserRegistrationRequest;
import edu.nus.microservice.auth_manager.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/sign-in")
    public ResponseEntity<?> authenticateUser(Authentication authentication){

        return ResponseEntity.ok(authService.getJwtTokensAfterAuthentication(authentication));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationRequest userRegistrationRequest,
                                          BindingResult bindingResult){

        log.info("[AuthController:registerUser]Signup Process Started for user:{}",userRegistrationRequest.getUserEmail());
        if (bindingResult.hasErrors()) {
            List<String> errorMessage = bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .toList();
            log.error("[AuthController:registerUser]Errors in user:{}",errorMessage);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
        }
        return ResponseEntity.ok(authService.registerUser(userRegistrationRequest));
    }


}
