package edu.nus.microservice.auth_manager.component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

@Component
public class AuthLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = (Logger) LoggerFactory.getLogger(AuthLoggingFilter.class);

    private static final List<String> pathsToLog = List.of(
            "/api/auth/google/",
            "/oauth2/",
            "/login/oauth2/"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Check if path starts with any of the specified prefixes
        if (pathsToLog.stream().anyMatch(path::startsWith)) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null) {
                logger.info("Request to {} is authenticated: {}"+path+authentication.isAuthenticated());
            } else {
                logger.info("Request to {} has no authentication"+path);
            }
        }

        filterChain.doFilter(request, response);
    }


}

