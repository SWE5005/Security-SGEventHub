package edu.nus.microservice.auth_manager.component;

import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.service.ManageUserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthSuccessHandler
  extends SavedRequestAwareAuthenticationSuccessHandler {

  @Value("${frontend.url}")
  private String frontendUrl;

  @Autowired
  private ManageUserService userService;

  @Autowired
  private UserInfoMapper userInfoMapper;

  @Override
  public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
  ) throws IOException, ServletException {
    OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
    if (
      "google".equals(
          oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
        )
    ) {
      log.info("[CustomAuthSuccessHandler:onAuthenticationSuccess] Google Authentication Successful:{}", authentication.getName());
      DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
      Map<String, Object> attributes = principal.getAttributes();
      String email = attributes.getOrDefault("email", "").toString();
      String name = attributes.getOrDefault("name", "").toString();
      UserInfoEntity userEntity;
      Optional<UserInfoEntity> existingUserEntity = userService.findByEmail(
        email
      );

      if (existingUserEntity.isEmpty()) {
        log.info("[CustomAuthSuccessHandler:onAuthenticationSuccess] Account does not exist, creating new user account for user:{}", authentication.getName());
        //create account with email if account does not exist
        UserInfoEntity newUserEntity = userInfoMapper.mapGoogleUserToUserInfoEntity(
          email,
          name
        );
        userService.saveUser(newUserEntity);
        userEntity = newUserEntity;
      } else {
        userEntity = existingUserEntity.get();
      }

      DefaultOAuth2User newUser = new DefaultOAuth2User(
              List.of(new SimpleGrantedAuthority(userEntity.getRoles())),
              attributes,
              "email"
      );
      //Generate new security Auth Token with user roles
      Authentication securityAuth = new OAuth2AuthenticationToken(
              newUser,
              List.of(new SimpleGrantedAuthority("ROLE_" + userEntity.getRoles())),
              oAuth2AuthenticationToken.getAuthorizedClientRegistrationId()
      );
      SecurityContextHolder.getContext().setAuthentication(securityAuth);
      log.info(String.valueOf(securityAuth));
      log.info(SecurityContextHolder.getContext().toString());
      getRedirectStrategy()
              .sendRedirect(request, response, frontendUrl + "/callback");

    } else {
      this.setAlwaysUseDefaultTargetUrl(true);
      this.setDefaultTargetUrl(frontendUrl + "/callback");
      super.onAuthenticationSuccess(request, response, authentication);
    }
  }
}
