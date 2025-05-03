package edu.nus.microservice.auth_manager.controller;

import edu.nus.microservice.auth_manager.dto.ApiResponse;
import edu.nus.microservice.auth_manager.dto.FeedbackRequest;
import edu.nus.microservice.auth_manager.service.FeedbackService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@Slf4j
public class FeedbackController {

  private final FeedbackService feedbackService;

  @PreAuthorize("hasAnyAuthority('SCOPE_USER','SCOPE_EVENT','SCOPE_READ')")
  @PostMapping(path = "/create")
  @ResponseStatus(HttpStatus.OK)
  public ResponseEntity<?> createFeedback(
      Authentication authentication,
      @RequestBody FeedbackRequest feedbackRequest) {
    log.info(
        "[FeedbackController:createFeedback]Request to create feedback started for user: {}",
        authentication.getName());
    try {
      Jwt jwt = (Jwt) authentication.getCredentials();
      String userid = (String) jwt.getClaims().get("userid");
      return ResponseEntity.ok(
          new ApiResponse<>(
              feedbackService.createFeedback(feedbackRequest, userid),
              HttpStatus.OK.value(),
              null));
    } catch (Exception e) {
      log.error(
          "[FeedbackController:createFeedback] Failed to create feedback",
          e);
      ApiResponse<String> response = new ApiResponse<>(
          "Failed to create feedback",
          HttpStatus.INTERNAL_SERVER_ERROR.value(),
          null);
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("hasAnyAuthority('SCOPE_USER','SCOPE_EVENT','SCOPE_READ')")
  @GetMapping(path = "/{eventId}/list")
  public ResponseEntity<?> getFeedbackList(
      Principal principal,
      @PathVariable @Valid @NotNull String eventId) {
    log.info(
        "[FeedbackController:getFeedbackList]Request to get feedback list started for event: {}",
        eventId);
    try {
      return ResponseEntity.ok(feedbackService.getFeedbackByEventId(eventId));
    } catch (Exception e) {
      log.error(
          "[FeedbackController:getFeedbackList] Failed to get feedback list",
          e);
      ApiResponse<String> response = new ApiResponse<>(
          "Failed to get feedback list",
          HttpStatus.INTERNAL_SERVER_ERROR.value(),
          null);
      return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
