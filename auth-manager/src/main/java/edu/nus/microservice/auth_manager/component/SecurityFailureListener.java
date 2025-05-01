package edu.nus.microservice.auth_manager.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authorization.event.AuthorizationDeniedEvent;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SecurityFailureListener {

    @Component
    @Slf4j
    public static class AuthenticationFailureEventListener
            implements ApplicationListener<AbstractAuthenticationFailureEvent> {
        @Override
        public void onApplicationEvent(AbstractAuthenticationFailureEvent event) {
            Object principal = event.getAuthentication().getPrincipal();
            String remoteAddress = "N/A";
            if (event.getAuthentication().getDetails() instanceof WebAuthenticationDetails details) {
                remoteAddress = details.getRemoteAddress();
            }

            log.warn("Authentication Failure: Principal='{}', IP='{}', Type='{}', Message='{}'",
                    principal,
                    remoteAddress,
                    event.getClass().getSimpleName(),
                    event.getException().getMessage());
        }
    }

    @Component
    @Slf4j
    public static class AuthorizationDeniedEventListener implements ApplicationListener<AuthorizationDeniedEvent> {
        @Override
        public void onApplicationEvent(AuthorizationDeniedEvent event) {
            Object principal = event.getAuthentication().get().getPrincipal();
            String remoteAddress = "N/A";
            if (event.getAuthentication().get().getDetails() instanceof WebAuthenticationDetails details) {
                remoteAddress = details.getRemoteAddress();
            }
            log.warn("Authorization Denied: Principal='{}', IP='{}', Type='{}', Authorities='{}'",
                    principal,
                    remoteAddress,
                    event.getClass().getSimpleName(),
                    event.getAuthentication().get().getAuthorities());
        }
    }
}