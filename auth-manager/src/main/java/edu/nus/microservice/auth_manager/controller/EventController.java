package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.ApiResponse;
import edu.nus.microservice.auth_manager.dto.EventRequest;
import edu.nus.microservice.auth_manager.service.EventService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PreAuthorize("hasAnyAuthority('SCOPE_READ','SCOPE_EVENT')")
    @GetMapping (path="/all")
    public ResponseEntity<?> getAllEvents(Authentication authentication) {
        log.info("[EventController:getAllEvents]Request to get event list started for user: {}",authentication.getName());
        try {
            //get userid from token
            Jwt jwt = (Jwt) authentication.getCredentials();
            String userid = (String) jwt.getClaims().get("userid");
            return ResponseEntity.ok(eventService.getAllEvents(userid));
        }catch (Exception e) {
            log.error("[EventController:getAllEvents] Failed to get event list", e);
            ApiResponse<String> response =
                    new ApiResponse<>("Failed to get event list", HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAnyAuthority('SCOPE_READ','SCOPE_EVENT')")
    @GetMapping (path="/{eventId}/details")
    public ResponseEntity<?> getEventDetails(Authentication authentication, @PathVariable @Valid @NotNull String eventId) {
        log.info("[EventController:getEventDetails]Request to get event details started for user: {}",authentication.getName());
        try {
            Jwt jwt = (Jwt) authentication.getCredentials();
            String userid = (String) jwt.getClaims().get("userid");
            return ResponseEntity.ok(eventService.getEventDetails(eventId,userid));
        }catch (Exception e) {
            log.error("[EventController:getEventDetails] Failed to get event details", e);
            ApiResponse<String> response =
                    new ApiResponse<>("Failed to get event details", HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_EVENT')")
    @PostMapping (path="/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createEvent(Authentication authentication, @RequestBody EventRequest eventRequest) {
        log.info("[EventController:createEvent]Request to create event started for user: {}",authentication.getName());
        try {
            //get userid from token
            Jwt jwt = (Jwt) authentication.getCredentials();
            String userid = (String) jwt.getClaims().get("userid");
            eventService.createEvent(eventRequest,userid);
            return ResponseEntity.ok("New event created successfully.");
        }catch (Exception e) {
            log.error("[EventController:createEvent] Failed to create event", e);
            ApiResponse<String> response =
                    new ApiResponse<>("Failed to create event.", HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasAnyAuthority('SCOPE_READ')")
    @GetMapping (path="/{eventId}/register")
    public ResponseEntity<?> registerEvent(Authentication authentication, @PathVariable @Valid @NotNull String eventId) {
        log.info("[EventController:registerEvent]Request to register event started for user: {}",authentication.getName());
        try {
            Jwt jwt = (Jwt) authentication.getCredentials();
            String userid = (String) jwt.getClaims().get("userid");

            return ResponseEntity.ok(new ApiResponse<>(
                    eventService.registerEvent(eventId,userid),
                    HttpStatus.OK.value(),
                    null));
        }catch (Exception e) {
            log.error("[EventController:registerEvent] Failed to register event", e);
            ApiResponse<String> response =
                    new ApiResponse<>("Failed to register event", HttpStatus.INTERNAL_SERVER_ERROR.value(), null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
