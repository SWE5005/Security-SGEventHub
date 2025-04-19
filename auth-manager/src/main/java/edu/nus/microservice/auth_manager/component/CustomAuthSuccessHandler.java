package edu.nus.microservice.auth_manager.component;

import edu.nus.microservice.auth_manager.entity.UserInfoEntity;
import edu.nus.microservice.auth_manager.mapper.UserInfoMapper;
import edu.nus.microservice.auth_manager.service.ManageUserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomAuthSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Autowired
    private ManageUserService userService;
    @Autowired
    private UserInfoMapper userInfoMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();
            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();
            userService.findByEmail(email)
                    .ifPresentOrElse(user -> {
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(user.getRoles())),
                                attributes, "email");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(user.getRoles())),
                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    }, () -> {
                        UserInfoEntity userEntity = userInfoMapper.mapGoogleUserToUserInfoEntity(email,name);
                        userService.saveUser(userEntity);
                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(userEntity.getRoles())),
                                attributes, "email");
                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(userEntity.getRoles())),
                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
                    });
        }
        this.setAlwaysUseDefaultTargetUrl(true);
        this.setDefaultTargetUrl(frontendUrl+"/home");
        super.onAuthenticationSuccess(request, response, authentication);

    }
}
